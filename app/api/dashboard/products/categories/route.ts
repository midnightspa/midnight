import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/auth.config';
import { writeFile } from 'fs/promises';
import path from 'path';
import { Prisma } from '@prisma/client';

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const categories = await prisma.productCategory.findMany({
      orderBy: {
        createdAt: 'desc',
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

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const formData = await req.formData();
    const title = formData.get('title') as string;
    const description = formData.get('description') as string;
    let slug = formData.get('slug') as string;
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

    // Check if slug exists and generate a unique one if needed
    let slugExists = true;
    let slugCounter = 0;
    let finalSlug = slug;

    while (slugExists) {
      const existingCategory = await prisma.productCategory.findUnique({
        where: { slug: finalSlug },
      });

      if (!existingCategory) {
        slugExists = false;
      } else {
        slugCounter++;
        finalSlug = `${slug}-${slugCounter}`;
      }
    }

    // Handle thumbnail upload
    let thumbnail = null;
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
      const filename = `${finalSlug}-${uniqueSuffix}${path.extname(thumbnailFile.name)}`;
      
      // Convert File to Buffer
      const bytes = await thumbnailFile.arrayBuffer();
      const buffer = Buffer.from(bytes);

      // Save the file
      const filepath = path.join(uploadsDir, filename);
      await writeFile(filepath, buffer);
      
      // Set the thumbnail URL
      thumbnail = `/uploads/${filename}`;
    }

    const categoryData: Prisma.ProductCategoryCreateInput = {
      title,
      description: description || undefined,
      slug: finalSlug,
      type,
      thumbnail: thumbnail || undefined,
      seoTitle: seoTitle || undefined,
      seoDescription: seoDescription || undefined,
      seoKeywords: seoKeywords || undefined,
    };

    const category = await prisma.productCategory.create({
      data: categoryData,
    });

    return NextResponse.json(category, { status: 201 });
  } catch (error) {
    console.error('Error creating category:', error);
    return NextResponse.json(
      { error: 'Failed to create category' },
      { status: 500 }
    );
  }
} 