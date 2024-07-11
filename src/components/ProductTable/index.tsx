"use client";
import { Product } from "@/lib/models/ProductModel";
import { useState, useEffect, useCallback } from "react";
import Pagination from "../Pagination";
import Image from "next/image";
import { toast } from "sonner";
import { LuClipboardEdit } from "react-icons/lu";
import { LuTrash2 } from "react-icons/lu";
import { LuArrowDownZA } from "react-icons/lu"; // z - a
import { LuArrowDownAZ } from "react-icons/lu"; // a - z

import { LuArrowDown01 } from "react-icons/lu"; // 0 - 1
import { LuArrowDown10 } from "react-icons/lu"; // 1 - 0

export interface ProductTableState {
  isLoading: boolean;
  page: number;
  totalPages: undefined | number;
  currentProducts: Product[];
  limit: number;
  sort: {
    prop: string;
    order: "asc" | "desc";
    filter: null | string;
  };
}

const ProductTable = () => {
  const [state, setState] = useState<ProductTableState>({
    isLoading: true,
    page: 1,
    totalPages: undefined,
    currentProducts: [],
    limit: 5,
    sort: {
      prop: "productNumber",
      order: "desc",
      filter: null,
    },
  });

  const {
    isLoading,
    page,
    totalPages,
    currentProducts,
    limit,
    sort: { prop, order },
  } = state;

  const fetchProducts = useCallback(
    async (page: number, limit: number, prop: string, order: string) => {
      setState((prevState) => ({ ...prevState, isLoading: true }));
      let url = `/api/products?page=${page}&limit=${limit}&sort=${prop}&order=${order}`;
      const res = await fetch(url);
      const { products, totalPages } = await res.json();
      setState((prevState) => ({
        ...prevState,
        isLoading: false,
        totalPages: totalPages,
        currentProducts: products,
      }));
    },
    []
  );

  useEffect(() => {
    fetchProducts(page, limit, prop, order);
  }, [page, limit, fetchProducts, prop, order]);

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
      return true;
    } catch (error) {
      console.error("Fetch error: ", error);
      toast.error("There was an error editing the product. Try again later.");

      return false;
    }
  };

  return (
    <>
      <div className="overflow-y-auto h-full bg-white">
        <table className="w-full ">
          <thead>
            <tr>
              <th
                className={`py-2 px-4 text-left hover:underline hover:cursor-pointer max-w-32 ${
                  prop === "productNumber" && "bg-primary text-white"
                }`}
                onClick={() => {
                  setState((prevState) => ({
                    ...prevState,
                    sort: {
                      filter: null,
                      prop: "productNumber",
                      order:
                        prevState.sort.prop === "productNumber"
                          ? prevState.sort.order === "asc"
                            ? "desc"
                            : "asc"
                          : "desc",
                    },
                  }));
                }}
              >
                <div className="flex gap-1 items-center">
                  <p>Id</p>
                  {prop === "productNumber" &&
                    (order == "asc" ? (
                      <LuArrowDown01 size={20} />
                    ) : (
                      <LuArrowDown10 size={20} />
                    ))}
                </div>
              </th>
              <th className="py-2 px-4 text-left ">Content</th>
              <th
                className={`py-2 px-4 text-left hover:underline hover:cursor-pointer ${
                  prop === "name" && "bg-primary text-white"
                }`}
                onClick={() => {
                  setState((prevState) => ({
                    ...prevState,
                    sort: {
                      filter: null,
                      prop: "name",
                      order:
                        prevState.sort.prop === "name"
                          ? prevState.sort.order === "asc"
                            ? "desc"
                            : "asc"
                          : "asc",
                    },
                  }));
                }}
              >
                <div className="flex gap-1 items-center">
                  <p>Name</p>
                  {prop === "name" &&
                    (order == "asc" ? (
                      <LuArrowDownAZ size={20} />
                    ) : (
                      <LuArrowDownZA size={20} />
                    ))}
                </div>
              </th>
              <th
                className={`py-2 px-4 text-left hover:underline hover:cursor-pointer ${
                  prop === "createdAt" && "bg-primary text-white"
                }`}
                onClick={() => {
                  setState((prevState) => ({
                    ...prevState,
                    sort: {
                      filter: null,
                      prop: "createdAt",
                      order:
                        prevState.sort.prop === "createdAt"
                          ? prevState.sort.order === "asc"
                            ? "desc"
                            : "asc"
                          : "desc",
                    },
                  }));
                }}
              >
                <div className="flex gap-1 items-center">
                  <p>Created at</p>
                  {prop === "createdAt" &&
                    (order == "asc" ? (
                      <LuArrowDownAZ size={20} />
                    ) : (
                      <LuArrowDownZA size={20} />
                    ))}
                </div>
              </th>
              <th
                className={`py-2 px-4 text-left hover:underline hover:cursor-pointer ${
                  prop === "updatedAt" && "bg-primary text-white"
                }`}
                onClick={() => {
                  setState((prevState) => ({
                    ...prevState,
                    sort: {
                      filter: null,
                      prop: "updatedAt",
                      order:
                        prevState.sort.prop === "updatedAt"
                          ? prevState.sort.order === "asc"
                            ? "desc"
                            : "asc"
                          : "desc",
                    },
                  }));
                }}
              >
                <div className="flex gap-1 items-center">
                  <p>Updated at</p>
                  {prop === "updatedAt" &&
                    (order == "asc" ? (
                      <LuArrowDownAZ size={20} />
                    ) : (
                      <LuArrowDownZA size={20} />
                    ))}
                </div>
              </th>
              <th
                className={`py-2 px-4 text-left hover:underline hover:cursor-pointer ${
                  prop === "description" && "bg-primary text-white"
                }`}
                onClick={() => {
                  setState((prevState) => ({
                    ...prevState,
                    sort: {
                      filter: null,
                      prop: "description",
                      order:
                        prevState.sort.prop === "description"
                          ? prevState.sort.order === "asc"
                            ? "desc"
                            : "asc"
                          : "asc",
                    },
                  }));
                }}
              >
                <div className="flex gap-1 items-center">
                  <p>Description</p>
                  {prop === "description" &&
                    (order == "asc" ? (
                      <LuArrowDownAZ size={20} />
                    ) : (
                      <LuArrowDownZA size={20} />
                    ))}
                </div>
              </th>
              <th
                className={`py-2 px-4 text-left hover:underline hover:cursor-pointer ${
                  prop === "price" && "bg-primary text-white"
                }`}
                onClick={() => {
                  setState((prevState) => ({
                    ...prevState,
                    sort: {
                      filter: null,
                      prop: "price",
                      order:
                        prevState.sort.prop === "price"
                          ? prevState.sort.order === "asc"
                            ? "desc"
                            : "asc"
                          : "asc",
                    },
                  }));
                }}
              >
                <div className="flex gap-1 items-center">
                  <p>Price</p>
                  {prop === "price" &&
                    (order == "asc" ? (
                      <LuArrowDown01 size={20} />
                    ) : (
                      <LuArrowDown10 size={20} />
                    ))}
                </div>
              </th>
              <th
                className={`py-2 px-4 text-left hover:underline hover:cursor-pointer ${
                  prop === "stock" && "bg-primary text-white"
                }`}
                onClick={() => {
                  setState((prevState) => ({
                    ...prevState,
                    sort: {
                      filter: null,
                      prop: "stock",
                      order:
                        prevState.sort.prop === "stock"
                          ? prevState.sort.order === "asc"
                            ? "desc"
                            : "asc"
                          : "asc",
                    },
                  }));
                }}
              >
                <div className="flex gap-1 items-center">
                  <p>Stock</p>
                  {prop === "stock" &&
                    (order == "asc" ? (
                      <LuArrowDown01 size={20} />
                    ) : (
                      <LuArrowDown10 size={20} />
                    ))}
                </div>
              </th>
              <th
                className={`py-2 px-4 text-left hover:underline hover:cursor-pointer ${
                  prop === "isBlocked" && "bg-primary text-white"
                }`}
                onClick={() => {
                  setState((prevState) => ({
                    ...prevState,
                    sort: {
                      filter: null,
                      prop: "isBlocked",
                      order:
                        prevState.sort.prop === "isBlocked"
                          ? prevState.sort.order === "asc"
                            ? "desc"
                            : "asc"
                          : "asc",
                    },
                  }));
                }}
              >
                <div className="flex gap-1 items-center">
                  <p>Block</p>
                  {prop === "isBlocked" &&
                    (order == "asc" ? (
                      <LuArrowDownAZ size={20} />
                    ) : (
                      <LuArrowDownZA size={20} />
                    ))}
                </div>
              </th>
              <th className="py-2 px-4 text-left ">Status</th>
              <th className="py-2 px-4 text-left">Actions</th>
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
                    <td className="py-2 px-4">
                      <div className="skeleton animate-skeleton-fast h-4 w-40"></div>
                    </td>
                    <td className="py-2 m-2 px-4">
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
                      <div className="skeleton animate-skeleton-fast h-10 w-20"></div>
                    </td>
                  </tr>
                ))
            ) : currentProducts && currentProducts.length > 0 ? (
              currentProducts.map((product, index) => (
                <tr
                  key={product._id}
                  style={{ backgroundColor: index % 2 === 0 ? "#f1f5f8" : "" }}
                >
                  <td className="py-2 px-4">{product.productNumber}</td>
                  <td className="py-2 px-4">
                    <Image
                      width={400}
                      height={400}
                      alt={product.name}
                      src={product.images[0]}
                      className="w-20 h-20 min-h-20 min-w-20 object-cover rounded-sm overflow-hidden shadow-xl"
                    />
                  </td>
                  <td className="py-2 px-4">{product.name}</td>
                  <td className="py-2 px-4">
                    {product.createdAt.split("T")[0]}
                  </td>
                  <td className="py-2 px-4">
                    {product.updatedAt.split("T")[0]}
                  </td>
                  <td className="py-2 px-4">
                    <div className="h-28 max-w-52 overflow-hidden flex items-center text-ellipsis whitespace-normal">
                      {product.description.slice(0, 90)}
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
                      className="toggle toggle-error"
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
                    />
                  </td>
                  <td
                    className={`py-2 px-4 font-bold ${
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
                  <td className="py-2 px-4">
                    <div className="flex flex-col gap-4">
                      <LuClipboardEdit
                        size={30}
                        className="hover:cursor-pointer"
                      />
                      <LuTrash2
                        className="hover:cursor-pointer"
                        size={30}
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
                                Are you sure to delete {product.name}?
                              </p>
                            </div>
                          ));
                        }}
                      />
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={11} className="py-2 text-center">
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
        <div className="flex justify-center items-center w-full py-1 relative">
          <label className="flex items-center gap-2 md:absolute md:left-2">
            <p className="text-stone-500 hidden md:flex">Rows per page</p>
            <select className="select select-bordered w-full max-w-24">
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
            className="mr-4 btn btn-primary shadow-xl btn-disabled"
            disabled
          >
            Prev
          </button>
          <button className="w-10 flex justify-center items-center rounded-md font-bold btn btn-primary mx-1 shadow-xl text-white">
            1
          </button>
          <button
            className="w-10 flex justify-center items-center rounded-md font-bold btn btn-primary mx-1 shadow-xl btn-disabled text-white"
            disabled
          >
            2
          </button>
          <button
            className="ml-4 btn btn-primary shadow-xl btn-disabled"
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
