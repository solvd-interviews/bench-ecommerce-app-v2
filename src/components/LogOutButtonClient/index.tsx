"use client";
import { LuLogOut } from "react-icons/lu";
import { signOut, useSession } from "next-auth/react";

export default function LogOutButtonClient() {
  const { data: session } = useSession();
  return (
    <button
      className="btn btn-primary"
      onClick={() => {
        signOut();
      }}
    >
      Logout <LuLogOut  />
    </button>
  );
}
