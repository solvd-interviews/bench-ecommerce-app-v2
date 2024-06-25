import Link from "next/link";
import React from "react";

const Header = () => {
  return (
    <header>
      <h3>Solvd Ecommerce</h3>
      <nav>
        <ul className="flex gap-3 ">
          <li className="hover:underline">
            <Link href={"/"}>Home</Link>
          </li>
          <li className="hover:underline">
            <Link href={"/sign-in"}>Sign In</Link>
          </li>
          <li className="hover:underline">
            <Link href={"/cart"}>Cart</Link>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;
