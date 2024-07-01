import dbConnect from "../dbConnect";
import ProductModel from "../models/ProductModel";

export const fetchProducts = async () => {
  console.log("fetchProducts");
  await dbConnect();
  const res = await ProductModel.find().sort({ createdAt: -1 });
  console.log("res ProductModel: ", res);
  return res;
};
