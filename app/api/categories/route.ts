import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/auth.config';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';
import { slugify } from '@/lib/utils';
import { revalidatePath } from 'next/cache';

// Function to revalidate all category-related paths
const revalidateCategories = () => {
  revalidatePath('/');
  revalidatePath('/dashboard/categories');
  revalidatePath('/[category]', 'layout');
  revalidatePath('/dashboard/categories/[id]', 'layout');
};

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

        // Revalidate all paths that might show categories
        revalidateCategories();

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

        // Revalidate all paths that might show categories
        revalidateCategories();

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

    // Set cache control headers
    return NextResponse.json(
      categories,
      {
        headers: {
          'Cache-Control': 'no-store',
          'Surrogate-Control': 'no-store',
        },
      }
    );
  } catch (error) {
    console.error('[CATEGORIES_GET]', error);
    return NextResponse.json(
      { error: 'Internal error' },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 });
    }

    const contentType = request.headers.get('content-type');
    let data;
    
    if (contentType?.includes('multipart/form-data')) {
      const formData = await request.formData();
      data = {
        title: formData.get('title') as string,
        description: formData.get('description') as string || undefined,
        slug: formData.get('slug') as string || undefined,
        seoTitle: formData.get('seoTitle') as string || undefined,
        seoDescription: formData.get('seoDescription') as string || undefined,
        seoKeywords: formData.get('seoKeywords') as string || undefined,
        thumbnail: formData.get('thumbnail') as string || undefined,
      };
    } else {
      data = await request.json();
    }

    // Check if it's a subcategory
    const subcategory = await prisma.postSubCategory.findUnique({
      where: { id }
    });

    if (subcategory) {
      const updatedSubcategory = await prisma.postSubCategory.update({
        where: { id },
        data
      });
      revalidateCategories();
      return NextResponse.json(updatedSubcategory);
    }

    // If not a subcategory, update the category
    const updatedCategory = await prisma.postCategory.update({
      where: { id },
      data
    });

    revalidateCategories();
    return NextResponse.json(updatedCategory);
  } catch (error) {
    console.error('[CATEGORIES_PUT]', error);
    return NextResponse.json({ error: 'Error updating category' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 });
    }

    // Check if it's a subcategory
    const subcategory = await prisma.postSubCategory.findUnique({
      where: { id }
    });

    if (subcategory) {
      await prisma.postSubCategory.delete({
        where: { id }
      });
    } else {
      // If not a subcategory, delete the category
      await prisma.postCategory.delete({
        where: { id }
      });
    }

    revalidateCategories();
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[CATEGORIES_DELETE]', error);
    return NextResponse.json({ error: 'Error deleting category' }, { status: 500 });
  }
} 