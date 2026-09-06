import { NextResponse, type NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Only run middleware on /admin routes
  if (pathname.startsWith('/admin')) {
    // Allow access to login page
    if (pathname === '/admin/login') {
      return NextResponse.next()
    }

    // Check for admin session cookie or Supabase auth token
    const adminSession = request.cookies.get('admin_session')
    const hasSupabaseCookie = request.cookies
      .getAll()
      .some((cookie) => cookie.name.includes('-auth-token'))

    if (!adminSession && !hasSupabaseCookie) {
      const loginUrl = new URL('/admin/login', request.url)
      return NextResponse.redirect(loginUrl)
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*'],
}
