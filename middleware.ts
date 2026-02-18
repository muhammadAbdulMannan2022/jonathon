import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const token = request.cookies.get('access_token')?.value
  const { pathname } = request.nextUrl

  console.log(`MIDDLEWARE - Path: ${pathname}, Token present: ${!!token}`)

  const isPublicPath = pathname.startsWith('/auth')

  if (!token && !isPublicPath) {
    console.log(`MIDDLEWARE - Redirecting unauthorized user from ${pathname} to /auth/login`)
    return NextResponse.redirect(new URL('/auth/login', request.url))
  }

  if (token && isPublicPath) {
    const isAuthFormPage = pathname === '/auth/login' || pathname === '/auth/forgot-password' || pathname === '/auth/verify-otp' || pathname === '/auth/set-new-password'
    if (isAuthFormPage) {
      return NextResponse.redirect(new URL('/', request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)',
  ],
}
