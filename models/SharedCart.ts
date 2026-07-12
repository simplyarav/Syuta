import mongoose, { Schema, model, models } from 'mongoose';

const sharedCartItemSchema = new Schema({
  product: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
  name: { type: String, required: true },
  price: { type: Number, required: true },
  image: { type: String },
  quantity: { type: Number, required: true, min: 1 },
  addedBy: { type: String, required: true },
}, { _id: true }); // Keep _id for React keys

const sharedCartSchema = new Schema({
  code: { type: String, required: true, unique: true },
  items: [sharedCartItemSchema],
  createdBy: { type: Schema.Types.ObjectId, ref: 'User' },
  expiresAt: { type: Date, required: true, index: { expires: 0 } } // TTL index: auto-deletes when expiresAt is reached
}, { timestamps: true });

const SharedCart = models.SharedCart || model('SharedCart', sharedCartSchema);
export default SharedCart;
