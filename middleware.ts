import { NextRequest, NextResponse } from "next/server";
import db from "./lib/db";
import { auth } from "./lib/auth";
import { headers } from "next/headers";
import { routeData } from "./constants/sidebar-item-data";

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

  if (!session && request.nextUrl.pathname !== "/login") {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // If user is logged in, prevent access to /login
  if (session && request.nextUrl.pathname === "/login") {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // Role-based route protection using sidebar data
  if (session) {
    const userRole = session.user?.role;
    const pathname = request.nextUrl.pathname;

    // Helper to flatten all routes from sidebar data
    function getAllRoutes() {
      const routes = [];
      for (const nav of [routeData.navMain, routeData.navSecondary]) {
        for (const item of nav) {
          routes.push({ url: item.url, role: item.role });
          if (item.items) {
            for (const sub of item.items) {
              routes.push({ url: sub.url, role: sub.role });
            }
          }
        }
      }
      return routes;
    }

    const allRoutes = getAllRoutes();
    // Find route config for current path
    const routeConfig = allRoutes.find(r => r.url === pathname);
    if (routeConfig && routeConfig.role && !routeConfig.role.includes(userRole!)) {
      // If user role is not allowed, redirect to home
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  runtime: "nodejs",
  matcher: ["/((?!api|trpc|_next/static|_next/image).*)"],
};
