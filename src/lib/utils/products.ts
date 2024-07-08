import dbConnect from "../dbConnect";
import ProductModel from "../models/ProductModel";

export const fetchProducts = async () => {
  console.log("fetchProducts");
  await dbConnect();
  const res = await ProductModel.find().sort({ createdAt: -1 });
  console.log("res ProductModel: ", res);
  return res;
};

export const fetchProductsPagination = async (page = 1, limit = 10) => {
  console.log("fetchProductsPagination");

  await dbConnect();

  const prom1 = ProductModel.find()
    .skip((page - 1) * limit)
    .limit(limit)
    .sort({ createdAt: -1 })
    .exec();
  const prom2 = ProductModel.countDocuments();
  const [products, totalProducts] = await Promise.all([prom1, prom2]);

  return {
    products,
    totalPages: Math.ceil(totalProducts / limit),
    currentPage: page,
  };
};
