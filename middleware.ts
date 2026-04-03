import { NextResponse, type NextRequest } from 'next/server';
import { updateSession } from '@/lib/supabase/middleware';

// Routes that never require authentication
const PUBLIC_ROUTES = [
  '/',
  '/auth/login',
  '/auth/signup',
  '/auth/forgot-password',
  '/auth/reset-password',
];

export async function middleware(request: NextRequest) {
  const { response, user } = await updateSession(request);
  const { pathname } = request.nextUrl;

  const isPublic = PUBLIC_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(route + '/')
  );

  // Protect /dashboard, /onboarding, and /api/intake routes
  if (!isPublic) {
    if (
      pathname.startsWith('/dashboard') ||
      pathname.startsWith('/onboarding') ||
      pathname.startsWith('/api/intake')
    ) {
      if (!user) {
        const loginUrl = new URL('/auth/login', request.url);
        loginUrl.searchParams.set('next', pathname);
        return NextResponse.redirect(loginUrl);
      }
    }
  }

  // Redirect authenticated users away from auth pages to dashboard
  if (pathname.startsWith('/auth/')) {
    if (user) {
      return NextResponse.redirect(new URL('/dashboard/intake/new', request.url));
    }
  }

  return response;
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
