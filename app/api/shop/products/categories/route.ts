import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const categories = await prisma.productCategory.findMany({
      select: {
        id: true,
        title: true,
        slug: true,
        _count: {
          select: {
            products: {
              where: {
                published: true
              }
            }
          }
        }
      },
      orderBy: {
        title: 'asc',
      },
    });

    return NextResponse.json(categories);
  } catch (error) {
    console.error('Error fetching categories:', error);
    return NextResponse.json(
      { error: 'Failed to fetch categories' },
      { status: 500 }
    );
  }
} 