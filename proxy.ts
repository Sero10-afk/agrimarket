import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

const COOKIE_NAME = "agrimarket_session";
const secretString =
  process.env.SESSION_SECRET ?? "dev-only-secret-change-in-production";
const secretKey = new TextEncoder().encode(secretString);

const PROTECTED_PATHS = ["/tableau-de-bord", "/deposer-annonce"];

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isProtected = PROTECTED_PATHS.some(
    (p) => pathname === p || pathname.startsWith(`${p}/`)
  );
  if (!isProtected) {
    return NextResponse.next();
  }

  const token = request.cookies.get(COOKIE_NAME)?.value;
  if (!token) {
    const loginUrl = new URL("/connexion", request.url);
    return NextResponse.redirect(loginUrl);
  }

  try {
    await jwtVerify(token, secretKey);
    return NextResponse.next();
  } catch {
    const loginUrl = new URL("/connexion", request.url);
    return NextResponse.redirect(loginUrl);
  }
}

export const config = {
  matcher: ["/tableau-de-bord/:path*", "/deposer-annonce/:path*"],
};
