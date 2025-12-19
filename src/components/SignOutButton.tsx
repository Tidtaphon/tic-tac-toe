"use client";

import { signOut } from "next-auth/react";

export default function SignOutButton() {
  return (
    <button
      onClick={() => signOut({ callbackUrl: "/login" })}
      className="px-6 py-3 bg-red-600 rounded hover:bg-red-500 text-white"
    >
      Sign Out
    </button>
  );
}
