"use client";

import { signOut } from "next-auth/react";

export default function LogoutButton() {
  return (
    <button 
      onClick={() => signOut({ callbackUrl: '/' })} 
      className="text-red-500 hover:underline underline-offset-4 decoration-[3px] text-left uppercase text-sm font-bold tracking-wide"
    >
      Sign Out
    </button>
  );
}
