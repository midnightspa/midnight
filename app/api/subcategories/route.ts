import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/auth.config';

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const body = await request.json();

    const {
      title,
      description,
      categoryId,
      parentCategoryId,
      seoTitle,
      seoDescription,
      seoKeywords,
    } = body;

    if (!title) {
      return new NextResponse('Title is required', { status: 400 });
    }

    if (!categoryId) {
      return new NextResponse('Category ID is required', { status: 400 });
    }

    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-');

    const subcategory = await prisma.postSubCategory.create({
      data: {
        title,
        description,
        slug,
        categoryId,
        parentCategoryId,
        seoTitle,
        seoDescription,
        seoKeywords,
      },
    });

    return NextResponse.json(subcategory);
  } catch (error) {
    console.error('[SUBCATEGORIES_POST]', error);
    return new NextResponse('Internal error', { status: 500 });
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const categoryId = searchParams.get('categoryId');

    const subcategories = await prisma.postSubCategory.findMany({
      where: {
        ...(categoryId ? { categoryId } : {}),
      },
      select: {
        id: true,
        title: true,
        slug: true,
        thumbnail: true,
        categoryId: true,
        category: {
          select: {
            id: true,
            title: true,
            slug: true
          }
        },
        _count: {
          select: {
            posts: true
          }
        }
      }
    });

    return NextResponse.json(subcategories);
  } catch (error) {
    console.error('[SUBCATEGORIES_GET]', error);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
} 