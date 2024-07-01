import Link from "next/link";
import LogOutButtonClient from "../LogOutButtonClient";
import { getServerSession } from "next-auth";
import { config } from "@/lib/auth";
import { LuShield } from "react-icons/lu";

const Header = async ({ isAdmin = false }: { isAdmin?: boolean }) => {
  const session = await getServerSession(config);
  return (
    <>
      <header className="w-full bg-gray-300 flex justify-around items-center p-2 mb-2 fixed z-10 h-18">
        <div className="flex gap-2">
          <svg viewBox="0 0 492.1 121.4" className="w-20">
            <path d="M61.4,113.2c-6.2,4.8-14.5,7.4-25.8,7.4c-12.7,0-26-3.9-35.6-13l10.3-16.3c6.8,5.8,18.1,10.3,25,10.3 c6.8,0,11.6-1.7,11.6-7.2s-12.3-8.2-15.4-9.2c-3.3-0.9-8-2.2-12-3.9c-3.9-1.7-14.4-7-14.4-22.1c0-16.4,14.4-26.5,32-26.5 s27.6,6.5,32.3,10.4l-8.9,16.1C55.7,55.4,46.1,51,39.3,51c-6.5,0-10.1,1.7-10.1,6.2s6.5,6.5,12.3,8.2c5.8,1.7,8.4,2.6,12,3.9 c3.8,1.4,8,3.6,11,6.3c2.7,2.7,6.8,8.2,6.8,17.1C71.3,101.3,67.6,108.2,61.4,113.2L61.4,113.2z M134,120c27.4,0,45.7-17.2,45.7-42.8 c0-25.7-18.4-43-45.7-43c-27.5,0-45.9,17.3-45.9,43C88.1,102.8,106.6,120,134,120z M134,54.8c12,0,19.2,9.4,19.2,21.9 S146,98.6,134,98.6c-12.2,0-19.2-9.4-19.2-21.9C114.9,64.2,121.9,54.8,134,54.8z M228.1,119.6h-27.4V1.5h27.4V119.6z M441.6,0h-24 v44c-4.1-5.7-15-9.2-23-9.2c-27.5-0.1-44.8,17.1-44.8,42.8c0,25.6,18.4,42.8,45.9,42.8c27.2,0,45.5-17,45.7-42.3 c0.1-0.7,0.2-1.5,0.2-2.3L441.6,0L441.6,0z M395.7,99c-12.2,0-19.2-9.4-19.2-21.9s7-21.9,19.2-21.9c12,0,19.2,9.4,19.2,21.9 C414.8,89.6,407.6,99,395.7,99z M339.9,35.3l-34.7,84.4h-25.7l-34.6-84.4h28.6l19.2,53.4l19-53.4H339.9z"></path>
            <circle cx="476.2" cy="105.5" r="15.9"></circle>
          </svg>
          {isAdmin && (
            <div className="flex gap-2 items-center ">
              <p className="text-2xl font-bold">| Admin</p>
              <LuShield size={25} />
            </div>
          )}
        </div>

        {isAdmin ? (
          <nav>
            <ul className="flex gap-3 ">
              <li className="hover:underline">
                <Link href={"/admin"}>Admin&apos;s Home</Link>
              </li>

              <li className="hover:underline">
                <Link href={"/admin/products"}>Product</Link>
              </li>
              <li className="hover:underline">
                <Link href={"/admin/users"}>Users</Link>
              </li>
            </ul>
          </nav>
        ) : (
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
        )}

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
      <div className="w-full h-20"></div>
    </>
  );
};

export default Header;
