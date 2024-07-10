"use client";
import { Product } from "@/lib/models/ProductModel";
import { useState, useEffect, useCallback } from "react";
import Pagination from "../Pagination";
import Image from "next/image";
import { toast } from "sonner";

export interface ProductTableState {
  isLoading: boolean;
  page: number;
  totalPages: undefined | number;
  currentProducts: Product[];
  limit: number;
}

const ProductTable = () => {
  const [state, setState] = useState<ProductTableState>({
    isLoading: true,
    page: 1,
    totalPages: undefined,
    currentProducts: [],
    limit: 5,
  });

  const { isLoading, page, totalPages, currentProducts, limit } = state;

  const fetchProducts = useCallback(async (page: number, limit: number) => {
    setState((prevState) => ({ ...prevState, isLoading: true }));
    const res = await fetch(`/api/products?page=${page}&limit=${limit}`);
    const { products, totalPages } = await res.json();
    setState((prevState) => ({
      ...prevState,
      isLoading: false,
      totalPages: totalPages,
      currentProducts: products,
    }));
  }, []);

  useEffect(() => {
    fetchProducts(page, limit);
  }, [page, limit, fetchProducts]);

  const handleDeleteProduct = async (id: string) => {
    try {
      const res = await fetch(`/api/products/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!res.ok) {
        throw new Error("Network response was not ok");
      }

      const resJson = await res.json();
      console.log("resJson: ", resJson);
      return true;
    } catch (error) {
      console.error("Fetch error: ", error);
      toast.error("There was an error deleting the product. Try again later.");
      return false;
    }
  };

  const handleBlockClick = async (id: string, isBlocked: boolean) => {
    try {
      const res = await fetch(`/api/products/block/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ isBlocked }),
      });

      if (!res.ok) {
        throw new Error("Network response was not ok");
      }

      const resJson = await res.json();
      console.log("resJson: ", resJson);
      return true;
    } catch (error) {
      console.error("Fetch error: ", error);
      toast.error("There was an error editing the product. Try again later.");

      return false;
    }
  };

  return (
    <>
      <div className="overflow-y-auto h-full">
        <table className="w-full  ">
          <thead>
            <tr>
              <th className="py-2 self-start">#</th>
              <th className="py-2 self-start">Content</th>
              <th className="py-2 self-start">Id</th>
              <th className="py-2 self-start">Name </th>

              <th className="py-2 self-start">Created at</th>
              <th className="py-2 self-start">Updated at</th>
              <th className="py-2">Description</th>
              <th className="py-2">Price</th>
              <th className="py-2">Stock</th>
              <th className="py-2">Block</th>
              <th className="py-2">Status</th>
              <th className="py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              Array(limit)
                .fill(null)
                .map((_, index) => (
                  <tr className="h-32" key={index}>
                    <td className="py-2 px-4">
                      <div className="skeleton animate-skeleton-fast h-4 w-4"></div>
                    </td>
                    <td className="py-2 px-4">
                      <div className="skeleton animate-skeleton-fast h-20 w-24"></div>
                    </td>
                    <td className="py-2 px-4">
                      <div className="skeleton animate-skeleton-fast h-4 w-20"></div>
                    </td>
                    <td className="py-2 px-4">
                      <div className="skeleton animate-skeleton-fast h-4 w-20"></div>
                    </td>
                    <td className="py-2 px-4">
                      <div className="skeleton animate-skeleton-fast h-4 w-20"></div>
                    </td>

                    <td className="py-2 px-4 ">
                      <div className="skeleton animate-skeleton-fast h-4 w-20"></div>
                    </td>
                    <td className="py-2 px-4">
                      <div className="flex flex-col gap-2 items-center">
                        <div className="skeleton animate-skeleton-fast h-4 w-52"></div>
                        <div className="skeleton animate-skeleton-fast h-4 w-52"></div>
                      </div>
                    </td>
                    <td className="py-2 px-4">
                      <div className="skeleton animate-skeleton-fast h-4 w-10"></div>
                    </td>
                    <td className="py-2 px-4">
                      <div className="skeleton animate-skeleton-fast h-4 w-10"></div>
                    </td>
                    <td className="py-2 px-4">
                      <div className="skeleton animate-skeleton-fast h-7 w-12"></div>
                    </td>
                    <td className="py-2 px-4">
                      <div className="skeleton animate-skeleton-fast h-7 w-12"></div>
                    </td>
                    <td className="py-2 px-4">
                      <div className="flex flex-col gap-2 items-center w-full">
                        <div className="skeleton animate-skeleton-fast h-10 w-20"></div>
                        <div className="skeleton animate-skeleton-fast h-10 w-20"></div>
                      </div>
                    </td>
                  </tr>
                ))
            ) : currentProducts && currentProducts.length > 0 ? (
              currentProducts.map((product, index) => {
                return (
                  <tr
                    key={product._id}
                    className={`  ${index % 2 === 0 ? "bg-gray-200" : ""}`}
                  >
                    <td className="py-2 px-4">{index + 1}</td>
                    <td className="py-2 px-4">
                      <Image
                        width={400}
                        height={400}
                        alt={product.name}
                        src={product.images[0]}
                        className="w-20 h-20 min-h-20 min-w-20 object-cover rounded-sm overflow-hidden shadow-xl"
                      />
                    </td>
                    <td className="py-2 px-4">{product._id}</td>
                    <td className="py-2 px-4">{product.name}</td>
                    <td className="py-2 px-4">{product.createdAt}</td>
                    <td className="py-2 px-4">{product.updatedAt}</td>
                    <td className="py-2 px-4 h-28 max-h-28 max-w-52 overflow-hidden text-ellipsis whitespace-normal">
                      <div className="h-full overflow-y-auto flex items-center">
                        {product.description}
                      </div>
                    </td>
                    <td className="py-2 px-4">${product.price}</td>
                    <td
                      className={`py-2 px-4 ${
                        product.stock < 1 && "text-red-500 font-bold"
                      }`}
                    >
                      {product.stock}
                    </td>
                    <td className="py-2 px-4">
                      <input
                        className=" toggle toggle-error"
                        type="checkbox"
                        id="price"
                        checked={product.isBlocked}
                        onClick={() => {
                          toast.custom((t) => (
                            <div className="flex gap-2 items-center bg-white p-2 rounded-xl shadow-xl border-2">
                              <button
                                className="btn btn-warning"
                                onClick={async () => {
                                  toast.dismiss(t);

                                  await handleBlockClick(
                                    product._id,
                                    !product.isBlocked
                                  );
                                  product.isBlocked = !product.isBlocked;
                                  setState((prevState) => ({
                                    ...prevState,
                                    currentProducts:
                                      prevState.currentProducts.map((e) => {
                                        if (e._id === product._id) {
                                          e.isBlocked = !e.isBlocked;
                                        }
                                        return e;
                                      }),
                                  }));
                                }}
                              >
                                {product.isBlocked ? "Unblock" : "Block"}
                              </button>
                              <p className="text-sm">
                                Are you sure to{" "}
                                {product.isBlocked ? "Unblock" : "Block"}{" "}
                                {product.name}?
                              </p>
                            </div>
                          ));
                        }}
                      ></input>
                    </td>
                    <td
                      className={`py-2 px-4 font-bold  ${
                        product.isBlocked
                          ? "text-red-500"
                          : product.stock > 0
                          ? "text-green-400"
                          : "text-gray-600"
                      }`}
                    >
                      {product.isBlocked
                        ? "Blocked"
                        : product.stock > 0
                        ? "Active"
                        : "Inactive"}
                    </td>

                    <td className="py-2 px-4 ">
                      <div className="flex flex-col gap-1">
                        <button className="btn btn-primary ">Edit</button>
                        <button
                          className="btn btn-error "
                          onClick={() => {
                            toast.custom((t) => (
                              <div className="flex gap-2 items-center bg-white p-2 rounded-xl shadow-xl border-2">
                                <button
                                  className="btn btn-error"
                                  onClick={async () => {
                                    toast.dismiss(t);
                                    const res = await handleDeleteProduct(
                                      product._id
                                    );
                                    if (res) {
                                      setState((prevState) => ({
                                        ...prevState,
                                        currentProducts:
                                          prevState.currentProducts.filter(
                                            (e) => e._id !== product._id
                                          ),
                                      }));
                                    }
                                  }}
                                >
                                  Delete
                                </button>
                                <p className="text-sm">
                                  Are you sure to delete {product.name}
                                </p>
                              </div>
                            ));
                          }}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={6} className="py-2 text-center">
                  No data
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {totalPages ? (
        <Pagination pages={totalPages} limit={limit} setState={setState} />
      ) : (
        <div className=" flex justify-center items-center w-full py-1 relative">
          <label className="flex items-center gap-2 absolute left-2">
            <p className="text-stone-500">Rows per page</p>
            <select className="select select-bordered  w-full max-w-24">
              <option disabled selected>
                Pick your product limit
              </option>
              <option>1</option>
              <option>3</option>
              <option>5</option>
              <option>10</option>
              <option>20</option>
              <option>50</option>
              <option>100</option>
            </select>
          </label>

          <button
            className={`mr-4 btn btn-primary shadow-xl btn-disabled`}
            disabled
          >
            Prev
          </button>
          <button
            className={`w-10 flex justify-center items-center rounded-md font-bold btn btn-primary mx-1 shadow-xl text-white `}
          >
            1
          </button>
          <button
            className={`w-10 flex justify-center items-center rounded-md font-bold btn btn-primary mx-1 shadow-xl btn-disabled text-white`}
            disabled
          >
            2
          </button>

          <button
            className={`ml-4 btn btn-primary shadow-xl btn-disabled`}
            disabled
          >
            Next
          </button>
        </div>
      )}
    </>
  );
};

export default ProductTable;
