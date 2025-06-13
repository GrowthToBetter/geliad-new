import NextAuth from "next-auth";
import { authConfig } from "./lib/config/auth.cofig";
import { NextResponse } from "next/server";

const { auth } = NextAuth(authConfig);
export default auth(async function middleware(req) {
  const isLoggedIn = !!req.auth;
  const isOnAuthPage = req.nextUrl.pathname.startsWith("/auth");
  const isOnAdminPage = req.nextUrl.pathname.startsWith("/admin");

  if (!isLoggedIn && !isOnAuthPage) {
    return NextResponse.redirect(new URL("/auth/signin", req.nextUrl));
  }

  if (isLoggedIn && isOnAuthPage) {
    return NextResponse.redirect(
      new URL(
        !["ADMIN", "SUPERADMIN"].includes(req.auth?.user?.role)
          ? "/"
          : "/admin",
        req.nextUrl
      )
    );
  }

  if (
    isOnAdminPage &&
    !["ADMIN", "SUPERADMIN"].includes(req.auth?.user?.role)
  ) {
    return NextResponse.redirect(new URL("/", req.nextUrl));
  }
});

export const config = {
  matcher: ["/admin/:path*", "/auth/signin"],
};
