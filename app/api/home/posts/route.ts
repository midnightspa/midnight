import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
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

    return NextResponse.json(posts);
  } catch (error) {
    console.error('Error fetching home page posts:', error);
    return NextResponse.json({ error: 'Failed to fetch posts' }, { status: 500 });
  }
} 