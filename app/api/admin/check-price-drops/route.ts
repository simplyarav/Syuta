import { NextResponse } from 'next/server';
import Razorpay from 'razorpay';
import dbConnect from '@/lib/mongodb';
import Order from '@/models/Order';
import Product from '@/models/Product';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { adminRateLimit } from '@/lib/rate-limit';

// Note: In a production environment, this should be executed via a scheduled background job 
// (e.g. Vercel Cron, node-cron) rather than a manually triggered admin route.
export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any).role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const ip = req.headers.get("x-forwarded-for") ?? "127.0.0.1";
    if (process.env.UPSTASH_REDIS_REST_URL) {
      const { success } = await adminRateLimit.limit(ip);
      if (!success) {
        return NextResponse.json({ error: 'Too many admin requests' }, { status: 429 });
      }
    }

    await dbConnect();

    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID!,
      key_secret: process.env.RAZORPAY_KEY_SECRET!,
    });

    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    // 1. Find all paid orders created within the last 7 days
    const recentOrders = await Order.find({
      status: 'paid',
      createdAt: { $gte: sevenDaysAgo },
      razorpayPaymentId: { $exists: true }
    });

    const results = [];

    // 2. Compare prices and process refunds
    for (const order of recentOrders) {
      for (const item of order.items) {
        const product = await Product.findById(item.product);
        if (!product) continue;

        // Check if current price is strictly lower than the price paid at checkout
        if (product.price < item.price) {
          const priceDifference = item.price - product.price;
          const totalRefundAmount = priceDifference * item.quantity;
          
          // Check if we already refunded for this specific product drop to ensure idempotency
          const alreadyRefunded = order.refunds?.some((r: any) => r.reason === `price_drop_${product._id}`);
          if (alreadyRefunded) continue;

          console.log(`[Price Drop] Refunding $${totalRefundAmount} for order ${order._id}`);
          
          try {
            // 4. Call Razorpay Refund API
            const refund = await razorpay.payments.refund(order.razorpayPaymentId, {
              amount: Math.round(totalRefundAmount * 100), // Convert to cents/paise
              notes: {
                reason: 'Automatic price drop protection refund',
                productId: product._id.toString()
              }
            });

            // 5. Record refund on the Order
            if (!order.refunds) order.refunds = [];
            order.refunds.push({
              amount: totalRefundAmount,
              reason: `price_drop_${product._id}`,
              razorpayRefundId: refund.id,
              processedAt: new Date()
            });
            await order.save();

            results.push({ orderId: order._id, product: product.name, amount: totalRefundAmount, success: true });
          } catch (refundError: any) {
            console.error(`[Refund Failed] Order ${order._id}:`, refundError);
            results.push({ orderId: order._id, product: product.name, amount: totalRefundAmount, success: false, error: refundError.message });
          }
        }
      }
    }

    return NextResponse.json({ message: "Price drop check complete", processed: results.length, details: results });
  } catch (error: any) {
    console.error('Price Drop Check Error:', error);
    return NextResponse.json({ error: 'Internal server error checking price drops' }, { status: 500 });
  }
}
