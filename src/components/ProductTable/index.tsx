"use client";
import { Product } from "@/lib/models/ProductModel";
import { useState, useEffect } from "react";
import Pagination from "../Pagination";
import Image from "next/image";

const ProductTable = () => {
  const [currentProducts, setCurrentProducts] = useState<Product[]>([]);
  const [totalPages, setTotalPages] = useState<number | undefined>(undefined);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchProducts(page);
  }, [page]);

  const fetchProducts = async (page: number) => {
    setIsLoading(true);
    const limit = 5; // adjust limit as necessary
    const res = await fetch(`/api/products?page=${page}&limit=${limit}`);
    const { products, totalPages } = await res.json();
    setCurrentProducts(products);
    setTotalPages(totalPages);
    setIsLoading(false);
  };

  const handleDeleteProduct = async ({ id }: { id: string }) => {};

  return (
    <>
      <table className="w-full">
        <thead>
          <tr>
            <th className="py-2 self-start">#</th>
            <th className="py-2 self-start">Content</th>
            <th className="py-2 self-start">Name</th>
            <th className="py-2">Description</th>
            <th className="py-2">Price</th>
            <th className="py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {isLoading ? (
            <tr>
              <td colSpan={6} className="py-2 text-center">
                <span className="loading loading-spinner w-32"></span>
              </td>
            </tr>
          ) : currentProducts && currentProducts.length > 0 ? (
            currentProducts.map((product, index) => (
              <tr
                key={product._id}
                className={`h-32 max-h-32 relative  ${
                  index % 2 === 0 ? "bg-gray-200" : ""
                }`}
              >
                <td className="py-2 px-4">{index}</td>
                <td className="py-2 px-4">
                  <Image
                    width={400}
                    height={400}
                    alt={product.name}
                    src={product.images[0]}
                    className="w-20 h-20 object-cover rounded-sm overflow-hidden shadow-xl"
                  />
                </td>
                <td className="py-2 px-4">{product.name}</td>
                <td className="py-2 px-4">{product.description}</td>
                <td className="py-2 px-4">${product.price}</td>
                <td className="py-2 px-4 ">
                  <div className="flex flex-col gap-1">
                    <button className="btn btn-primary w-20">Edit</button>
                    <button
                      className="btn btn-error w-20"
                      onClick={() => handleDeleteProduct({ id: product._id })}
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={6} className="py-2 text-center">
                No data
              </td>
            </tr>
          )}
        </tbody>
      </table>
      {totalPages && <Pagination pages={totalPages} setCurrentPage={setPage} />}
    </>
  );
};

export default ProductTable;
