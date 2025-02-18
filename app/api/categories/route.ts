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

    let title: string;
    let description: string | null;
    let slug: string;
    let seoTitle: string | null;
    let seoDescription: string | null;
    let seoKeywords: string | null;
    let thumbnail: string | null;
    let categoryId: string | null;

    const contentType = request.headers.get('content-type');
    
    if (contentType?.includes('multipart/form-data')) {
      const formData = await request.formData();
      title = formData.get('title') as string;
      description = formData.get('description') as string;
      slug = formData.get('slug') as string || slugify(title);
      seoTitle = formData.get('seoTitle') as string;
      seoDescription = formData.get('seoDescription') as string;
      seoKeywords = formData.get('seoKeywords') as string;
      thumbnail = formData.get('thumbnail') as string;
      categoryId = formData.get('categoryId') as string;
    } else {
      const json = await request.json();
      title = json.title;
      description = json.description;
      slug = json.slug || slugify(title);
      seoTitle = json.seoTitle;
      seoDescription = json.seoDescription;
      seoKeywords = json.seoKeywords;
      thumbnail = json.thumbnail;
      categoryId = json.categoryId;
    }

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
        // Verify parent category exists
        const parentCategory = await prisma.postCategory.findUnique({
          where: { id: categoryId }
        });

        if (!parentCategory) {
          return NextResponse.json(
            { error: 'Parent category not found' },
            { status: 404 }
          );
        }

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