import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const [categories, subcategories, posts, videos] = await Promise.all([
      prisma.postCategory.findMany({
        include: {
          subcategories: {
            include: {
              category: true,
              _count: {
                select: {
                  posts: true,
                },
              },
            },
          },
        },
      }),
      prisma.postSubCategory.findMany({
        include: {
          category: {
            select: {
              id: true,
              title: true,
              slug: true,
            },
          },
          _count: {
            select: {
              posts: true,
            },
          },
        },
      }),
      prisma.post.findMany({
        include: {
          author: {
            select: {
              name: true,
            },
          },
          category: {
            select: {
              title: true,
              slug: true,
            },
          },
          subcategory: {
            select: {
              title: true,
              slug: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      }),
      prisma.video.findMany({
        where: {
          published: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
      }),
    ]);

    return NextResponse.json({
      categories: categories.map(category => ({
        id: category.id,
        title: category.title,
        description: category.description || '',
        thumbnail: category.thumbnail,
        slug: category.slug,
        subcategories: category.subcategories.map(sub => ({
          id: sub.id,
          title: sub.title,
          description: sub.description,
          thumbnail: sub.thumbnail,
          slug: sub.slug,
          categoryId: sub.categoryId,
          category: {
            id: sub.category.id,
            title: sub.category.title,
            slug: sub.category.slug,
          },
          _count: {
            posts: sub._count.posts,
          },
        })),
      })),
      subcategories: subcategories.map(sub => ({
        id: sub.id,
        title: sub.title,
        description: sub.description,
        thumbnail: sub.thumbnail,
        slug: sub.slug,
        categoryId: sub.categoryId,
        category: {
          id: sub.category.id,
          title: sub.category.title,
          slug: sub.category.slug,
        },
        _count: {
          posts: sub._count.posts,
        },
      })),
      posts: posts.map(post => ({
        id: post.id,
        title: post.title,
        excerpt: post.excerpt || '',
        thumbnail: post.thumbnail,
        createdAt: post.createdAt.toISOString(),
        author: {
          name: post.author.name || '',
        },
        slug: post.slug,
        category: {
          title: post.category.title,
          slug: post.category.slug,
        },
        subcategory: post.subcategory ? {
          title: post.subcategory.title,
          slug: post.subcategory.slug,
        } : null,
      })),
      videos: videos.map(video => ({
        id: video.id,
        title: video.title,
        description: video.description || '',
        youtubeUrl: video.youtubeUrl,
        thumbnail: null,
        createdAt: video.createdAt.toISOString(),
        slug: video.slug,
      })),
    });
  } catch (error) {
    console.error('Error fetching home data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch home data' },
      { status: 500 }
    );
  }
} 