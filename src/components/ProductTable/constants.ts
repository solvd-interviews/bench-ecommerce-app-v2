export const tablePropertyAndSkeletonArr: {
  label: string;
  prop: string;
  defOrder: "asc" | "desc";
  isSortable: boolean;
  icon?: "number" | "str";
  skeletonStyle: string;
  skeletonQuantity: number;
}[] = [
    {
      label: "Id",
      prop: "productNumber",
      defOrder: "desc",
    isSortable: true,
      icon: "number",
      skeletonStyle: "h-4 w-4",
      skeletonQuantity: 1,
    },
    {
      label: "Images",
      isSortable: false,
      prop: "",
      defOrder: "asc",
      skeletonStyle: "h-20 w-24",
      skeletonQuantity: 1,
    },
    {
      label: "Name",
      prop: "name",
      defOrder: "asc",
      isSortable: true,
      icon: "str",
      skeletonStyle: "h-4 w-56",
      skeletonQuantity: 1,
    },
    {
      label: "Created At",
      prop: "createdAt",
      defOrder: "desc",
      isSortable: true,
      icon: "str",
      skeletonStyle: "h-4 w-20",
      skeletonQuantity: 1,
    },
    {
      label: "Updated At",
      prop: "updatedAt",
      defOrder: "desc",
      isSortable: true,
      icon: "str",
      skeletonStyle: "h-4 w-20",
      skeletonQuantity: 1,
    },
    {
      label: "Description",
      prop: "description",
      defOrder: "asc",
      isSortable: false,
      icon: "str",
      skeletonStyle: "h-4 w-56",
      skeletonQuantity: 3,
    },
    {
      label: "Price",
      prop: "price",
      defOrder: "asc",
      isSortable: true,
      icon: "number",
      skeletonStyle: "h-4 w-10",
      skeletonQuantity: 1,
    },
    {
      label: "Stock",
      prop: "stock",
      defOrder: "asc",
      isSortable: true,
      icon: "number",
      skeletonStyle: "h-4 w-10",
      skeletonQuantity: 1,
    },
    {
      label: "Block",
      prop: "isBlocked",
      defOrder: "asc",
      isSortable: false,
      icon: "str",
      skeletonStyle: "h-7 w-12",
      skeletonQuantity: 1,
    },
    {
      label: "Status",
      isSortable: false,
      prop: "",
      defOrder: "asc",
      skeletonStyle: "h-7 w-12",
      skeletonQuantity: 1,
    },
    {
      label: "Actions",
      isSortable: false,
      prop: "",
      defOrder: "asc",
      skeletonStyle: "h-10 w-20",
      skeletonQuantity: 2,
    },
  ];