import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/auth.config';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';
import { slugify } from '@/lib/utils';
import { revalidatePath } from 'next/cache';
import { Buffer } from 'node:buffer';

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

    const formData = await request.formData();
    const title = formData.get('title') as string;
    const description = formData.get('description') as string;
    const slug = formData.get('slug') as string || slugify(title);
    const seoTitle = formData.get('seoTitle') as string;
    const seoDescription = formData.get('seoDescription') as string;
    const seoKeywords = formData.get('seoKeywords') as string;
    const thumbnailFile = formData.get('thumbnail') as File;
    const categoryId = formData.get('categoryId') as string;

    if (!title) {
      return NextResponse.json({ error: 'Title is required' }, { status: 400 });
    }

    let thumbnail = undefined;
    if (thumbnailFile && thumbnailFile instanceof File) {
      // Create uploads directory if it doesn't exist
      const uploadDir = path.join(process.cwd(), 'public', 'uploads');
      try {
        await mkdir(uploadDir, { recursive: true });
      } catch (error) {
        // Directory might already exist, ignore error
      }

      // Create unique filename
      const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1E9)}`;
      const filename = `${slug}-${uniqueSuffix}${path.extname(thumbnailFile.name)}`;
      const filepath = path.join(uploadDir, filename);

      // Write the file
      const bytes = await thumbnailFile.arrayBuffer();
      const buffer = Buffer.from(bytes);
      await writeFile(filepath, buffer);

      // Set the thumbnail URL
      thumbnail = `/uploads/${filename}`;
    } else if (thumbnailFile && typeof thumbnailFile === 'string') {
      // If thumbnail is a string (URL), use it directly
      thumbnail = thumbnailFile;
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
            thumbnail: thumbnail || undefined,
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
            thumbnail: thumbnail || undefined,
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

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const categories = await prisma.postCategory.findMany({
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
    console.error('Error fetching categories:', error);
    return NextResponse.json(
      { error: 'Failed to fetch categories' },
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

    const formData = await request.formData();
    const title = formData.get('title') as string;
    const description = formData.get('description') as string;
    const slug = formData.get('slug') as string;
    const seoTitle = formData.get('seoTitle') as string;
    const seoDescription = formData.get('seoDescription') as string;
    const seoKeywords = formData.get('seoKeywords') as string;
    const thumbnailFile = formData.get('thumbnail') as File | string;

    let thumbnail = undefined;
    if (thumbnailFile) {
      if (thumbnailFile instanceof File) {
        // Create uploads directory if it doesn't exist
        const uploadDir = path.join(process.cwd(), 'public', 'uploads');
        try {
          await mkdir(uploadDir, { recursive: true });
        } catch (error) {
          // Directory might already exist, ignore error
        }

        // Create unique filename
        const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1E9)}`;
        const filename = `${slug}-${uniqueSuffix}${path.extname(thumbnailFile.name)}`;
        const filepath = path.join(uploadDir, filename);

        // Write the file
        const bytes = await thumbnailFile.arrayBuffer();
        const buffer = Buffer.from(bytes);
        await writeFile(filepath, buffer);

        // Set the thumbnail URL
        thumbnail = `/uploads/${filename}`;
      } else if (typeof thumbnailFile === 'string') {
        // If thumbnail is a string (URL), use it directly
        thumbnail = thumbnailFile;
      }
    }

    const data = {
      title,
      description: description || undefined,
      slug: slug || undefined,
      seoTitle: seoTitle || undefined,
      seoDescription: seoDescription || undefined,
      seoKeywords: seoKeywords || undefined,
      ...(thumbnail && { thumbnail }),
    };

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