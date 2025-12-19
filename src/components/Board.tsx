// "use client";

// import { useState } from "react";
// import { botMove } from "@/lib/bot";
// import { checkWinner, Cell } from "@/lib/gameLogic";

// export default function Board() {
//   const [board, setBoard] = useState<Cell[]>(Array(9).fill(null));
//   const [status, setStatus] = useState<string>("Your turn");

//   const handleClick = async (index: number) => {
//     if (board[index] || status !== "Your turn") return;

//     const newBoard = [...board];
//     newBoard[index] = "X";

//     let result = checkWinner(newBoard);
//     if (result) {
//       endGame(result);
//       setBoard(newBoard);
//       return;
//     }

//     // Bot move
//     const botIndex = botMove(newBoard);
//     if (botIndex !== undefined) {
//       newBoard[botIndex] = "O";
//     }

//     result = checkWinner(newBoard);
//     if (result) {
//       endGame(result);
//     }

//     setBoard(newBoard);
//   };

//   const endGame = async (result: string) => {
//     let gameResult: "win" | "lose" | "draw" = "draw";

//     if (result === "X") {
//       setStatus("You Win!");
//       gameResult = "win";
//     } else if (result === "O") {
//       setStatus("You Lose!");
//       gameResult = "lose";
//     } else {
//       setStatus("Draw!");
//     }

//     await fetch("/api/game", {
//       method: "POST",
//       body: JSON.stringify({ result: gameResult }),
//     });

//     setTimeout(resetGame, 1500);
//   };

//   const resetGame = () => {
//     setBoard(Array(9).fill(null));
//     setStatus("Your turn");
//   };

//   return (
//     <div className="flex flex-col items-center gap-4">
//       <p className="text-lg font-semibold">{status}</p>

//       <div className="grid grid-cols-3 gap-2">
//         {board.map((cell, i) => (
//           <button
//             key={i}
//             onClick={() => handleClick(i)}
//             className="w-20 h-20 bg-gray-700 hover:bg-gray-600 text-white text-3xl font-bold rounded"
//           >
//             {cell}
//           </button>
//         ))}
//       </div>
//     </div>
//   );
// }

// "use client";

// import { useState } from "react";
// import { botMove } from "@/lib/bot";
// import { checkWinner, Cell } from "@/lib/gameLogic";
// import { mutate } from "swr";

// export default function Board() {
//   const [board, setBoard] = useState<Cell[]>(Array(9).fill(null));
//   const [status, setStatus] = useState("Your turn");

//   const handleClick = async (index: number) => {
//     if (board[index] || status !== "Your turn") return;

//     const newBoard = [...board];
//     newBoard[index] = "X";

//     let result = checkWinner(newBoard);
//     if (result) {
//       setBoard(newBoard);
//       await endGame(result);
//       return;
//     }

//     const botIndex = botMove(newBoard);
//     if (botIndex !== undefined) {
//       newBoard[botIndex] = "O";
//     }

//     result = checkWinner(newBoard);
//     if (result) {
//       await endGame(result);
//     }

//     setBoard(newBoard);
//   };

//   const endGame = async (result: string) => {
//     let gameResult: "win" | "lose" | "draw" = "draw";

//     if (result === "X") {
//       setStatus("You Win!");
//       gameResult = "win";
//     } else if (result === "O") {
//       setStatus("You Lose!");
//       gameResult = "lose";
//     } else {
//       setStatus("Draw!");
//     }

//     await fetch("/api/game", {
//       method: "POST",
//       body: JSON.stringify({ result: gameResult }),
//     });

//     // 🔥 บอก SWR ให้ดึงคะแนนใหม่จาก DB
//     mutate("/api/scores");

//     setTimeout(resetGame, 1500);
//   };

//   const resetGame = () => {
//     setBoard(Array(9).fill(null));
//     setStatus("Your turn");
//   };

//   return (
//     <div className="flex flex-col items-center gap-4">
//       <p className="text-lg font-semibold">{status}</p>

//       <div className="grid grid-cols-3 gap-2">
//         {board.map((cell, i) => (
//           <button
//             key={i}
//             onClick={() => handleClick(i)}
//             className="w-20 h-20 bg-gray-700 hover:bg-gray-600 text-white text-3xl font-bold rounded"
//           >
//             {cell}
//           </button>
//         ))}
//       </div>
//     </div>
//   );
// }

"use client";

import { useEffect, useState } from "react";
import { botMove, Difficulty } from "@/lib/bot";
import { checkWinner, Cell } from "@/lib/gameLogic";
import { mutate } from "swr";

export default function Board() {
  const [board, setBoard] = useState<Cell[]>(Array(9).fill(null));
  const [status, setStatus] = useState("Your turn");
  const [difficulty, setDifficulty] = useState<Difficulty>("normal");

  /* ---------------- GAME LOGIC ---------------- */

  const handleClick = async (index: number) => {
    if (board[index] || status !== "Your turn") return;

    const newBoard = [...board];
    newBoard[index] = "X";

    let result = checkWinner(newBoard);
    if (result) {
      setBoard(newBoard);
      await endGame(result);
      return;
    }

    // 🤖 Bot move (ตาม difficulty)
    const botIndex = botMove(newBoard, difficulty);
    if (botIndex !== undefined) {
      newBoard[botIndex] = "O";
    }

    result = checkWinner(newBoard);
    if (result) {
      await endGame(result);
    }

    setBoard(newBoard);
  };

  const endGame = async (result: string) => {
    let gameResult: "win" | "lose" | "draw" = "draw";

    if (result === "X") {
      setStatus("You Win!");
      gameResult = "win";
    } else if (result === "O") {
      setStatus("You Lose!");
      gameResult = "lose";
    } else {
      setStatus("Draw!");
    }

    await fetch("/api/game", {
      method: "POST",
      body: JSON.stringify({ result: gameResult }),
    });

    // 🔄 update score จาก DB
    mutate("/api/scores");

    setTimeout(resetGame, 1500);
  };

  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setStatus("Your turn");
  };

  /* 🔁 เปลี่ยน difficulty → reset เกม */
  useEffect(() => {
    resetGame();
  }, [difficulty]);

  /* ---------------- UI ---------------- */

  return (
    <div className="flex flex-col items-center gap-4">
      {/* Difficulty selector */}
      <div className="flex gap-2">
        {(["easy", "normal", "impossible"] as Difficulty[]).map((level) => (
          <button
            key={level}
            onClick={() => setDifficulty(level)}
            className={`px-3 py-1 rounded text-sm font-semibold
                ${
                  difficulty === level
                    ? "bg-blue-600"
                    : "bg-gray-600 hover:bg-gray-500"
                }`}
          >
            {level.toUpperCase()}
          </button>
        ))}
      </div>

      <p className="text-lg font-semibold">{status}</p>

      <div className="grid grid-cols-3 gap-2">
        {board.map((cell, i) => (
          <button
            key={i}
            onClick={() => handleClick(i)}
            className="w-20 h-20 bg-gray-700 hover:bg-gray-600
                       text-white text-3xl font-bold rounded"
          >
            {cell}
          </button>
        ))}
      </div>
    </div>
  );
}
