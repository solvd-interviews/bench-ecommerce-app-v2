import mongoose from "mongoose";
import CounterModel from "./CounterModel";

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    images: { type: [String], required: true },
    price: { type: Number, required: true },
    description: { type: String, required: true },
    isBlocked: { type: Boolean, required: true, default: false },
    stock: { type: Number, required: true, default: 0 },
    productNumber: { type: Number, unique: true }, // Add this field
  },
  {
    timestamps: true,
  }
);

productSchema.pre("save", async function (next) {
  console.log("productSchema.presave");
  if (this.isNew) {
    const counter = await CounterModel.findByIdAndUpdate(
      { _id: "productNumber" },
      { $inc: { seq: 1 } },
      { new: true, upsert: true }
    );
    console.log("counter: ", counter);
    this.productNumber = counter.seq;
  }
  next();
});

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
  productNumber: number; // Add this field
};
