// import type { NextAuthOptions } from "next-auth";
// import GoogleProvider from "next-auth/providers/google";
// import CredentialsProvider from "next-auth/providers/credentials";
// // import { PrismaAdapter } from "@auth/prisma-adapter";
// import { PrismaAdapter } from "@next-auth/prisma-adapter";

// import { prisma } from "./prisma";
// import bcrypt from "bcryptjs";

// export const authOptions: NextAuthOptions = {
//   adapter: PrismaAdapter(prisma),
//   providers: [
//     GoogleProvider({
//       clientId: process.env.GOOGLE_CLIENT_ID!,
//       clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
//     }),
//     CredentialsProvider({
//       name: "Admin Login",
//       credentials: {
//         email: { label: "Email", type: "email" },
//         password: { label: "Password", type: "password" },
//       },

//       async authorize(credentials, req) {
//         if (!credentials) return null;

//         const user = await prisma.user.findUnique({
//           where: { email: credentials.email },
//         });

//         if (!user || !user.password) return null;
//         if (user.role !== "ADMIN") return null;

//         const isValid = await bcrypt.compare(
//           credentials.password,
//           user.password
//         );

//         if (!isValid) return null;

//         return {
//           id: user.id,
//           email: user.email,
//           name: user.name,
//           role: user.role,
//         };
//       },
//     }),
//   ],
//   session: {
//     strategy: "jwt" as const,
//   },
//   // session: {
//   //   strategy: "database",
//   // },
//   callbacks: {
//     // async jwt({ token, user }) {
//     //   // จะเข้าตรงนี้เฉพาะตอน login เท่านั้น
//     //   if (user) {
//     //     token.id = user.id;
//     //     token.score = user.score ?? 0;
//     //     token.winStreak = user.winStreak ?? 0;
//     //   }
//     //   return token;
//     // },
//     // async session({ session, user }) {
//     //   if (session.user) {
//     //     session.user.id = user.id;
//     //     session.user.score = user.score;
//     //     session.user.winStreak = user.winStreak;
//     //   }
//     //   return session;
//     // },

//     async jwt({ token, user }) {
//       // ใส่เฉพาะตอน login สำเร็จ
//       if (user) {
//         token.user = {
//           id: user.id,
//           score: user.score ?? 0,
//           winStreak: user.winStreak ?? 0,
//         };
//       }
//       return token;
//     },

//     async session({ session, token }) {
//       // ✅ ห้ามแตะ token.id โดยตรง
//       if (session.user && token?.user) {
//         session.user = {
//           ...session.user,
//           ...token.user,
//         };
//       }
//       return session;
//     },
//   },
//   pages: {
//     signIn: "/login",
//   },
//   secret: process.env.NEXTAUTH_SECRET,
// };

import type { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "./prisma";
import bcrypt from "bcryptjs";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),

  providers: [
    // ---------- Google (USER) ----------
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),

    // ---------- Credentials (ADMIN only) ----------
    CredentialsProvider({
      name: "Admin Login",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },

      async authorize(credentials) {
        if (!credentials?.email || !credentials.password) return null;

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });

        if (!user) return null;
        if (!user.password) return null;
        if (user.role !== "ADMIN") return null;

        const isValid = await bcrypt.compare(
          credentials.password,
          user.password
        );

        if (!isValid) return null;

        // ✅ return ให้ตรงกับ NextAuth User
        return {
          id: user.id,
          email: user.email!, // 🔥 บังคับให้เป็น string
          name: user.name,
          role: user.role,
          score: user.score,
          winStreak: user.winStreak,
        };
      },
    }),
  ],

  session: {
    strategy: "jwt",
  },

  callbacks: {
    async jwt({ token, user }) {
      // login ครั้งแรก (Google หรือ Credentials)
      if (user) {
        token.user = {
          id: user.id,
          role: user.role ?? "USER", // 🔥 สำคัญมาก
          score: user.score ?? 0,
          winStreak: user.winStreak ?? 0,
        };
      }
      return token;
    },

    async session({ session, token }) {
      if (session.user && token.user) {
        session.user = {
          ...session.user,
          ...token.user,
        };
      }
      return session;
    },
  },

  pages: {
    signIn: "/login",
  },

  secret: process.env.NEXTAUTH_SECRET,
};
