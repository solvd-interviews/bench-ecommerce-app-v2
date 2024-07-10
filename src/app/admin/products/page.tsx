import ProductTable from "@/components/ProductTable";
import Link from "next/link";

import { LuArrowRight, LuArrowLeft } from "react-icons/lu";

const Page = () => {
  return (
    <>
      <div className="flex gap-5 items-center px-4 h-16 min-h-16 justify-center ">
        <button className="btn btn-primary">
          <Link href={"/admin"} className="flex items-center gap-2">
            <LuArrowLeft size={25} />
            Back
          </Link>
        </button>
        <h2 className="md:text-3xl font-bold text-center">
          Products dashboard
        </h2>
        <button className="btn btn-primary  ">
          <Link
            href={"/admin/products/create"}
            className="flex items-center gap-2"
          >
            Create
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
