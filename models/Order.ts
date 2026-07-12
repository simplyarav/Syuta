import mongoose, { Schema, model, models } from 'mongoose';

export function canTransition(current: string, next: string): boolean {
  const allowedTransitions: Record<string, string[]> = {
    pending: ['paid', 'failed'],
    paid: ['shipped', 'refunded'],
    shipped: ['refunded'],
    failed: [],
    refunded: []
  };
  return allowedTransitions[current]?.includes(next) || false;
}

const orderItemSchema = new Schema({
  product: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
  quantity: { type: Number, required: true, min: 1 },
  price: { type: Number, required: true },
}, { _id: false });

const refundSchema = new Schema({
  amount: { type: Number, required: true },
  reason: { type: String, required: true },
  razorpayRefundId: { type: String, required: true },
  processedAt: { type: Date, default: Date.now }
}, { _id: false });

const returnRiskSchema = new Schema({
  score: { type: Number, required: true },
  factors: [{ type: String }],
  calculatedAt: { type: Date, default: Date.now }
}, { _id: false });

const shippingAddressSchema = new Schema({
  fullName: { type: String, required: true },
  phone: { type: String, required: true },
  line1: { type: String, required: true },
  line2: { type: String },
  city: { type: String, required: true },
  state: { type: String, required: true },
  pincode: { type: String, required: true },
}, { _id: false });

const orderSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  items: [orderItemSchema],
  totalAmount: { type: Number, required: true },
  status: { type: String, enum: ['pending', 'paid', 'shipped', 'failed', 'refunded'], default: 'pending' },
  razorpayOrderId: { type: String },
  razorpayPaymentId: { type: String },
  refunds: [refundSchema],
  returnRisk: { type: returnRiskSchema },
  shippingAddress: { type: shippingAddressSchema, required: false },
}, { timestamps: true });

const Order = models.Order || model('Order', orderSchema);
export default Order;
