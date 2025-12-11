import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { defaultLocale } from './i18n/config';

// Define public routes that don't require authentication
const publicRoutes = ['/login', '/register'];

// Define routes that should redirect to dashboard if already authenticated
const authRoutes = ['/login', '/register'];

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Get locale from cookie for next-intl
  const locale = request.cookies.get('NEXT_LOCALE')?.value || defaultLocale;

  // Check if the route is public (exact match or starts with for nested routes)
  const isPublicRoute = publicRoutes.includes(pathname);
  const isAuthRoute = authRoutes.includes(pathname);

  // Get the refresh token from cookies
  const hasRefreshToken = request.cookies.has('refreshToken');

  // Create response
  let response: NextResponse;

  // If on home page and authenticated, redirect to workspaces
  if (pathname === '/' && hasRefreshToken) {
    response = NextResponse.redirect(new URL('/workspaces', request.url));
  }
  // If trying to access auth routes (login/register) while authenticated, redirect to workspaces
  else if (isAuthRoute && hasRefreshToken) {
    response = NextResponse.redirect(new URL('/workspaces', request.url));
  }
  // If trying to access protected route without authentication, redirect to login
  else if (!isPublicRoute && pathname !== '/' && !hasRefreshToken) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('from', pathname);
    response = NextResponse.redirect(loginUrl);
  } else {
    response = NextResponse.next();
  }

  // Set locale header for next-intl
  response.headers.set('x-next-intl-locale', locale);

  return response;
}

// Configure which routes the middleware should run on
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
