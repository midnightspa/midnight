import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q');

    if (!query) {
      return NextResponse.json([]);
    }

    const categories = await prisma.postCategory.findMany({
      where: {
        OR: [
          {
            title: {
              contains: query,
              mode: 'insensitive',
            },
          },
          {
            description: {
              contains: query,
              mode: 'insensitive',
            },
          },
        ],
      },
      include: {
        subcategories: {
          include: {
            _count: {
              select: {
                posts: true,
              },
            },
          },
        },
      },
      orderBy: {
        title: 'asc',
      },
    });

    return NextResponse.json(categories);
  } catch (error) {
    console.error('Search error:', error);
    return NextResponse.json(
      { error: 'Failed to search categories' },
      { status: 500 }
    );
  }
} 