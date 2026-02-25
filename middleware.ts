import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const PUBLIC_PATHS = ["/", "/login"];
const AUTH_API_PREFIX = "/api/auth";
const NEXT_STATIC_PREFIX = "/_next";

function isPublicPath(pathname: string): boolean {
  if (pathname.startsWith(AUTH_API_PREFIX) || pathname.startsWith(NEXT_STATIC_PREFIX)) {
    return true;
  }
  if (pathname === "/favicon.ico" || pathname.startsWith("/_next/")) {
    return true;
  }
  return PUBLIC_PATHS.some((path) => pathname === path || pathname.startsWith(`${path}/`));
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (isPublicPath(pathname)) {
    return NextResponse.next();
  }

  const secret = process.env.NEXTAUTH_SECRET;
  if (!secret) {
    return NextResponse.next();
  }

  try {
    const token = await getToken({
      req: request,
      secret,
    });

    if (!token) {
      const signInUrl = new URL("/", request.url);
      signInUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(signInUrl);
    }
  } catch {
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)",
  ],
};
