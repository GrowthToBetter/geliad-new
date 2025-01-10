import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

// middleware is applied to all routes, use conditionals to select
export default withAuth(
  function middleware(req) {
    const { token } = req.nextauth;
    const { pathname } = req.nextUrl;

    if (
      (pathname.startsWith("/admin") && (!token || token.role === "VIEWER")) ||
      (pathname.startsWith("/product") && (!token || token.role === "VIEWER")) ||
      (pathname.startsWith("/karya") && (!token || token.role === "VIEWER")) ||
      (pathname.startsWith("/notification") && (!token || token.role === "VIEWER")) ||
      (pathname.startsWith("/validasi") && (!token || token.role === "VIEWER"))
    ) {
      return NextResponse.redirect(
        new URL(`/signin?callbackUrl=${pathname}`, req.url),
      );
    }

    if (
      (pathname.startsWith("/auth") && token) ||
      (pathname.startsWith("/admin") && token?.role !== "ADMIN") ||
      (pathname.startsWith("/admin/dataCategory") && token?.role !== "ADMIN") ||
      (pathname.startsWith("/admin/studentData") && token?.role !== "ADMIN")
    ) {
      return NextResponse.rewrite(new URL("/unauthorized", req.url), {
        status: 403,
      });
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: () => true,
    },
  },
);
