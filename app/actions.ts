'use server';

import prisma from '@/lib/prisma';
import { getSiteSettings } from '@/lib/seo';
import type { Post, Video, Category, SubCategory, Settings } from '@/types';

export async function getPosts() {
  try {
    const posts = await prisma.post.findMany({
      where: { published: true },
      orderBy: { createdAt: 'desc' },
      take: 6,
      select: {
        id: true,
        title: true,
        excerpt: true,
        thumbnail: true,
        createdAt: true,
        tags: true,
        slug: true,
        category: {
          select: {
            title: true,
            slug: true,
          }
        },
        subcategory: {
          select: {
            title: true,
            slug: true,
          }
        },
        author: {
          select: {
            name: true
          }
        }
      }
    });

    return posts.map(post => ({
      ...post,
      createdAt: post.createdAt.toISOString(),
    }));
  } catch (error) {
    console.error('Error fetching posts:', error);
    return [];
  }
}

export async function getCategories() {
  try {
    return await prisma.postCategory.findMany({
      select: {
        id: true,
        title: true,
        description: true,
        thumbnail: true,
        slug: true,
        subcategories: {
          select: {
            id: true,
            title: true,
            description: true,
            thumbnail: true,
            slug: true,
          }
        }
      }
    });
  } catch (error) {
    console.error('Error fetching categories:', error);
    return [];
  }
}

export async function getSubCategories() {
  try {
    return await prisma.postSubCategory.findMany({
      select: {
        id: true,
        title: true,
        description: true,
        thumbnail: true,
        slug: true,
        category: {
          select: {
            id: true,
            title: true,
            slug: true
          }
        },
        _count: {
          select: {
            posts: true
          }
        }
      }
    });
  } catch (error) {
    console.error('Error fetching subcategories:', error);
    return [];
  }
}

export async function getVideos() {
  try {
    const videos = await prisma.video.findMany({
      where: { published: true },
      orderBy: { createdAt: 'desc' },
      take: 6,
      select: {
        id: true,
        title: true,
        description: true,
        youtubeUrl: true,
        createdAt: true,
        slug: true,
        author: {
          select: { name: true }
        }
      }
    });

    return videos.map(video => ({
      ...video,
      createdAt: video.createdAt.toISOString(),
    }));
  } catch (error) {
    console.error('Error fetching videos:', error);
    return [];
  }
}

export { getSiteSettings }; 