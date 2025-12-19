"use client";

import useSWR from "swr";

const fetcher = (url: string) =>
  fetch(url, { cache: "no-store" }).then((res) => res.json());

export default function ScoreBoard() {
  const { data, isLoading } = useSWR("/api/scores", fetcher);

  if (isLoading) {
    return (
      <div className="bg-gray-800 text-white px-6 py-4 rounded-lg">
        Loading...
      </div>
    );
  }

  return (
    <>
      <h3>Name : {data.name}</h3>
      <div className="bg-gray-800 text-white px-6 py-4 rounded-lg shadow">
        <div className="flex gap-6">
          <div className="flex flex-col justify-center items-center">
            <p className="text-sm text-gray-400">Score</p>
            <p className="text-2xl font-bold">{data.score}</p>
          </div>
          <div className="flex flex-col justify-center items-center">
            <p className="text-sm text-gray-400">Win Streak</p>
            <p className="text-2xl font-bold">{data.winStreak}</p>
          </div>
        </div>
      </div>
    </>
  );
}
