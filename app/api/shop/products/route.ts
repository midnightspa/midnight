import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const categorySlug = searchParams.get('category');
    const type = searchParams.get('type') as 'DIGITAL' | 'PHYSICAL' | null;
    const minPrice = searchParams.get('minPrice') ? Number(searchParams.get('minPrice')) : undefined;
    const maxPrice = searchParams.get('maxPrice') ? Number(searchParams.get('maxPrice')) : undefined;

    const products = await prisma.product.findMany({
      where: {
        published: true,
        ...(categorySlug && {
          category: {
            slug: categorySlug,
          },
        }),
        ...(type && { type }),
        ...(minPrice !== undefined && {
          OR: [
            { price: { gte: minPrice } },
            { salePrice: { gte: minPrice } },
          ],
        }),
        ...(maxPrice !== undefined && {
          OR: [
            { price: { lte: maxPrice } },
            { salePrice: { lte: maxPrice } },
          ],
        }),
      },
      include: {
        category: {
          select: {
            id: true,
            title: true,
            slug: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    );
  }
} 