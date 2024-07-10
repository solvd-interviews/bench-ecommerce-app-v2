import dbConnect from "../dbConnect";
import ProductModel from "../models/ProductModel";

export const fetchProducts = async () => {
  await dbConnect();
  const res = await ProductModel.find({ isBlocked: false }).sort({
    createdAt: -1,
  });
  return res;
};

export const blockProduct = async (id: string, block: boolean) => {
  await dbConnect();
  const res = await ProductModel.findByIdAndUpdate(
    id,
    { $set: { isBlocked: block } },
    { new: true }
  );
  return res;
};

export const deleteProduct = async (id: string) => {
  await dbConnect();
  const res = await ProductModel.findByIdAndDelete(id);
  return res;
};

export const fetchProductsPagination = async (page = 1, limit = 10) => {

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
