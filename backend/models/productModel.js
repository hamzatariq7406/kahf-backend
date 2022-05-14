import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true },
    rating: {
      type: Number,
      required: true,
      default: 0,
      min: 0,
      max: 5,
    },
    comment: { type: String, required: true },
  },
  { timestamps: true }
);

const productSchema = new mongoose.Schema(
  {
    productName: { type: String, required: true },
    description: { type: String, required: true },
    category: { type: String, required: true },
    images: [{ type: String }],
    brandName: { type: String },
    heroImage: { type: String, required: true },
    listPrice: { type: Number, default: 0.0, required: true },
    salePrice: { type: Number, default: 0.0, required: true },
    quantity: { type: String, default: 0, required: true },
  },
  { timestamps: true }
);
const Product = mongoose.model('Product', productSchema);
export default Product;
