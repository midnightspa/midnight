import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import type { NextRequest } from 'next/server';
import fixPermissions from '@/scripts/fix-permissions';

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  // Only protect dashboard routes
  if (path.startsWith('/dashboard')) {
    const token = await getToken({ req: request as any });
    if (!token) {
      return NextResponse.redirect(new URL('/auth/signin', request.url));
    }
  }

  // Only run this middleware for requests to /uploads
  if (path.startsWith('/uploads/')) {
    try {
      // Fix permissions before serving the file
      await fixPermissions();
    } catch (error) {
      console.error('Error fixing permissions:', error);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/uploads/:path*'
  ]
}; 