import { NextRequest, NextResponse } from "next/server";

const COOKIE_NAME = "dmh-token";

// Routes that require authentication
const protectedPaths = ["/home", "/activity", "/profile", "/deposit", "/services", "/cards"];

// Routes that should redirect TO /home if already logged in
const authPaths = ["/login", "/register"];

export function middleware(request: NextRequest) {
  const token = request.cookies.get(COOKIE_NAME)?.value;
  const { pathname } = request.nextUrl;

  // Check if the current path is protected
  const isProtected = protectedPaths.some(
    (path) => pathname === path || pathname.startsWith(`${path}/`)
  );

  // Check if the current path is an auth page (login/register)
  const isAuthPage = authPaths.some(
    (path) => pathname === path || pathname.startsWith(`${path}/`)
  );

  // No token + protected route → redirect to login
  if (isProtected && !token) {
    const loginUrl = new URL("/login", request.url);
    return NextResponse.redirect(loginUrl);
  }

  // Has token + trying to access auth pages → redirect to dashboard
  if (isAuthPage && token) {
    const homeUrl = new URL("/home", request.url);
    return NextResponse.redirect(homeUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    // Match all protected routes
    "/home/:path*",
    "/activity/:path*",
    "/profile/:path*",
    "/deposit/:path*",
    "/services/:path*",
    "/cards/:path*",
    // Match auth routes (to redirect if already logged in)
    "/login/:path*",
    "/register/:path*",
  ],
};
