"use client";
import { useSession } from "next-auth/react";
import Link from "next/link";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { AiOutlineClose, AiOutlineMenu } from "react-icons/ai";
import LogOutButtonClient from "../LogOutButtonClient";

const ToggleMenu = ({ isAdmin = false }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { data: session } = useSession();
  const menuRef = useRef<HTMLDivElement>(null);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleClickOutside = useCallback((event: MouseEvent | TouchEvent) => {
    if (
      menuRef.current &&
      !menuRef.current.contains(event.target as Node) // Cast to Node
    ) {
      setIsMobileMenuOpen(false);
    }
  }, []);

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.addEventListener(
        "mousedown",
        handleClickOutside as EventListener
      );
      document.addEventListener(
        "touchstart",
        handleClickOutside as EventListener
      ); // Add touch event
    } else {
      document.removeEventListener(
        "mousedown",
        handleClickOutside as EventListener
      );
      document.removeEventListener(
        "touchstart",
        handleClickOutside as EventListener
      ); // Remove touch event
    }
    return () => {
      document.removeEventListener(
        "mousedown",
        handleClickOutside as EventListener
      );
      document.removeEventListener(
        "touchstart",
        handleClickOutside as EventListener
      ); // Clean up touch event
    };
  }, [isMobileMenuOpen, handleClickOutside]);

  return (
    <div className="sm:hidden flex items-center relative" ref={menuRef}>
      <button onClick={toggleMobileMenu} className="mr-2">
        {isMobileMenuOpen ? (
          <AiOutlineClose size={25} />
        ) : (
          <AiOutlineMenu size={25} />
        )}
      </button>
      <div></div>
      {isMobileMenuOpen && (
        <nav
          onClick={() => setIsMobileMenuOpen(false)}
          className="absolute top-full right-1 mt-2 bg-gray-200 shadow-lg min-w-max rounded-lg"
        >
          <ul className="flex flex-col gap-2 p-2">
            {isAdmin ? (
              <>
                <li className="hover:bg-gray-600 hover:text-white p-1 rounded">
                  <Link className="p-3" href={"/admin"}>
                    Admin&apos;s Home
                  </Link>
                </li>
                <li className="hover:bg-gray-600 hover:text-white p-1 rounded">
                  <Link className="p-3" href={"/"}>
                    User&apos;s Home
                  </Link>
                </li>
                <li className="hover:bg-gray-600 hover:text-white p-1 rounded">
                  <Link className="p-3" href={"/admin/products"}>
                    Products
                  </Link>
                </li>
                <li className="hover:bg-gray-600 hover:text-white p-1 rounded">
                  <Link className="p-3" href={"/admin/users"}>
                    Users
                  </Link>
                </li>
              </>
            ) : (
              <>
                <li className="hover:bg-gray-600 hover:text-white p-1 rounded">
                  <Link className="p-3" href={"/orders"}>
                    Orders
                  </Link>
                </li>
                <li className="hover:bg-gray-600 hover:text-white p-1 rounded">
                  <Link className="p-3" href={"/cart"}>
                    Cart
                  </Link>
                </li>
                <li className=" p-1 rounded flex justify-center">
                  {session ? (
                    <LogOutButtonClient />
                  ) : (
                    <Link href={"/login"} className="w-full h-full max-w-24">
                      <button className="btn btn-primary w-full max-w-24">
                        Login
                      </button>
                    </Link>
                  )}
                </li>
              </>
            )}
          </ul>
        </nav>
      )}
    </div>
  );
};

export default ToggleMenu;
