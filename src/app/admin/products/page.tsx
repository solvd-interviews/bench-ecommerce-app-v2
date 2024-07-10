import ProductTable from "@/components/ProductTable";
import Link from "next/link";

import { LuArrowRight, LuArrowLeft } from "react-icons/lu";

const Page = () => {
  return (
    <>
      <div className="flex gap-5 items-center px-4 h-16 min-h-16">
        <button className="btn btn-primary w-24 ">
          <Link href={"/admin"} className="flex items-center gap-2">
            <LuArrowLeft size={25} />
            Back
          </Link>
        </button>
        <h2 className="text-3xl font-bold">Admin products dashboard view</h2>
        <button className="btn btn-primary w-52 ">
          <Link
            href={"/admin/products/create"}
            className="flex items-center gap-2"
          >
            Create Product
            <LuArrowRight size={25} />
          </Link>
        </button>
      </div>
      <div className="flex-grow overflow-hidden flex flex-col ">
        <ProductTable />
      </div>
    </>
  );
};

export default Page;
