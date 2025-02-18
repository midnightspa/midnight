import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/auth.config';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';
import { submitUrlToIndex } from '@/lib/google-indexing';

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    // Debug session data
    console.log('Session data:', {
      user: session.user,
      id: session.user.id
    });

    // Validate user exists
    const user = await prisma.user.findUnique({
      where: { id: session.user.id }
    });

    if (!user) {
      return NextResponse.json({
        success: false,
        error: 'User not found',
        details: 'The authenticated user does not exist in the database'
      }, { status: 404 });
    }

    const data = await req.json();
    console.log('Data received:', data);
    
    // Extract and validate required fields
    const { title, content, categoryId } = data;

    if (!title || !content || !categoryId) {
      return NextResponse.json({
        success: false,
        error: 'Missing required fields',
        details: [
          !title && 'Title is required',
          !content && 'Content is required',
          !categoryId && 'Category is required',
        ].filter(Boolean).join(', ')
      }, { status: 400 });
    }

    // Create slug from title if not provided
    const slug = data.slug || title.toLowerCase().replace(/[^a-z0-9]+/g, '-');

    // Prepare post data
    const postData = {
      title,
      slug,
      content,
      excerpt: data.excerpt || undefined,
      categoryId,
      subcategoryId: data.subcategoryId || undefined,
      tags: Array.isArray(data.tags) ? data.tags : [],
      seoTitle: data.seoTitle || undefined,
      seoDescription: data.seoDescription || undefined,
      seoKeywords: data.seoKeywords || undefined,
      published: Boolean(data.published),
      thumbnail: data.thumbnail || undefined,
      authorId: user.id, // Use verified user.id
    };

    console.log('Creating post with data:', postData);

    const post = await prisma.post.create({
      data: postData,
      include: {
        category: true,
        subcategory: true,
        author: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    // If the post is published, submit it to Google Search Console
    if (post.published) {
      const url = `https://themidnightspa.com/posts/${post.slug}`;
      await submitUrlToIndex(url);
      
      // Log the indexing request
      await prisma.seoIndexingLog.create({
        data: {
          urls: [url],
          type: 'URL_UPDATED',
          results: { status: 'submitted' },
          userId: session.user.id,
        },
      });
    }

    return NextResponse.json({
      success: true,
      data: post
    }, { status: 201 });

  } catch (error: any) {
    // Log error details without using error as argument
    console.log('Error creating post:', {
      message: error?.message || 'Unknown error',
      code: error?.code,
      name: error?.name
    });
    
    // Check if it's a Prisma error with a code property
    if (error && typeof error === 'object' && 'code' in error) {
      return NextResponse.json({
        success: false,
        error: 'Database error',
        details: error.message || 'Unknown database error',
        code: error.code
      }, { status: 500 });
    }

    // Generic error
    return NextResponse.json({
      success: false,
      error: 'Failed to create post',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const categorySlug = searchParams.get('category');
    const subcategorySlug = searchParams.get('subcategory');

    const posts = await prisma.post.findMany({
      where: {
        published: true,
        ...(categorySlug && {
          category: {
            slug: categorySlug
          }
        }),
        ...(subcategorySlug && {
          subcategory: {
            slug: subcategorySlug
          }
        })
      },
      select: {
        id: true,
        title: true,
        excerpt: true,
        thumbnail: true,
        createdAt: true,
        slug: true,
        tags: true,
        author: {
          select: {
            name: true
          }
        },
        category: {
          select: {
            id: true,
            title: true,
            slug: true
          }
        },
        subcategory: {
          select: {
            id: true,
            title: true,
            slug: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return NextResponse.json(posts);
  } catch (error) {
    console.error('[POSTS_GET]', error);
    return NextResponse.json(
      { error: 'Failed to fetch posts' },
      { status: 500 }
    );
  }
} 