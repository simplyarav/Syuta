import { NextResponse } from 'next/server';
import crypto from 'crypto';
import dbConnect from '@/lib/mongodb';
import Order, { canTransition } from '@/models/Order';
import Product from '@/models/Product';
import { redis } from '@/lib/redis';
import { webhookRateLimit } from '@/lib/rate-limit';
import { calculateAndSaveReturnRisk } from '@/lib/returnRisk';

export async function POST(req: Request) {
  try {
    const ip = req.headers.get("x-forwarded-for") ?? "127.0.0.1";
    if (process.env.UPSTASH_REDIS_REST_URL) {
      const { success } = await webhookRateLimit.limit(ip);
      if (!success) {
        return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
      }
    }

    const bodyText = await req.text();
    const signature = req.headers.get('x-razorpay-signature');

    if (!signature) {
      console.warn('[Webhook] Missing signature');
      return NextResponse.json({ error: 'Missing signature' }, { status: 400 });
    }

    const secret = process.env.RAZORPAY_WEBHOOK_SECRET;
    if (!secret) {
      console.error('[Webhook] RAZORPAY_WEBHOOK_SECRET is not configured');
      return NextResponse.json({ error: 'Server misconfiguration' }, { status: 500 });
    }

    const expectedSignature = crypto
      .createHmac('sha256', secret)
      .update(bodyText)
      .digest('hex');

    if (expectedSignature !== signature) {
      console.warn('[Webhook] Invalid signature');
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
    }

    const event = JSON.parse(bodyText);
    const payload = event.payload?.payment?.entity;
    if (!payload || !payload.order_id) {
      console.warn('[Webhook] Missing order_id in payload');
      return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
    }

    await dbConnect();
    const order = await Order.findOne({ razorpayOrderId: payload.order_id });

    if (!order) {
      console.warn(`[Webhook] Order not found for Razorpay ID: ${payload.order_id}`);
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    console.log(`[Webhook] Received event ${event.event} for order ${order._id}`);

    if (event.event === 'payment.captured') {
      if (canTransition(order.status, 'paid')) {
        order.status = 'paid';
        order.razorpayPaymentId = payload.id;
        await order.save();
        
        // Commit the inventory deduction permanently to MongoDB, 
        // and release the temporary Redis lock since checkout is complete.
        for (const item of order.items) {
          await Product.findByIdAndUpdate(item.product, { $inc: { stock: -item.quantity } });
          if (process.env.UPSTASH_REDIS_REST_URL) {
            await redis.decrby(`stock:reserved:${item.product.toString()}`, item.quantity);
          }
        }

        // Trigger post-purchase fraud scoring asynchronously so it doesn't block the webhook response time
        calculateAndSaveReturnRisk(order._id.toString());
        
        console.log(`[Webhook] Order ${order._id} transitioned to paid and stock committed`);
      } else {
        console.log(`[Webhook] Ignored payment.captured for order ${order._id}. Current status: ${order.status}`);
      }
    } else if (event.event === 'payment.failed') {
      if (canTransition(order.status, 'failed')) {
        order.status = 'failed';
        await order.save();
        
        // Release the Redis inventory lock since the payment failed, making stock available for other buyers again
        for (const item of order.items) {
          if (process.env.UPSTASH_REDIS_REST_URL) {
            await redis.decrby(`stock:reserved:${item.product.toString()}`, item.quantity);
          }
        }
        
        console.log(`[Webhook] Order ${order._id} transitioned to failed and reservation released`);
      } else {
        console.log(`[Webhook] Ignored payment.failed for order ${order._id}. Current status: ${order.status}`);
      }
    }

    return NextResponse.json({ received: true });
  } catch (error: any) {
    console.error('[Webhook] Error processing webhook:', error);
    return NextResponse.json({ error: 'Internal server error processing webhook' }, { status: 500 });
  }
}
