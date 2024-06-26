import Link from "next/link";
import LogOutButtonClient from "../LogOutButtonClient";
import { getServerSession } from "next-auth";
import { config } from "@/lib/auth";

const Header = async () => {
  const session = await getServerSession(config);
  return (
    <header className="w-full bg-gray-300 flex justify-around items-center p-2 mb-2 fixed z-10 h-18">
      <h3>Solvd Ecommerce</h3>
      <nav>
        <ul className="flex gap-3 ">
          <li className="hover:underline">
            <Link href={"/"}>Home</Link>
          </li>
          <li className="hover:underline">
            <Link href={"/login"}>Log in</Link>
          </li>
          <li className="hover:underline">
            <Link href={"/cart"}>Cart</Link>
          </li>
        </ul>
      </nav>
      {session ? (
        <div className="flex gap-4 items-center">
          <h2
            className="font-bold text-white "
            style={{ textShadow: "#000 0px 0 5px" }}
          >
            {session?.user?.name}
          </h2>
          <LogOutButtonClient />
        </div>
      ) : (
        <Link href={"/login"}>
          <button className="btn btn-primary">Login</button>
        </Link>
      )}
    </header>
  );
};

export default Header;
