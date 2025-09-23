import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import db from "./lib/db";

export async function middleware(request: NextRequest) {
  const isThereAnyUser = (await db.user.count()) > 0;

  // If there is no user, allow access only to /onboarding, otherwise redirect to /onboarding
  if (!isThereAnyUser) {
    if (request.nextUrl.pathname !== "/onboarding") {
      return NextResponse.redirect(new URL("/onboarding", request.url));
    }
    // Allow access to /onboarding if no user exists
    return NextResponse.next();
  }

  // If there is at least one user, prevent access to /onboarding
  if (request.nextUrl.pathname === "/onboarding" && isThereAnyUser) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  runtime: "nodejs",
  matcher: ["/((?!api|trpc|_next/static|_next/image).*)"],
};
