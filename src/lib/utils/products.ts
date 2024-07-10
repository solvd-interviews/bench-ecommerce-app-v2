import dbConnect from "../dbConnect";
import ProductModel from "../models/ProductModel";

export const fetchProducts = async () => {
  await dbConnect();
  const res = await ProductModel.find({ isBlocked: false }).sort({
    createdAt: -1,
  });
  console.log("res ProductModel: ", res);
  return res;
};

export const blockProduct = async (id: string, block: boolean) => {
  await dbConnect();
  const res = await ProductModel.findByIdAndUpdate(
    id,
    { $set: { isBlocked: block } },
    { new: true }
  );
  console.log("res ProductModel: blockProduct", res);
  return res;
};

export const deleteProduct = async (id: string) => {
  await dbConnect();
  const res = await ProductModel.findByIdAndDelete(id);
  console.log("res ProductModel: deleted", res);
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
