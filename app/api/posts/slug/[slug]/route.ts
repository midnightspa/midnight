import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(
  request: Request,
  { params }: { params: { slug: string } }
) {
  try {
    const resolvedParams = await params;
    const slug = resolvedParams.slug;
    console.log('Fetching post with slug:', slug);
    const post = await prisma.post.findUnique({
      where: {
        slug,
      },
      select: {
        id: true,
        title: true,
        content: true,
        excerpt: true,
        thumbnail: true,
        createdAt: true,
        tags: true,
        slug: true,
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
      console.log('Post not found');
      return NextResponse.json(
        { error: 'Post not found' },
        { status: 404 }
      );
    }

    console.log('Found post:', post);
    return NextResponse.json(post);
  } catch (error) {
    console.error('Error fetching post:', error);
    return NextResponse.json(
      { error: 'Failed to fetch post' },
      { status: 500 }
    );
  }
} 