import mongoose, { Schema, model, models } from 'mongoose';

const priceHistorySchema = new Schema({
  price: { type: Number, required: true },
  changedAt: { type: Date, default: Date.now }
}, { _id: false });

const productSchema = new Schema({
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  compareAtPrice: { type: Number },
  priceHistory: [priceHistorySchema],
  category: { type: Schema.Types.ObjectId, ref: 'Category', required: true },
  images: [{ type: String }],
  patternType: { type: String, default: 'none' },
  garmentType: { type: String, default: 'none' },
  isPlaceholderArt: { type: Boolean, default: true },
  stock: { type: Number, required: true, default: 0 },
  featured: { type: Boolean, default: false },
}, { timestamps: true });

const Product = models.Product || model('Product', productSchema);
export default Product;
