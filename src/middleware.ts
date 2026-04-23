import { NextRequest, NextResponse } from "next/server";

const COOKIE_NAME = "dmh-token";

const protectedPaths = ["/home", "/activity", "/profile", "/deposit", "/services", "/cards"];

const authPaths = ["/login", "/register"];

export function middleware(request: NextRequest) {
  const token = request.cookies.get(COOKIE_NAME)?.value;
  const { pathname } = request.nextUrl;

  const isProtected = protectedPaths.some(
    (path) => pathname === path || pathname.startsWith(`${path}/`)
  );

  const isAuthPage = authPaths.some(
    (path) => pathname === path || pathname.startsWith(`${path}/`)
  );

  if (isProtected && !token) {
    const loginUrl = new URL("/login", request.url);
    return NextResponse.redirect(loginUrl);
  }

  if (isAuthPage && token) {
    const homeUrl = new URL("/home", request.url);
    return NextResponse.redirect(homeUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    
    "/home/:path*",
    "/activity/:path*",
    "/profile/:path*",
    "/deposit/:path*",
    "/services/:path*",
    "/cards/:path*",
    
    "/login/:path*",
    "/register/:path*",
  ],
};
