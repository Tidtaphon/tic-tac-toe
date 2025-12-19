// import { Cell } from "./gameLogic";

// export const botMove = (board: Cell[]) => {
//   const empty = board
//     .map((v, i) => (v === null ? i : null))
//     .filter((v) => v !== null) as number[];

//   return empty[Math.floor(Math.random() * empty.length)];
// };

//=================================================================//
// import { Cell } from "@/lib/gameLogic";
// import { checkWinner } from "@/lib/gameLogic";

// const HUMAN: Cell = "X";
// const AI: Cell = "O";

// export function botMove(board: Cell[]): number | undefined {
//   let bestScore = -Infinity;
//   let move: number | undefined = undefined;

//   for (let i = 0; i < board.length; i++) {
//     if (!board[i]) {
//       board[i] = AI;
//       const score = minimax(board, 0, false);
//       board[i] = null;

//       if (score > bestScore) {
//         bestScore = score;
//         move = i;
//       }
//     }
//   }

//   return move;
// }

// function minimax(board: Cell[], depth: number, isMaximizing: boolean): number {
//   const result = checkWinner(board);

//   if (result === AI) return 10 - depth;
//   if (result === HUMAN) return depth - 10;
//   if (result === "draw") return 0;

//   if (isMaximizing) {
//     let bestScore = -Infinity;
//     for (let i = 0; i < board.length; i++) {
//       if (!board[i]) {
//         board[i] = AI;
//         const score = minimax(board, depth + 1, false);
//         board[i] = null;
//         bestScore = Math.max(score, bestScore);
//       }
//     }
//     return bestScore;
//   } else {
//     let bestScore = Infinity;
//     for (let i = 0; i < board.length; i++) {
//       if (!board[i]) {
//         board[i] = HUMAN;
//         const score = minimax(board, depth + 1, true);
//         board[i] = null;
//         bestScore = Math.min(score, bestScore);
//       }
//     }
//     return bestScore;
//   }
// }

//=================================================================//

import { Cell } from "@/lib/gameLogic";
import { checkWinner } from "@/lib/gameLogic";

export type Difficulty = "easy" | "normal" | "impossible";

const HUMAN: Cell = "X";
const AI: Cell = "O";

/* ---------- PUBLIC API ---------- */
export function botMove(
  board: Cell[],
  difficulty: Difficulty
): number | undefined {
  if (difficulty === "easy") {
    return randomMove(board);
  }

  if (difficulty === "normal") {
    // 50% เล่นดี / 50% เล่นมั่ว
    return Math.random() < 0.5 ? minimaxMove(board) : randomMove(board);
  }

  // impossible
  return minimaxMove(board);
}

/* ---------- EASY ---------- */
function randomMove(board: Cell[]): number | undefined {
  const empty = board
    .map((cell, i) => (cell === null ? i : null))
    .filter((i): i is number => i !== null);

  if (empty.length === 0) return undefined;
  return empty[Math.floor(Math.random() * empty.length)];
}

/* ---------- IMPOSSIBLE ---------- */
function minimaxMove(board: Cell[]): number | undefined {
  let bestScore = -Infinity;
  let move: number | undefined;

  for (let i = 0; i < board.length; i++) {
    if (!board[i]) {
      board[i] = AI;
      const score = minimax(board, 0, false);
      board[i] = null;

      if (score > bestScore) {
        bestScore = score;
        move = i;
      }
    }
  }

  return move;
}

function minimax(board: Cell[], depth: number, isMaximizing: boolean): number {
  const result = checkWinner(board);

  if (result === AI) return 10 - depth;
  if (result === HUMAN) return depth - 10;
  if (result === "draw") return 0;

  if (isMaximizing) {
    let best = -Infinity;
    for (let i = 0; i < board.length; i++) {
      if (!board[i]) {
        board[i] = AI;
        best = Math.max(best, minimax(board, depth + 1, false));
        board[i] = null;
      }
    }
    return best;
  } else {
    let best = Infinity;
    for (let i = 0; i < board.length; i++) {
      if (!board[i]) {
        board[i] = HUMAN;
        best = Math.min(best, minimax(board, depth + 1, true));
        board[i] = null;
      }
    }
    return best;
  }
}
