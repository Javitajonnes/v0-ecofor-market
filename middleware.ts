import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { jwtVerify } from 'jose'

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'ecofor-market-secret-key-change-in-production'
)

export async function middleware(request: NextRequest) {
  const token = request.cookies.get('auth-token')
  const { pathname } = request.nextUrl

  // Public routes that don't require authentication
  const publicRoutes = ['/login', '/registro', '/']
  const isPublicRoute = publicRoutes.some(route => pathname.startsWith(route))

  // Admin routes
  const isAdminRoute = pathname.startsWith('/admin')

  // If no token and trying to access protected route
  if (!token && !isPublicRoute) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // Verify token for protected routes
  if (token && !isPublicRoute) {
    try {
      const { payload } = await jwtVerify(token.value, JWT_SECRET)
      
      // Check admin access
      if (isAdminRoute && payload.role !== 'admin') {
        return NextResponse.redirect(new URL('/', request.url))
      }
    } catch (error) {
      // Invalid token, redirect to login
      return NextResponse.redirect(new URL('/login', request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/admin/:path*',
    '/perfil/:path*',
    '/pedidos/:path*'
  ]
}
