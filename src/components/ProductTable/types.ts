import { Product } from "@/lib/models/ProductModel";

export interface ProductTableState {
  isLoading: boolean;
  page: number;
  totalPages: undefined | number;
  currentProducts: Product[];
  limit: number;
  sort: {
    prop: string;
    order: "asc" | "desc";
  };
}

export interface Filter {
  id: number | null;
  name: string | null;
  createDate: Date | string | null;
  updatedDate: Date | string | null;
  price: number | null;
  stock: number | null;
  block: boolean | null
}
