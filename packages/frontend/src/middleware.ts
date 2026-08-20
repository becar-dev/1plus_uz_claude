import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * Server-side middleware to protect /admin routes.
 * Checks for auth token in cookies or Authorization header.
 * Redirects unauthenticated users to /admin/login.
 */
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip the login page itself
  if (pathname === '/admin/login') {
    return NextResponse.next();
  }

  // Check for auth token in cookie or localStorage-bridged header
  const token =
    request.cookies.get('1plus_admin_token')?.value ||
    request.headers.get('x-auth-token');

  // Also allow the request to proceed if it appears to be a client-side navigation
  // (has the Next.js internal headers indicating RSC fetch)
  const isClientNavigation = request.headers.get('next-router-state-tree');

  if (!token && !isClientNavigation) {
    // Redirect to login for direct page access without token
    const loginUrl = new URL('/admin/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path((?!login).*)'],
};
