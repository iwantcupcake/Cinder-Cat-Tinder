import { createServerClient } from '@/lib/supabaseClient';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  const supabase = createServerClient();
  const { data: { session } } = await supabase.auth.getSession();

  const { pathname } = request.nextUrl;

  // Protected routes
  const protectedRoutes = ['/app', '/profile', '/compatibility'];
  const isProtectedRoute = protectedRoutes.some(route => 
    pathname === route || pathname.startsWith(route + '/')
  );

  if (isProtectedRoute && !session) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/app/:path*', '/profile/:path*', '/compatibility/:path*'],
};
