import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import type { NextRequest } from 'next/server';
import { rateLimit } from './app/api/config/rate-limit';

// List of public API endpoints that should remain accessible
const PUBLIC_API_ROUTES = [
  '/api/categories',
  '/api/posts',
  '/api/subcategories',
  '/api/auth/[...nextauth]',
  '/api/v1/categories',
  '/api/v1/subcategories',
  '/api/v1/posts'
];

// List of protected API endpoints that require authentication
const PROTECTED_API_ROUTES = [
  '/api/posts/[id]',
  '/api/upload',
  '/api/user',
  '/api/dashboard',
  '/api/seo',
  '/api/newsletter'
];

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  // Apply rate limiting to all API routes
  if (path.startsWith('/api/')) {
    const isAllowed = await rateLimit(request);
    if (!isAllowed) {
      return new NextResponse(
        JSON.stringify({ error: 'Too many requests' }),
        {
          status: 429,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }
  }

  // Check if the path is a protected API route
  const isProtectedApiRoute = PROTECTED_API_ROUTES.some(route => 
    path.startsWith(route) || path === route
  );

  // If it's not a protected route, allow the request
  if (!isProtectedApiRoute) {
    return NextResponse.next();
  }

  // For protected routes, verify authentication
  const token = await getToken({ req: request as any });
  
  if (!token) {
    return new NextResponse(
      JSON.stringify({ error: 'Authentication required' }),
      {
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/api/:path*',
    '/dashboard/:path*'
  ]
}; 