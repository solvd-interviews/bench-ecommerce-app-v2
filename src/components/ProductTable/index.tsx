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

const tablePropertyAndSkeletonArr: {
  label: string;
  prop: string;
  defOrder: "asc" | "desc";
  logic: boolean;
  icon?: "number" | "str";
  skeletonStyle: string;
  skeletonQuantity: number;
}[] = [
  {
    label: "Id",
    prop: "productNumber",
    defOrder: "desc",
    logic: true,
    icon: "number",
    skeletonStyle: "h-4 w-4",
    skeletonQuantity: 1,
  },
  {
    label: "Content",
    logic: false,
    prop: "",
    defOrder: "asc",
    skeletonStyle: "h-20 w-24",
    skeletonQuantity: 1,
  },
  {
    label: "Name",
    prop: "name",
    defOrder: "asc",
    logic: true,
    icon: "str",
    skeletonStyle: "h-4 w-56",
    skeletonQuantity: 1,
  },
  {
    label: "Created At",
    prop: "createdAt",
    defOrder: "desc",
    logic: true,
    icon: "str",
    skeletonStyle: "h-4 w-20",
    skeletonQuantity: 1,
  },
  {
    label: "Updated At",
    prop: "updatedAt",
    defOrder: "desc",
    logic: true,
    icon: "str",
    skeletonStyle: "h-4 w-20",
    skeletonQuantity: 1,
  },
  {
    label: "Description",
    prop: "description",
    defOrder: "asc",
    logic: true,
    icon: "str",
    skeletonStyle: "h-4 w-56",
    skeletonQuantity: 3,
  },
  {
    label: "Price",
    prop: "price",
    defOrder: "asc",
    logic: true,
    icon: "number",
    skeletonStyle: "h-4 w-10",
    skeletonQuantity: 1,
  },
  {
    label: "Stock",
    prop: "stock",
    defOrder: "asc",
    logic: true,
    icon: "number",
    skeletonStyle: "h-4 w-10",
    skeletonQuantity: 1,
  },
  {
    label: "Block",
    prop: "isBlocked",
    defOrder: "asc",
    logic: true,
    icon: "str",
    skeletonStyle: "h-7 w-12",
    skeletonQuantity: 1,
  },
  {
    label: "Status",
    logic: false,
    prop: "",
    defOrder: "asc",
    skeletonStyle: "h-7 w-12",
    skeletonQuantity: 1,
  },
  {
    label: "Actions",
    logic: false,
    prop: "",
    defOrder: "asc",
    skeletonStyle: "h-10 w-20",
    skeletonQuantity: 2,
  },
];

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
              {tablePropertyAndSkeletonArr.map((e, index) => {
                if (e.logic) {
                  return (
                    <th
                      key={index}
                      className={`py-2 px-4 text-left hover:underline hover:cursor-pointer max-w-32 ${
                        prop === e.prop && "bg-primary text-white"
                      }`}
                      onClick={() => {
                        setState((prevState) => ({
                          ...prevState,
                          sort: {
                            filter: null,
                            prop: e.prop,
                            order:
                              prevState.sort.prop === e.prop
                                ? prevState.sort.order === "asc"
                                  ? "desc"
                                  : "asc"
                                : e.defOrder,
                          },
                        }));
                      }}
                    >
                      <div className="flex gap-1 items-center">
                        <p>{e.label}</p>
                        {prop === e.prop &&
                          (order == "asc" ? (
                            e.icon === "number" ? (
                              <LuArrowDown01 size={20} />
                            ) : (
                              <LuArrowDownAZ />
                            )
                          ) : e.icon === "number" ? (
                            <LuArrowDown10 size={20} />
                          ) : (
                            <LuArrowDownZA />
                          ))}
                      </div>
                    </th>
                  );
                } else {
                  return (
                    <th key={index} className="py-2 px-4 text-left ">
                      {e.label}
                    </th>
                  );
                }
              })}
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              Array(limit)
                .fill(null)
                .map((_, indexL) => (
                  <tr key={indexL} className="h-32">
                    {tablePropertyAndSkeletonArr.map((e, indexE) => (
                      <td key={indexE} className="py-2 px-4 ">
                        <div className="flex flex-col gap-1">
                          {Array(e.skeletonQuantity)
                            .fill(null)
                            .map((_, indexZ) => (
                              <div
                                key={indexZ}
                                className={
                                  "skeleton animate-skeleton-fast " +
                                  e.skeletonStyle
                                }
                              ></div>
                            ))}
                        </div>
                      </td>
                    ))}
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
        <Pagination
          pages={totalPages}
          limit={limit}
          setState={setState}
          loading={false}
        />
      ) : (
        <Pagination
          pages={2}
          limit={limit}
          setState={setState}
          loading={true}
        />
      )}
    </>
  );
};

export default ProductTable;
