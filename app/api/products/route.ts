import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/auth.config';
import prisma from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const data = await request.json();
    
    // Validate required fields
    if (!data.title || !data.description || !data.price || !data.categoryId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Create slug from title
    const slug = data.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    // Check if slug exists
    const existingProduct = await prisma.product.findUnique({
      where: { slug },
    });

    if (existingProduct) {
      return NextResponse.json(
        { error: 'A product with this name already exists' },
        { status: 400 }
      );
    }

    // Create the product
    const product = await prisma.product.create({
      data: {
        title: data.title,
        description: data.description,
        price: parseFloat(data.price),
        salePrice: data.salePrice ? parseFloat(data.salePrice) : null,
        type: data.type || 'DIGITAL',
        slug,
        thumbnail: data.thumbnail || null,
        gallery: data.gallery || [],
        digitalAssets: data.digitalAssets || [],
        stock: data.stock || null,
        published: data.published || false,
        featured: data.featured || false,
        categoryId: data.categoryId,
        authorId: session.user?.id as string,
      },
    });

    return NextResponse.json(product);
  } catch (error) {
    console.error('Product creation error:', error);
    return NextResponse.json(
      { error: 'Failed to create product' },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const categoryId = searchParams.get('category');
    const featured = searchParams.get('featured');
    const published = searchParams.get('published');

    const where = {
      ...(categoryId && { categoryId }),
      ...(featured === 'true' && { featured: true }),
      ...(published === 'true' && { published: true }),
    };

    const products = await prisma.product.findMany({
      where,
      include: {
        category: {
          select: {
            title: true,
            slug: true,
          },
        },
        author: {
          select: {
            name: true,
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