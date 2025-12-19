import Link from "next/link";
import { getServerSession } from "next-auth";

export default async function HomePage() {
  const session = await getServerSession();
  console.log("session", session?.user.name);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-6">
      <h1 className="text-4xl font-bold">OX Game</h1>
      <p className="text-gray-400">Tic Tac Toe - Player vs Bot</p>

      {session ? (
        <>
          <p>Name : {session?.user.name}</p>
          <div className="flex gap-4">
            <Link
              href="/game"
              className="px-6 py-3 bg-green-600 rounded hover:bg-green-500"
            >
              Play Game
            </Link>
          </div>
        </>
      ) : (
        <Link
          href="/login"
          className="px-6 py-3 bg-indigo-600 rounded hover:bg-indigo-500"
        >
          Login to Play
        </Link>
      )}
    </div>
  );
}
