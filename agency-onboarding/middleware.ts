import { NextRequest, NextResponse } from 'next/server'
import { jwtVerify } from 'jose'

const SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'digitalkronosagency-secret-key-change-in-production'
)

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  // Protect admin routes (except login)
  if (pathname.startsWith('/admin') && pathname !== '/admin/login') {
    const token = req.cookies.get('admin_session')?.value
    if (!token) {
      return NextResponse.redirect(new URL('/admin/login', req.url))
    }
    try {
      const { payload } = await jwtVerify(token, SECRET)
      if (payload.role !== 'admin') throw new Error('Not admin')
    } catch {
      return NextResponse.redirect(new URL('/admin/login', req.url))
    }
  }

  // Client routes are handled at the page level (token-based)
  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*'],
}
