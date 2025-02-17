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
    const slug = formData.get('slug') as string;
    const seoTitle = formData.get('seoTitle') as string;
    const seoDescription = formData.get('seoDescription') as string;
    const seoKeywords = formData.get('seoKeywords') as string;
    const thumbnailFile = formData.get('thumbnail') as File | null;
    const categoryId = formData.get('categoryId') as string | null;

    if (!title || !slug) {
      return NextResponse.json({ error: 'Title and slug are required' }, { status: 400 });
    }

    // Handle thumbnail upload
    let thumbnail = null;
    if (thumbnailFile && thumbnailFile instanceof File) {
      try {
        // Create uploads directory if it doesn't exist
        const uploadsDir = path.join(process.cwd(), 'public/uploads');
        try {
          await mkdir(uploadsDir, { recursive: true });
        } catch (error) {
          // Directory might already exist, ignore error
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
      } catch (error) {
        console.error('Error uploading thumbnail:', error);
        return NextResponse.json({ error: 'Failed to upload thumbnail' }, { status: 500 });
      }
    }

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
    console.error('[CATEGORIES_POST]', error);
    return NextResponse.json(
      { error: 'Internal error' },
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