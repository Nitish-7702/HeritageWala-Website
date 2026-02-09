import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { verifyAuth } from './lib/auth'

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Check if the path is an admin path
  if (pathname.startsWith('/admin')) {
    // Exclude the login page from protection
    if (pathname === '/admin/login') {
      const token = request.cookies.get('admin-token')?.value
      if (token) {
        try {
          const verified = await verifyAuth(token)
          if (verified) {
            // Already logged in, redirect to dashboard
            return NextResponse.redirect(new URL('/admin', request.url))
          }
        } catch (error) {
          // Token invalid, allow access to login page
        }
      }
      return NextResponse.next()
    }

    // Protect all other admin routes
    const token = request.cookies.get('admin-token')?.value

    if (!token) {
      return NextResponse.redirect(new URL('/admin/login', request.url))
    }

    try {
      const verified = await verifyAuth(token)
      if (!verified) {
        return NextResponse.redirect(new URL('/admin/login', request.url))
      }
    } catch (error) {
      return NextResponse.redirect(new URL('/admin/login', request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*'],
}
