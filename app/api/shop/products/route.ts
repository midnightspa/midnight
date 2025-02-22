import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const categorySlug = searchParams.get('category');
    const type = searchParams.get('type') as 'DIGITAL' | 'PHYSICAL' | null;
    const minPrice = searchParams.get('minPrice') ? Number(searchParams.get('minPrice')) : undefined;
    const maxPrice = searchParams.get('maxPrice') ? Number(searchParams.get('maxPrice')) : undefined;

    console.log('Shop API - Fetching products with params:', {
      categorySlug,
      type,
      minPrice,
      maxPrice
    });

    // First, let's count all published products
    const totalProducts = await prisma.product.count({
      where: { published: true }
    });
    console.log('Total published products in database:', totalProducts);

    const where = {
      published: true, // Only show published products
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
    };

    console.log('Shop API - Query where clause:', JSON.stringify(where, null, 2));

    const products = await prisma.product.findMany({
      where,
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

    console.log(`Shop API - Found ${products.length} published products after filtering`);
    console.log('Filtered products:', products.map(p => ({ id: p.id, title: p.title, published: p.published })));

    return NextResponse.json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    );
  }
} 