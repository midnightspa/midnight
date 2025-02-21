import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import type { NextRequest } from 'next/server';

// This middleware only handles authentication for dashboard routes
export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  // Don't protect auth routes
  if (path.startsWith('/auth/')) {
    return NextResponse.next();
  }

  // Only protect dashboard routes
  if (path.startsWith('/dashboard')) {
    const token = await getToken({ 
      req: request as any,
      secret: process.env.NEXTAUTH_SECRET 
    });
    
    if (!token) {
      const signInUrl = new URL('/auth/signin', request.url);
      signInUrl.searchParams.set('callbackUrl', request.url);
      return NextResponse.redirect(signInUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/auth/:path*']
}; 