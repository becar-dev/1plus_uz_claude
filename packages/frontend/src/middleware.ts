import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * Server-side middleware to protect /admin routes.
 * Checks for auth token in the `1plus-admin-token` cookie.
 * Redirects unauthenticated users to /admin/login.
 */
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip the login page itself
  if (pathname === '/admin/login') {
    return NextResponse.next();
  }

  // Always check the cookie for the auth token - never skip based on headers
  const token = request.cookies.get('1plus-admin-token')?.value;

  if (!token) {
    // Redirect to login for any request without a valid token cookie
    const loginUrl = new URL('/admin/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path((?!login).*)'],
};
