import Link from "next/link";

import { LuArrowRight } from "react-icons/lu";

const Page = () => {
  return (
    <div className="p-4">
      <button className="btn btn-primary ">
        <Link href={"/admin/products/create"} className="flex items-center gap-2">
          Create Product
          <LuArrowRight size={25}/>
        </Link>
      </button>
      <div>Admin products dashboard view</div>
    </div>
  );
};

export default Page;
