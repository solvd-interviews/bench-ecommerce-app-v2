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
import { useRouter } from "next/navigation";

const defaultValues = {
  id: null as number | null,
  name: "",
  createDate: null as string | null,
  updatedDate: null as string | null,
  price: null as number | null,
  stock: null as number | null,
  block: false,
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
      order: "asc",
    },
  });
  const [filters, setFilters] = useState(defaultValues);

  const router = useRouter();

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

    if (type === "number") {
      newValue = value === "" ? null : Number(value);
    } else if (type === "checkbox") {
      newValue = checked;
    }

    setFilters((prev) => ({
      ...prev,
      [name]: newValue,
    }));
  };

  type FilterKeys = keyof typeof defaultValues;

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    type FilterAccumulator = Partial<Filter>;

    const cleanFilters = Object.entries(filters).reduce<FilterAccumulator>(
      (acc, [key, value]) => {
        const safeKey = key as keyof Filter;

        // Ensure non-null, non-undefined values are considered
        if (value !== null && value !== undefined) {
          switch (safeKey) {
            case "id":
            case "price":
            case "stock":
              // Correctly handle number and string types, ensure no trim operation on number
              if (typeof value === "number") {
                acc[safeKey] = value;
              } else if (typeof value === "string") {
                acc[safeKey] = value.trim() ? Number(value.trim()) : null;
              }
              break;
            case "name":
              // Ensure the name is treated as a string and passed even if it's an empty string
              if (typeof value === "string") {
                acc[safeKey] = value.trim(); // Remove excess whitespace
              }
              break;
            case "block":
              // Boolean values do not need trimming or conversion
              acc[safeKey] = Boolean(value);
              break;
            case "createDate":
            case "updatedDate":
              // Handle string type for dates, check and convert only if it's a non-empty string
              if (typeof value === "string" && value.trim()) {
                acc[safeKey] = new Date(value.trim());
              } else {
                acc[safeKey] = null;
              }
              break;
          }
        }
        return acc;
      },
      {}
    );

    fetchProducts(cleanFilters, tableState.sort);
  };

  const fetchProducts = useCallback(
    async (
      filters: Partial<Filter>,
      sorting: { prop: string; order: string }
    ) => {
      setTableState((prevState) => ({ ...prevState, isLoading: true }));

      // Initialize URLSearchParams with mandatory parameters
      const queryParams = new URLSearchParams({
        page: String(tableState.page),
        limit: String(tableState.limit),
        sort: tableState.sort.prop,
        order: tableState.sort.order,
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
        setTableState((prevState) => ({
          ...prevState,
          isLoading: false,
          totalPages: data.totalPages,
          currentProducts: data.products,
        }));
      } catch (error) {
        console.error("Fetch error: ", error);
        toast.error("Failed to fetch products. Try again later.");
        setTableState((prevState) => ({ ...prevState, isLoading: false }));
      }
    },
    [tableState.page, tableState.limit, tableState.sort]
  );

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
    <form onSubmit={handleSubmit} id="src-components-ProductTable-index-form" className="flex flex-wrap items-center gap-3">
      {/* Product ID Filter */}
      <div id="src-components-ProductTable-index-idFilter">
        <label
          htmlFor="src-components-ProductTable-index-idInput"
          id="src-components-ProductTable-index-idLabel"
          className="block text-sm font-medium text-gray-700"
        >
          ID
        </label>
        <input
          type="number"
          id="src-components-ProductTable-index-idInput"
          name="id"
          className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
          placeholder="123"
          min="1"
          max="999999"
          value={filters.id === null ? "" : filters.id}
          onChange={handleChange}
        />
      </div>

      {/* Product Name Filter */}
      <div id="src-components-ProductTable-index-nameFilter">
        <label
          htmlFor="src-components-ProductTable-index-nameInput"
          id="src-components-ProductTable-index-nameLabel"
          className="block text-sm font-medium text-gray-700"
        >
          Name
        </label>
        <input
          type="text"
          id="src-components-ProductTable-index-nameInput"
          name="name"
          className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
          placeholder="Widget X123"
          maxLength={30}
          value={filters.name}
          onChange={handleChange}
        />
      </div>

      {/* Create Date Filter */}
      <div id="src-components-ProductTable-index-createDateFilter">
        <label
          htmlFor="src-components-ProductTable-index-createDateInput"
          id="src-components-ProductTable-index-createDateLabel"
          className="block text-sm font-medium text-gray-700"
        >
          Created
        </label>
        <input
          type="date"
          id="src-components-ProductTable-index-createDateInput"
          name="createDate"
          className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
          value={filters.createDate ?? ""}
          onChange={handleChange}
        />
      </div>

      {/* Updated Date Filter */}
      <div id="src-components-ProductTable-index-updatedDateFilter">
        <label
          htmlFor="src-components-ProductTable-index-updatedDateInput"
          id="src-components-ProductTable-index-updatedDateLabel"
          className="block text-sm font-medium text-gray-700"
        >
          Updated
        </label>
        <input
          type="date"
          id="src-components-ProductTable-index-updatedDateInput"
          name="updatedDate"
          className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
          value={filters.updatedDate ?? ""}
          onChange={handleChange}
        />
      </div>

      {/* Price Filter */}
      <div id="src-components-ProductTable-index-priceFilter">
        <label
          htmlFor="src-components-ProductTable-index-priceInput"
          id="src-components-ProductTable-index-priceLabel"
          className="block text-sm font-medium text-gray-700"
        >
          Price
        </label>
        <input
          type="number"
          id="src-components-ProductTable-index-priceInput"
          name="price"
          className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
          placeholder="19.99"
          title="Enter a valid price"
          value={filters.price === null ? "" : filters.price}
          onChange={handleChange}
        />
      </div>

      {/* Stock Filter */}
      <div id="src-components-ProductTable-index-stockFilter">
        <label
          htmlFor="src-components-ProductTable-index-stockInput"
          id="src-components-ProductTable-index-stockLabel"
          className="block text-sm font-medium text-gray-700"
        >
          Stock
        </label>
        <input
          type="number"
          id="src-components-ProductTable-index-stockInput"
          name="stock"
          className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
          placeholder="100"
          min="0"
          max="99999"
          value={filters.stock === null ? "" : filters.stock}
          onChange={handleChange}
        />
      </div>

      {/* Block Filter */}
      <div id="src-components-ProductTable-index-blockFilter" className="flex items-center">
        <label
          htmlFor="src-components-ProductTable-index-blockInput"
          id="src-components-ProductTable-index-blockLabel"
          className="block text-sm font-medium text-gray-700 mr-2"
        >
          Blocked
        </label>
        <input
          type="checkbox"
          id="src-components-ProductTable-index-blockInput"
          name="block"
          className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
          checked={filters.block || false}
          onChange={handleChange}
        />
      </div>

      {/* Search Button */}
      <div id="src-components-ProductTable-index-searchButton">
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
      <div id="src-components-ProductTable-index-mainContainer" className="overflow-y-auto h-full bg-white">
        <div id="src-components-ProductTable-index-filterSection" className="filter-section flex justify-around p-3 bg-blue-100">
          <div id="src-components-ProductTable-index-formDesktop" className="hidden sm:block">
            {formMarkup()}
          </div>
          <div id="src-components-ProductTable-index-formMobile" className="block sm:hidden">
            <Accordion title="Filter options" startsOpen={false}>
              {formMarkup()}
            </Accordion>
          </div>
        </div>

        <table id="src-components-ProductTable-index-table" className="w-full">
          <thead id="src-components-ProductTable-index-tableHead">
            <tr id="src-components-ProductTable-index-headerRow">
              {tablePropertyAndSkeletonArr.map((e, index) => {
                if (e.isSortable) {
                  return (
                    <th
                      key={index}
                      id={`src-components-ProductTable-index-header-${index}`}
                      className={`py-2 px-4 text-left underline hover:cursor-pointer max-w-32 ${
                        prop === e.prop && "bg-primary text-white"
                      }`}
                      onClick={() => {
                        const newOrder =
                          prop === e.prop
                            ? order === "asc"
                              ? "desc"
                              : "asc"
                            : e.defOrder;

                        setTableState((prevState) => ({
                          ...prevState,
                          sort: {
                            prop: e.prop,
                            order: newOrder,
                          },
                        }));
                        fetchProducts(filters, {
                          prop: e.prop,
                          order: newOrder,
                        });
                      }}
                    >
                      <div id={`src-components-ProductTable-index-thContent-${index}`} className="flex gap-1 justify-between">
                        <p>{e.label}</p>
                        {prop === e.prop &&
                          (order === "asc" ? (
                            <IoIosArrowDown size={25} />
                          ) : (
                            <IoIosArrowUp size={25} />
                          ))}
                      </div>
                    </th>
                  );
                } else {
                  return (
                    <th key={index} id={`src-components-ProductTable-index-th-${index}`} className="py-2 px-4 text-left">
                      {e.label}
                    </th>
                  );
                }
              })}
            </tr>
          </thead>
          <tbody id="src-components-ProductTable-index-tableBody">
            {isLoading ? (
              Array(limit)
                .fill(null)
                .map((_, indexL) => (
                  <tr key={indexL} id={`src-components-ProductTable-index-rowLoading-${indexL}`} className="h-32">
                    {tablePropertyAndSkeletonArr.map((e, indexE) => (
                      <td key={indexE} id={`src-components-ProductTable-index-loadingCell-${indexL}-${indexE}`} className="py-2 px-4">
                        <div className="flex flex-col gap-1">
                          {Array(e.skeletonQuantity)
                            .fill(null)
                            .map((_, indexZ) => (
                              <div
                                key={indexZ}
                                id={`src-components-ProductTable-index-skeleton-${indexL}-${indexE}-${indexZ}`}
                                className={"skeleton animate-skeleton-fast " + e.skeletonStyle}
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
                  id={`src-components-ProductTable-index-productRow-${product._id}`}
                  style={{ backgroundColor: index % 2 === 0 ? "#f1f5f8" : "" }}
                >
                  <td id={`src-components-ProductTable-index-cellProductNumber-${product._id}`} className="py-2 px-4">{product.productNumber}</td>
                  <td id={`src-components-ProductTable-index-cellImage-${product._id}`} className="py-2 px-4">
                    <Image
                      width={400}
                      height={400}
                      alt={product.name}
                      src={product.images[0]}
                      className="w-20 h-20 min-h-20 min-w-20 object-cover rounded-sm overflow-hidden shadow-xl"
                    />
                  </td>
                  <td id={`src-components-ProductTable-index-cellName-${product._id}`} className="py-2 px-4">{product.name}</td>
                  <td id={`src-components-ProductTable-index-cellCreatedAt-${product._id}`} className="py-2 px-4">
                    {product.createdAt.split("T")[0]}
                  </td>
                  <td id={`src-components-ProductTable-index-cellUpdatedAt-${product._id}`} className="py-2 px-4">
                    {product.updatedAt.split("T")[0]}
                  </td>
                  <td id={`src-components-ProductTable-index-cellDescription-${product._id}`} className="py-2 px-4">
                    <div className="h-28 max-w-52 overflow-hidden flex items-center text-ellipsis whitespace-normal">
                      {product.description.slice(0, 90)}
                    </div>
                  </td>
                  <td id={`src-components-ProductTable-index-cellPrice-${product._id}`} className="py-2 px-4">${product.price}</td>
                  <td
                    id={`src-components-ProductTable-index-cellStock-${product._id}`}
                    className={`py-2 px-4 ${
                      product.stock < 1 && "text-red-500 font-bold"
                    }`}
                  >
                    {product.stock}
                  </td>
                  <td id={`src-components-ProductTable-index-cellBlock-${product._id}`} className="py-2 px-4">
                    <input
                      className="toggle toggle-error"
                      type="checkbox"
                      id={`src-components-ProductTable-index-blockToggle-${product._id}`}
                      checked={product.isBlocked}
                      onClick={() => {
                        toast.custom((t) => (
                          <div className="flex flex-col gap-2 items-center bg-white p-2 rounded-xl shadow-xl border-2 ">
                            <p className="text-lg text-center">
                              Are you sure you want to{" "}
                              {product.isBlocked ? "Unblock" : "Block"}{" "}
                              {product.name}?
                            </p>
                            <div className="flex  gap-2">
                              <button
                                className="btn btn-neutral min-w-20"
                                onClick={async () => {
                                  toast.dismiss(t);
                                }}
                              >
                                Cancel
                              </button>
                              <button
                                className="btn btn-warning min-w-20"
                                onClick={async () => {
                                  toast.dismiss(t);
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
                                  handleBlockClick(
                                    product._id,
                                    !product.isBlocked
                                  );
                                }}
                              >
                                {product.isBlocked ? "Unblock" : "Block"}
                              </button>
                            </div>
                          </div>
                        ));
                      }}
                    />
                  </td>
                  <td
                    id={`src-components-ProductTable-index-cellStatus-${product._id}`}
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
                  <td id={`src-components-ProductTable-index-cellActions-${product._id}`} className="py-2 px-4">
                    <div className="flex flex-col gap-4">
                      <LuClipboardEdit
                        size={30}
                        className="hover:cursor-pointer"
                        onClick={() => {
                          router.push(`/admin/products/edit/${product._id}`);
                        }}
                      />
                      <LuTrash2
                        className="hover:cursor-pointer"
                        size={30}
                        onClick={() => {
                          toast.custom((t) => (
                            <div className="flex flex-col gap-2 items-center bg-white p-2 rounded-xl shadow-xl border-2">
                              <p className="text-lg text-center">
                                Are you sure you want to delete {product.name}?
                              </p>
                              <div className="flex gap-2">
                                <button
                                  className="btn btn-neutral w-20"
                                  onClick={async () => {
                                    toast.dismiss(t);
                                  }}
                                >
                                  Cancel
                                </button>
                                <button
                                  className="btn btn-error w-20"
                                  onClick={async () => {
                                    toast.dismiss(t);
                                    setTableState((prevState) => ({
                                      ...prevState,
                                      currentProducts:
                                        prevState.currentProducts.filter(
                                          (e) => e._id !== product._id
                                        ),
                                    }));
                                    handleDeleteProduct(product._id);
                                  }}
                                >
                                  Delete
                                </button>
                              </div>
                            </div>
                          ));
                        }}
                      />
                    </div>
                  </td>
                </tr>
              ))
            ) : (
                  <tr id="src-components-ProductTable-index-noProducts">
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
