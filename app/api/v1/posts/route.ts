import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { Role } from '@prisma/client';
import { submitUrlToIndex } from '@/lib/google-indexing';

// Use a strong, unique API key
const API_KEY = process.env.EXTERNAL_API_KEY || 'your-secure-api-key-for-external-access';

// Validate API key
const validateApiKey = (request: Request) => {
  const apiKey = request.headers.get('x-api-key');
  return apiKey === API_KEY;
};

export async function POST(req: Request) {
  try {
    // Validate API key
    if (!validateApiKey(req)) {
      return NextResponse.json({ 
        success: false, 
        error: 'Unauthorized - Invalid API key' 
      }, { status: 401 });
    }

    // Get or create system user for API posts
    let authorId: string;
    const systemUser = await prisma.user.findFirst({
      where: {
        email: 'api-system@themidnightspa.com',
        role: Role.SUPER_ADMIN
      }
    });

    if (!systemUser) {
      const newSystemUser = await prisma.user.create({
        data: {
          email: 'api-system@themidnightspa.com',
          name: 'API System',
          role: Role.SUPER_ADMIN,
          isApproved: true,
          password: 'not-used'
        }
      });
      authorId = newSystemUser.id;
    } else {
      authorId = systemUser.id;
    }

    const data = await req.json();
    
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
      authorId,
    };

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
      
      await prisma.seoIndexingLog.create({
        data: {
          urls: [url],
          type: 'URL_UPDATED',
          results: { status: 'submitted' },
          userId: authorId,
        },
      });
    }

    return NextResponse.json({
      success: true,
      data: post
    }, { status: 201 });

  } catch (error: any) {
    console.error('Error creating post via API:', {
      message: error?.message || 'Unknown error',
      code: error?.code,
      name: error?.name
    });
    
    if (error && typeof error === 'object' && 'code' in error) {
      return NextResponse.json({
        success: false,
        error: 'Database error',
        details: error.message || 'Unknown database error',
        code: error.code
      }, { status: 500 });
    }

    return NextResponse.json({
      success: false,
      error: 'Failed to create post',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

export async function GET(request: Request) {
  try {
    // Validate API key
    if (!validateApiKey(request)) {
      return NextResponse.json({ 
        success: false, 
        error: 'Unauthorized - Invalid API key' 
      }, { status: 401 });
    }
    
    const { searchParams } = new URL(request.url);
    const categorySlug = searchParams.get('category');
    const subcategorySlug = searchParams.get('subcategory');
    const publishedOnly = searchParams.get('publishedOnly') === 'true';

    const posts = await prisma.post.findMany({
      where: {
        ...(publishedOnly && { published: true }),
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
        content: true,
        excerpt: true,
        thumbnail: true,
        createdAt: true,
        published: true,
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

    return NextResponse.json({
      success: true,
      data: posts
    });
  } catch (error) {
    console.error('Error fetching posts via API:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch posts',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
} 