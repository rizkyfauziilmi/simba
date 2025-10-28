import { NextRequest, NextResponse } from 'next/server'
import db from './lib/db'
import { auth } from './lib/auth'
import { headers } from 'next/headers'
import { routeData } from './constants/sidebar-item-data'

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname
  const isThereAnyUser = (await db.user.count()) > 0

  // === ONBOARDING ACCESS CONTROL ===
  if (!isThereAnyUser) {
    if (pathname !== '/onboarding') {
      return NextResponse.redirect(new URL('/onboarding', request.url))
    }
    return NextResponse.next() // allow access to /onboarding
  }

  if (isThereAnyUser && pathname === '/onboarding') {
    return NextResponse.redirect(new URL('/', request.url))
  }

  // === AUTH SESSION CHECK ===
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  if (!session && pathname !== '/login') {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  if (session && pathname === '/login') {
    return NextResponse.redirect(new URL('/', request.url))
  }

  // === ROLE-BASED ROUTE PROTECTION ===
  if (session) {
    const userRole = session.user?.role

    // Helper to flatten all routes from sidebar data
    function getAllRoutes() {
      const routes = []
      for (const nav of [routeData.navMain, routeData.navSecondary]) {
        for (const item of nav) {
          routes.push({ url: item.url, role: item.role })
          if (item.items) {
            for (const sub of item.items) {
              routes.push({ url: sub.url, role: sub.role })
            }
          }
        }
      }
      return routes
    }

    const allRoutes = getAllRoutes()

    // Cari route yang cocok berdasarkan prefix terpanjang
    const routeConfig = allRoutes
      .filter(r => pathname.startsWith(r.url))
      .sort((a, b) => b.url.length - a.url.length)[0]

    if (routeConfig && routeConfig.role && !routeConfig.role.includes(userRole!)) {
      // Jika role tidak diizinkan, redirect ke halaman utama
      return NextResponse.redirect(new URL('/', request.url))
    }
  }

  // === ALLOW ACCESS ===
  return NextResponse.next()
}

export const config = {
  runtime: 'nodejs',
  matcher: ['/((?!api|trpc|_next/static|_next/image).*)'], // hanya middleware di-ran pada route frontend
}
