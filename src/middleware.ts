import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const sessionToken = request.cookies.get('better-auth.session_token')
  const isAuthenticated = !!sessionToken?.value

  // Debug logging
  console.log('Middleware path:', pathname)
  console.log('Session token exists:', isAuthenticated)

  // Skip middleware for API routes and static files
  if (
    pathname.startsWith('/api/') ||
    pathname.startsWith('/_next/') ||
    pathname.includes('favicon.ico')
  ) {
    return NextResponse.next()
  }

  const isAuthPage = pathname.startsWith('/auth/')

  if (isAuthPage) {
    if (isAuthenticated) {
      console.log('Authenticated user in auth page, redirecting to dashboard')
      return NextResponse.redirect(new URL('/dashboard', request.url))
    }
    return NextResponse.next()
  }

  if (!isAuthPage && pathname !== '/') {
    if (!isAuthenticated) {
      console.log('Unauthenticated user, redirecting to login')
      return NextResponse.redirect(new URL('/auth/login', request.url))
    }
    return NextResponse.next()
  }

  if (pathname === '/') {
    if (isAuthenticated) {
      return NextResponse.redirect(new URL('/dashboard', request.url))
    }
    return NextResponse.redirect(new URL('/auth/login', request.url))
  }

  return NextResponse.next()
}

// Configure which paths the middleware will run on
export const config = {
  matcher: [
    // Match all paths except static files and images
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
}
