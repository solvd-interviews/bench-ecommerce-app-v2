import dbConnect from "../dbConnect";
import ProductModel from "../models/ProductModel";

export const fetchProducts = async () => {
  await dbConnect();
  const res = await ProductModel.find().sort({ createdAt: -1 });
  return res;
};
