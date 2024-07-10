import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    images: { type: [String], required: true },
    price: { type: Number, required: true },
    description: { type: String, required: true },
    isBlocked: { type: Boolean, required: true, default: false },
    stock: { type: Number, required: true, default: 0 },
  },
  {
    timestamps: true,
  }
);

const ProductModel =
  mongoose.models.Product || mongoose.model("Product", productSchema);

export default ProductModel;
export type Product = {
  id?: string;
  _id: string;
  name: string;
  description: string;
  price: number;
  images: string[];
  isBlocked: boolean;
  stock: number;
  createdAt: string;
  updatedAt: string;
};
