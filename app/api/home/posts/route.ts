import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { headers } from 'next/headers';

// Add segment config to handle dynamic requests
export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';

export async function GET() {
  try {
    // Get request headers
    const headersList = headers();
    
    const posts = await prisma.post.findMany({
      where: {
        published: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: 6,
      select: {
        id: true,
        title: true,
        excerpt: true,
        thumbnail: true,
        createdAt: true,
        slug: true,
        tags: true,
        category: {
          select: {
            title: true,
            slug: true
          }
        },
        subcategory: {
          select: {
            title: true,
            slug: true
          }
        },
        author: {
          select: {
            name: true
          }
        }
      }
    });

    // Set cache control headers
    return new NextResponse(JSON.stringify(posts), {
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-store, must-revalidate'
      }
    });
  } catch (error) {
    console.error('Error fetching home page posts:', error);
    return new NextResponse(JSON.stringify({ error: 'Failed to fetch posts' }), { 
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-store, must-revalidate'
      }
    });
  }
} 