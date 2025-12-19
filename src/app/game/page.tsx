"use client";

import Board from "@/components/Board";
import ScoreBoard from "@/components/ScoreBoard";
import { signOut } from "next-auth/react";

export default function GamePage() {
  return (
    <div className="min-h-screen flex flex-col items-center gap-6 p-6">
      <button
        onClick={() => signOut()}
        className="px-6 py-3 bg-red-600 rounded hover:bg-red-500"
      >
        Sign Out
      </button>
      <h1 className="text-3xl font-bold">OX Game</h1>
      <ScoreBoard />
      <Board />
    </div>
  );
}
