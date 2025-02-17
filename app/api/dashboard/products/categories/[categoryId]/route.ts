import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/auth.config';
import { writeFile } from 'fs/promises';
import path from 'path';
import { Prisma } from '@prisma/client';

export async function GET(
  request: Request,
  { params }: { params: { categoryId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const category = await prisma.productCategory.findUnique({
      where: {
        id: params.categoryId,
      },
    });

    if (!category) {
      return NextResponse.json(
        { error: 'Category not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(category);
  } catch (error) {
    console.error('Error fetching category:', error);
    return NextResponse.json(
      { error: 'Failed to fetch category' },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: { categoryId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const formData = await request.formData();
    const title = formData.get('title') as string;
    const description = formData.get('description') as string;
    const slug = formData.get('slug') as string;
    const type = formData.get('type') as string;
    const seoTitle = formData.get('seoTitle') as string;
    const seoDescription = formData.get('seoDescription') as string;
    const seoKeywords = formData.get('seoKeywords') as string;
    const thumbnailFile = formData.get('thumbnail') as File | null;

    if (!title || !slug || !type) {
      return NextResponse.json(
        { error: 'Title, slug, and type are required' },
        { status: 400 }
      );
    }

    // Handle thumbnail upload
    let thumbnail = undefined;
    if (thumbnailFile) {
      // Create uploads directory if it doesn't exist
      const uploadsDir = path.join(process.cwd(), 'public/uploads');
      try {
        await writeFile(path.join(uploadsDir, 'test.txt'), '');
      } catch (error) {
        // Directory doesn't exist, create it
        const { mkdir } = require('fs/promises');
        await mkdir(uploadsDir, { recursive: true });
      }

      // Generate unique filename
      const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1E9)}`;
      const filename = `${slug}-${uniqueSuffix}${path.extname(thumbnailFile.name)}`;
      
      // Convert File to Buffer
      const bytes = await thumbnailFile.arrayBuffer();
      const buffer = Buffer.from(bytes);

      // Save the file
      const filepath = path.join(uploadsDir, filename);
      await writeFile(filepath, buffer);
      
      // Set the thumbnail URL
      thumbnail = `/uploads/${filename}`;
    }

    const categoryData: Prisma.ProductCategoryUpdateInput = {
      title,
      description: description || undefined,
      slug,
      type,
      ...(thumbnail && { thumbnail }),
      seoTitle: seoTitle || undefined,
      seoDescription: seoDescription || undefined,
      seoKeywords: seoKeywords || undefined,
    };

    const category = await prisma.productCategory.update({
      where: {
        id: params.categoryId,
      },
      data: categoryData,
    });

    return NextResponse.json(category);
  } catch (error) {
    console.error('Error updating category:', error);
    return NextResponse.json(
      { error: 'Failed to update category' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { categoryId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await prisma.productCategory.delete({
      where: {
        id: params.categoryId,
      },
    });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error('Error deleting category:', error);
    return NextResponse.json(
      { error: 'Failed to delete category' },
      { status: 500 }
    );
  }
} 