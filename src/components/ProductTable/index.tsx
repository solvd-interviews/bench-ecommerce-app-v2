"use client";
import { useState, useEffect, useCallback, FormEvent } from "react";
import Pagination from "../Pagination";
import Accordion from "../Accordion";
import Image from "next/image";
import { toast } from "sonner";
import { LuClipboardEdit } from "react-icons/lu";
import { LuTrash2 } from "react-icons/lu";
import { ProductTableState, Filter } from "./types";
import { tablePropertyAndSkeletonArr } from "./constants";
import { IoIosArrowDown } from "react-icons/io";
import { IoIosArrowUp } from "react-icons/io";

const defaultValues = {
  id: null as number | null,
  name: '',
  createDate: null as string | null,
  updatedDate: null as string | null,
  price: null as number | null,
  stock: null as number | null,
  block: null
};

type FilterKeys = keyof typeof defaultValues;

const ProductTable = () => {
  const [tableState, setTableState] = useState<ProductTableState>({
    isLoading: true,
    page: 1,
    totalPages: undefined,
    currentProducts: [],
    limit: 5,
    sort: {
      prop: "productNumber",
      order: "asc"
    },
  });
  const [filters, setFilters] = useState(defaultValues);

  const {
    isLoading,
    page,
    totalPages,
    currentProducts,
    limit,
    sort: { prop, order },
  } = tableState;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    let newValue: string | number | boolean | null = value;

    if (type === 'number') {
      newValue = value === '' ? null : Number(value);
    } else if (type === 'checkbox') {
      newValue = checked;
    }

    setFilters(prev => ({
      ...prev,
      [name]: newValue
    }));
  };

  type FilterKeys = keyof typeof defaultValues;

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    type FilterAccumulator = Partial<Filter>;

    const cleanFilters = Object.entries(filters).reduce<FilterAccumulator>((acc, [key, value]) => {
      const safeKey = key as keyof Filter;

      // Ensure non-null, non-undefined values are considered
      if (value !== null && value !== undefined) {
        switch (safeKey) {
          case 'id':
          case 'price':
          case 'stock':
            // Correctly handle number and string types, ensure no trim operation on number
            if (typeof value === 'number') {
              acc[safeKey] = value;
            } else if (typeof value === 'string') {
              acc[safeKey] = value.trim() ? Number(value.trim()) : null;
            }
            break;
          case 'name':
            // Ensure the name is treated as a string and passed even if it's an empty string
            if (typeof value === 'string') {
              acc[safeKey] = value.trim();
            }
            break;
          case 'block':
            acc[safeKey] = Boolean(value);
            break;
          case 'createDate':
          case 'updatedDate':
            // Handle string type for dates, check and convert only if it's a non-empty string
            if (typeof value === 'string' && value.trim()) {
              acc[safeKey] = new Date(value.trim());
            } else {
              acc[safeKey] = null;
            }
            break;
        }
      }
      return acc;
    }, {});



    fetchProducts(cleanFilters, tableState.sort);
  };

  const fetchProducts = useCallback(async (
    filters: Partial<Filter>,
    sorting: { prop: string, order: string }) => {
    setTableState((prevState) => ({ ...prevState, isLoading: true }));

    // Initialize URLSearchParams with mandatory parameters
    const queryParams = new URLSearchParams({
      page: String(tableState.page),
      limit: String(tableState.limit),
      sort: sorting.prop,
      order: sorting.order
    });

    Object.entries(filters).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
        queryParams.set(key, String(value));
      }
    });

    const url = `/api/products?${queryParams.toString()}`;

    try {
      const response = await fetch(url);
      const data = await response.json();
      setTableState(prevState => ({
        ...prevState,
        isLoading: false,
        totalPages: data.totalPages,
        currentProducts: data.products
      }));
    } catch (error) {
      console.error("Fetch error: ", error);
      toast.error("Failed to fetch products. Try again later.");
      setTableState(prevState => ({ ...prevState, isLoading: false }));
    }
  }, [tableState.page, tableState.limit]);


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

  useEffect(() => {
    fetchProducts(filters, tableState.sort);
  }, []);

  const formMarkup = () => (
    <form onSubmit={handleSubmit} className="flex flex-wrap items-center gap-3">
      {/* Product ID Filter */}
      <div>
        <label htmlFor="productId" className="block text-sm font-medium text-gray-700">
          ID
        </label>
        <input
          type="number"
          id="productId"
          name="id"
          className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
          placeholder="123"
          min="1"
          max="999999"
          value={filters.id === null ? '' : filters.id}
          onChange={handleChange}
        />
      </div>

      {/* Product Name Filter */}
      <div>
        <label htmlFor="productName" className="block text-sm font-medium text-gray-700">
          Name
        </label>
        <input
          type="text"
          id="productName"
          name="name"
          className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
          placeholder="Widget X123"
          maxLength={30}
          value={filters.name}
          onChange={handleChange}
        />
      </div>

      {/* Create Date Filter */}
      <div>
        <label htmlFor="createDate" className="block text-sm font-medium text-gray-700">
          Created
        </label>
        <input
          type="date"
          id="createDate"
          name="createDate"
          className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
          value={filters.createDate ?? ''}
          onChange={handleChange}
        />
      </div>

      {/* Updated Date Filter */}
      <div>
        <label htmlFor="updatedDate" className="block text-sm font-medium text-gray-700">
          Updated
        </label>
        <input
          type="date"
          id="updatedDate"
          name="updatedDate"
          className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
          value={filters.updatedDate ?? ''}
          onChange={handleChange}
        />
      </div>

      {/* Price Filter */}
      <div>
        <label htmlFor="price" className="block text-sm font-medium text-gray-700">
          Price
        </label>
        <input
          type="number"
          id="price"
          name="price"
          className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
          placeholder="19.99"
          title="Enter a valid price"
          value={filters.price === null ? '' : filters.price}
          onChange={handleChange}
        />
      </div>

      {/* Stock Filter */}
      <div>
        <label htmlFor="stock" className="block text-sm font-medium text-gray-700">
          Stock
        </label>
        <input
          type="number"
          id="stock"
          name="stock"
          className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
          placeholder="100"
          min="0"
          max="99999"
          value={filters.stock === null ? '' : filters.stock}
          onChange={handleChange}
        />
      </div>

      {/* Block Filter */}
      <div className="flex items-center">
        <label htmlFor="block" className="block text-sm font-medium text-gray-700 mr-2">
          Blocked
        </label>
        <input
          type="checkbox"
          id="block"
          name="block"
          className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
          checked={filters.block || false}
          onChange={handleChange}
        />
      </div>

      {/* Search Button */}
      <div>
        <button
          type="submit"
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Search
        </button>
      </div>
    </form>
  );

  return (
    <>
      <div className="overflow-y-auto h-full bg-white">
        <div className="filter-section flex justify-around p-3 bg-blue-100">
          <div className="hidden sm:block">
            {formMarkup()}
          </div>
          <div className="block sm:hidden">
            <Accordion title="Filter options" startsOpen={false}>
              {formMarkup()}
            </Accordion>
          </div>
        </div>

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
                        const newOrder = prop === e.prop
                          ? (order === "asc" ? "desc" : "asc") : e.defOrder;

                        setTableState((prevState) => ({
                          ...prevState,
                          sort: {
                            prop: e.prop,
                            order: newOrder,
                          },
                        }));
                        fetchProducts(filters, { prop: e.prop, order: newOrder })
                      }}
                    >
                      <div className="flex gap-1 justify-between">
                        <p>{e.label}</p>
                        {prop === e.prop &&
                          (order == "asc" ? (
                            e.icon === "number" ? (
                            <IoIosArrowDown size={25} />
                            ) : (
                              <IoIosArrowDown size={25} />
                            )
                          ) : e.icon === "number" ? (
                            <IoIosArrowUp size={25} />

                          ) : (
                              <IoIosArrowUp size={25} />

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
                                setTableState((prevState) => ({
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
                                    setTableState((prevState) => ({
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
                    <td colSpan={11} className="py-10 text-center">
                      No products found.
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
          setState={setTableState}
          loading={false}
        />
      ) : (
        <Pagination
          pages={2}
          limit={limit}
            setState={setTableState}
          loading={true}
        />
      )}
    </>
  );
};

export default ProductTable;
