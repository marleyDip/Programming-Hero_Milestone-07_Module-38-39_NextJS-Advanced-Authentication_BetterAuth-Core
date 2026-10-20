import { getSessionCookie } from "better-auth/cookies";
import { NextResponse } from "next/server";

const protectedRoutes = ["/profile", "/dashboard"];

export function proxy(request) {
  const { pathname } = request.nextUrl;
  const sessionCookie = getSessionCookie(request);

  const isProtected = protectedRoutes.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`),
  );

  // Optimistic check: only looks for the cookie, it doesn't validate it
  if (isProtected && !sessionCookie) {
    return NextResponse.redirect(new URL("/sign-in", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/profile/:path*", "/dashboard/:path*"],
};
