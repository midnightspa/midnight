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

  // Get the response
  const response = NextResponse.next();

  // Enable compression for API responses
  if (path.startsWith('/api/')) {
    response.headers.set('Content-Encoding', 'br, gzip, deflate');
    response.headers.set('Accept-Encoding', 'br, gzip, deflate');
  }

  // Add aggressive caching for static assets
  const isStaticAsset = /\.(js|css|svg|jpg|jpeg|png|gif|ico|woff|woff2)$/i.test(path);
  if (isStaticAsset) {
    response.headers.set('Cache-Control', 'public, max-age=31536000, immutable');
    response.headers.set('Content-Encoding', 'br, gzip, deflate');
  }

  // Add caching for API responses
  if (path.startsWith('/api/')) {
    response.headers.set('Cache-Control', 'public, max-age=60, stale-while-revalidate=300');
  }

  // Add security headers
  response.headers.set('X-DNS-Prefetch-Control', 'on');
  response.headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  response.headers.set('X-Frame-Options', 'SAMEORIGIN');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-XSS-Protection', '1; mode=block');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
}; 