"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white">
      <div className="border-2 border-solid rounded flex flex-col p-2.5 gap-2 mb-2">
        <input
          placeholder="Admin email"
          onChange={(e) => setEmail(e.target.value)}
          className="px-3 py-2 border-2 rounded text-black"
        />
        <input
          type="password"
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
          className="px-3 py-2 border-2 border-solid rounded text-black"
        />
        <button
          onClick={() =>
            signIn("credentials", {
              email,
              password,
              callbackUrl: "/admin",
            })
          }
          className="px-6 py-3 bg-blue-600 rounded"
        >
          Admin Login
        </button>
      </div>

      <button
        onClick={() => signIn("google", { callbackUrl: "/" })}
        className="px-6 py-3 bg-red-600 rounded hover:bg-red-500"
      >
        Sign in with Google
      </button>
    </div>
  );
}
