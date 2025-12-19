// import { withAuth } from "next-auth/middleware";

// export default withAuth({
//   pages: {
//     signIn: "/login",
//   },
// });

// export const config = {
//   matcher: ["/game/:path*", "/admin/:path*"],
// };

import { withAuth } from "next-auth/middleware";

export default withAuth({
  callbacks: {
    authorized({ token, req }) {
      if (req.nextUrl.pathname.startsWith("/admin")) {
        return token?.user?.role === "ADMIN";
      }
      return true;
    },
  },
});

export const config = {
  matcher: ["/game/:path*", "/admin/:path*"],
};
