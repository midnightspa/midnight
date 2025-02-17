import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/auth.config';
import { writeFile } from 'fs/promises';
import path from 'path';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const post = await prisma.post.findUnique({
      where: {
        id: params.id,
      },
      select: {
        id: true,
        title: true,
        content: true,
        excerpt: true,
        thumbnail: true,
        createdAt: true,
        tags: true,
        category: {
          select: {
            id: true,
            title: true,
            slug: true,
          },
        },
        subcategory: {
          select: {
            id: true,
            title: true,
            slug: true,
          },
        },
      },
    });

    if (!post) {
      return NextResponse.json(
        { error: 'Post not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(post);
  } catch (error) {
    console.error('Error fetching post:', error);
    return NextResponse.json(
      { error: 'Failed to fetch post' },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const formData = await request.formData();
    const title = formData.get('title') as string;
    const content = formData.get('content') as string;
    const categoryId = formData.get('categoryId') as string;
    const excerpt = formData.get('excerpt') as string;
    const subcategoryId = formData.get('subcategoryId') as string;
    const tags = JSON.parse(formData.get('tags') as string || '[]');
    const seoTitle = formData.get('seoTitle') as string;
    const seoDescription = formData.get('seoDescription') as string;
    const seoKeywords = formData.get('seoKeywords') as string;
    const published = formData.get('published') === 'true';
    const thumbnailFile = formData.get('thumbnail') as File | null;

    if (!title || !content || !categoryId) {
      return NextResponse.json(
        { error: 'Title, content, and category are required' },
        { status: 400 }
      );
    }

    // Create slug from title
    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-');

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

    const post = await prisma.post.update({
      where: {
        id: params.id,
      },
      data: {
        title,
        slug,
        excerpt,
        content,
        categoryId,
        subcategoryId: subcategoryId || undefined,
        tags,
        seoTitle,
        seoDescription,
        seoKeywords,
        published,
        ...(thumbnail && { thumbnail }),
      },
    });

    return NextResponse.json(post);
  } catch (error) {
    console.error('Error updating post:', error);
    return NextResponse.json(
      { error: 'Failed to update post' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await prisma.post.delete({
      where: {
        id: params.id,
      },
    });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error('Error deleting post:', error);
    return NextResponse.json(
      { error: 'Failed to delete post' },
      { status: 500 }
    );
  }
} 