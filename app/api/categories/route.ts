import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/auth.config';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';
import { slugify } from '@/lib/utils';

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const formData = await request.formData();
    const title = formData.get('title') as string;
    const description = formData.get('description') as string;
    const slug = slugify(title);
    const seoTitle = formData.get('seoTitle') as string;
    const seoDescription = formData.get('seoDescription') as string;
    const seoKeywords = formData.get('seoKeywords') as string;
    const thumbnail = formData.get('thumbnail') as string | null;
    const categoryId = formData.get('categoryId') as string | null;

    if (!title) {
      return NextResponse.json({ error: 'Title is required' }, { status: 400 });
    }

    // Check if slug already exists
    const existingCategory = await prisma.postCategory.findFirst({
      where: {
        slug,
        NOT: categoryId ? { id: categoryId } : undefined,
      },
    });

    if (existingCategory) {
      return NextResponse.json(
        { error: 'A category with this name already exists' },
        { status: 400 }
      );
    }

    try {
      if (categoryId) {
        // Create subcategory
        const subcategory = await prisma.postSubCategory.create({
          data: {
            title,
            slug,
            description: description || undefined,
            thumbnail,
            seoTitle: seoTitle || undefined,
            seoDescription: seoDescription || undefined,
            seoKeywords: seoKeywords || undefined,
            categoryId,
          },
        });

        return NextResponse.json(subcategory);
      } else {
        // Create category
        const category = await prisma.postCategory.create({
          data: {
            title,
            slug,
            description: description || undefined,
            thumbnail,
            seoTitle: seoTitle || undefined,
            seoDescription: seoDescription || undefined,
            seoKeywords: seoKeywords || undefined,
          },
        });

        return NextResponse.json(category);
      }
    } catch (error) {
      console.error('Database error:', error);
      return NextResponse.json(
        { error: 'Failed to create category in database. Please try again.' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('[CATEGORIES_POST]', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred. Please try again.' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const categories = await prisma.postCategory.findMany({
      include: {
        subcategories: true,
      },
    });

    return NextResponse.json(categories);
  } catch (error) {
    console.error('[CATEGORIES_GET]', error);
    return NextResponse.json(
      { error: 'Internal error' },
      { status: 500 }
    );
  }
} 