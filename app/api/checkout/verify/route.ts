import { NextResponse } from 'next/server';
import crypto from 'crypto';
import dbConnect from '@/lib/mongodb';
import Order, { canTransition } from '@/models/Order';
import Product from '@/models/Product';
import { redis } from '@/lib/redis';
import { calculateAndSaveReturnRisk } from '@/lib/returnRisk';

export async function POST(req: Request) {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = await req.json();

    const body = razorpay_order_id + '|' + razorpay_payment_id;
    
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET!)
      .update(body.toString())
      .digest('hex');

    const isAuthentic = expectedSignature === razorpay_signature;

    if (isAuthentic) {
      await dbConnect();
      
      const order = await Order.findOne({ razorpayOrderId: razorpay_order_id });
      if (!order) {
        return NextResponse.json({ success: false, error: 'Order not found' }, { status: 404 });
      }

      if (canTransition(order.status, 'paid')) {
        order.status = 'paid';
        order.razorpayPaymentId = razorpay_payment_id;
        await order.save();
        
        // Finalize inventory: deduct from DB, clear from Redis
        for (const item of order.items) {
          await Product.findByIdAndUpdate(item.product, { $inc: { stock: -item.quantity } });
          if (process.env.UPSTASH_REDIS_REST_URL) {
            await redis.decrby(`stock:reserved:${item.product.toString()}`, item.quantity);
          }
        }

        // Calculate Return Risk asynchronously
        calculateAndSaveReturnRisk(order._id.toString());
        
        console.log(`[Verify] Order ${order._id} transitioned to paid via client verification and stock committed`);
      } else {
        console.log(`[Verify] Ignored transition to paid for order ${order._id}. Current status: ${order.status}`);
      }
      
      return NextResponse.json({ success: true, message: 'Payment verified successfully' });
    } else {
      return NextResponse.json({ success: false, error: 'Invalid signature' }, { status: 400 });
    }

  } catch (error: any) {
    console.error('Verify Payment Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
