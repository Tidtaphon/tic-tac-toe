// import { DefaultSession, DefaultUser } from "next-auth";
// import { AdapterUser } from "next-auth/adapters";

// declare module "next-auth" {
//   interface Session {
//     user: {
//       id: string;
//       score: number;
//       winStreak: number;
//     } & DefaultSession["user"];
//   }

//   interface User extends DefaultUser {
//     score: number;
//     winStreak: number;
//   }
// }

// declare module "next-auth/adapters" {
//   interface AdapterUser {
//     score: number;
//     winStreak: number;
//   }
// }

import { DefaultSession, DefaultUser } from "next-auth";
import { JWT } from "next-auth/jwt";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      score: number;
      winStreak: number;
      role: "ADMIN" | "USER";
    } & DefaultSession["user"];
  }

  interface User extends DefaultUser {
    score: number;
    winStreak: number;
    role: "ADMIN" | "USER";
  }
}

declare module "next-auth/adapters" {
  interface AdapterUser {
    score: number;
    winStreak: number;
    role: "ADMIN" | "USER";
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    user: {
      id: string;
      score: number;
      winStreak: number;
      role: "ADMIN" | "USER";
    };
  }
}
