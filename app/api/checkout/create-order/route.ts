import { NextResponse } from 'next/server';
import Razorpay from 'razorpay';
import dbConnect from '@/lib/mongodb';
import Product from '@/models/Product';
import Order from '@/models/Order';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { redis, RESERVE_STOCK_SCRIPT } from '@/lib/redis';
import { checkoutRateLimit } from '@/lib/rate-limit';

export async function POST(req: Request) {
  const reservedItems: {productId: string, quantity: number}[] = [];
  
  const rollbackReservations = async (reservations: {productId: string, quantity: number}[]) => {
    if (!process.env.UPSTASH_REDIS_REST_URL) return;
    for (const res of reservations) {
      await redis.decrby(`stock:reserved:${res.productId}`, res.quantity);
    }
  };

  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized. Please log in.' }, { status: 401 });
    }

    const ip = req.headers.get("x-forwarded-for") ?? "127.0.0.1";
    if (process.env.UPSTASH_REDIS_REST_URL) {
      const { success } = await checkoutRateLimit.limit(ip);
      if (!success) {
        return NextResponse.json({ error: 'Too many checkout attempts. Please wait.' }, { status: 429 });
      }
    }

    const { items, shippingAddress } = await req.json();
    
    // Strict input validation
    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: 'Cart is empty or invalid format' }, { status: 400 });
    }
    
    if (items.length > 50) {
      return NextResponse.json({ error: 'Too many items in cart' }, { status: 400 });
    }

    if (!shippingAddress || typeof shippingAddress !== 'object') {
      return NextResponse.json({ error: 'Invalid shipping address format' }, { status: 400 });
    }

    const { fullName, line1, city, state, pincode, phone } = shippingAddress;
    if (!fullName || !line1 || !city || !state || !pincode || !phone) {
      return NextResponse.json({ error: 'Missing required shipping fields' }, { status: 400 });
    }
    
    // Basic structural validation
    if (String(phone).length < 10 || String(phone).length > 15) {
      return NextResponse.json({ error: 'Invalid phone number format' }, { status: 400 });
    }
    if (String(pincode).length < 4 || String(pincode).length > 10) {
      return NextResponse.json({ error: 'Invalid pincode format' }, { status: 400 });
    }

    await dbConnect();

    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID!,
      key_secret: process.env.RAZORPAY_KEY_SECRET!,
    });

    let totalAmount = 0;
    const orderItems = [];

    for (const item of items) {
      const dbProduct = await Product.findById(item._id);
      if (!dbProduct) {
        await rollbackReservations(reservedItems);
        return NextResponse.json({ error: `Product ${item.name} not found` }, { status: 404 });
      }

      // Lock inventory atomically in Redis to prevent concurrent overselling (e.g. flash sales) 
      // while the user completes the Razorpay checkout flow on the client
      if (process.env.UPSTASH_REDIS_REST_URL) {
        const reserved = await redis.eval(
          RESERVE_STOCK_SCRIPT,
          [`stock:reserved:${dbProduct._id}`], // KEYS
          [dbProduct.stock, item.quantity] // ARGV
        );

        if (reserved === 0) {
          console.warn(`[Checkout] Oversell prevented for ${dbProduct.name}. Stock: ${dbProduct.stock}, Requested: ${item.quantity}`);
          await rollbackReservations(reservedItems);
          return NextResponse.json({ error: `${dbProduct.name} is no longer available in that quantity!` }, { status: 400 });
        }
        reservedItems.push({ productId: dbProduct._id.toString(), quantity: item.quantity });
      } else {
        // Local dev fallback if Redis isn't configured
        if (dbProduct.stock < item.quantity) {
          return NextResponse.json({ error: `${dbProduct.name} is no longer available!` }, { status: 400 });
        }
      }

      totalAmount += dbProduct.price * item.quantity;
      orderItems.push({
        product: dbProduct._id,
        quantity: item.quantity,
        price: dbProduct.price,
      });
    }

    const amountInCents = Math.round(totalAmount * 100);

    // Idempotency check: prevent duplicate orders if a user refreshes or double-clicks checkout.
    // If a pending order with the exact same items already exists for this user, return the existing Razorpay Order ID.
    const existingOrder = await Order.findOne({
      user: (session.user as any).id,
      status: 'pending',
      totalAmount,
    }).sort({ createdAt: -1 });

    if (existingOrder) {
      const existingItems = existingOrder.items.map((i: any) => i.product.toString()).sort().join(',');
      const currentItems = orderItems.map(i => i.product.toString()).sort().join(',');

      if (existingItems === currentItems) {
        console.log(`[Idempotency] Returning existing pending order: ${existingOrder._id} to prevent duplicates`);
        return NextResponse.json({ 
          orderId: existingOrder.razorpayOrderId, 
          amount: amountInCents,
          dbOrderId: existingOrder._id
        });
      }
    }

    const options = {
      amount: amountInCents,
      currency: 'INR',
      receipt: `receipt_${Date.now()}`,
    };

    const razorpayOrder = await razorpay.orders.create(options);

    const newOrder = await Order.create({
      user: (session.user as any).id,
      items: orderItems,
      totalAmount,
      status: 'pending',
      razorpayOrderId: razorpayOrder.id,
      shippingAddress,
    });

    return NextResponse.json({ 
      orderId: razorpayOrder.id, 
      amount: razorpayOrder.amount,
      dbOrderId: newOrder._id
    });

  } catch (error: any) {
    console.error('Create Order Error:', error);
    await rollbackReservations(reservedItems);
    return NextResponse.json({ error: 'An internal server error occurred during checkout' }, { status: 500 });
  }
}
