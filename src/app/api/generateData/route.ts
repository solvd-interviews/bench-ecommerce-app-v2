import { sampleData } from "@/lib/data";
import dbConnect from "@/lib/dbConnect";
import CounterModel from "@/lib/models/CounterModel";
import ProductModel from "@/lib/models/ProductModel";
import UserModel from "@/lib/models/UserModel";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (request: NextRequest) => {
  const { users, products } = sampleData;
  await dbConnect();

  await Promise.all([
    UserModel.deleteMany(),
    ProductModel.deleteMany(),
    CounterModel.deleteMany(),
  ]);

  // Save users with incremental userNumber concurrently
  const userPromises = users.map((user) => {
    const newUser = new UserModel(user);
    return newUser.save();
  });

  // Save products with incremental productNumber concurrently
  const productPromises = products.map((product) => {
    const newProduct = new ProductModel(product);
    return newProduct.save();
  });

  // Wait for all save operations to complete
  await Promise.all([...userPromises, ...productPromises]);

  // Retrieve the saved documents
  const savedUsers = await UserModel.find();
  const savedProducts = await ProductModel.find();

  return NextResponse.json({
    message: "Generated successfully!",
    users: savedUsers,
    products: savedProducts,
  });
};
