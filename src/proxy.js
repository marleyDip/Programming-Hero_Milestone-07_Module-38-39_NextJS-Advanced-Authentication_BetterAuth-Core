import { getSessionCookie } from "better-auth/cookies";
import { NextResponse } from "next/server";

const protectedRoutes = ["/profile", "/dashboard"];

export function proxy(request) {
  // const { pathname } = request.nextUrl;

  const { pathname, search } = request.nextUrl;
  const sessionCookie = getSessionCookie(request);

  const isProtected = protectedRoutes.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`),
  );

  // Optimistic check: only looks for the cookie, it doesn't validate it
  /* if (isProtected && !sessionCookie) {
    return NextResponse.redirect(new URL("/sign-in", request.url));
  } */

  if (isProtected && !sessionCookie) {
    const signInUrl = new URL("/sign-in", request.url);

    signInUrl.searchParams.set("reason", "login-required");
    signInUrl.searchParams.set("callbackURL", pathname + search);

    return NextResponse.redirect(signInUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/profile/:path*", "/dashboard/:path*"],
};
