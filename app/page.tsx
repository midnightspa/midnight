import { Suspense } from 'react';
import HomePageClient from './HomePageClient';
import { getPosts, getCategories, getSubCategories, getVideos } from './actions';
import { getSiteSettings } from '@/lib/seo';
import Loading from '@/app/loading';
import type { Post, Category, SubCategory, Video, Settings } from '@/types';

// Single configuration for dynamic page
export const dynamic = 'force-dynamic';

// Keep this component as a Server Component
export default async function HomePage() {
  // Fetch all data in parallel
  const [settings, categoriesData, subcategoriesData, postsData, videosData] = await Promise.all([
    getSiteSettings().catch((error: Error) => {
      console.error('Error fetching settings:', error);
      return null;
    }),
    getCategories().catch((error: Error) => {
      console.error('Error fetching categories:', error);
      return [];
    }),
    getSubCategories().catch((error: Error) => {
      console.error('Error fetching subcategories:', error);
      return [];
    }),
    getPosts().catch((error: Error) => {
      console.error('Error fetching posts:', error);
      return [];
    }),
    getVideos().catch((error: Error) => {
      console.error('Error fetching videos:', error);
      return [];
    })
  ]);

  // Transform the data to match the types
  const categories: Category[] = categoriesData.map(category => ({
    id: category.id,
    title: category.title,
    description: category.description,
    thumbnail: category.thumbnail,
    slug: category.slug,
    subcategories: category.subcategories.map(sub => ({
      id: sub.id,
      title: sub.title,
      description: sub.description,
      thumbnail: sub.thumbnail,
      slug: sub.slug
    }))
  }));

  const subcategories: SubCategory[] = subcategoriesData.map(sub => ({
    id: sub.id,
    title: sub.title,
    description: sub.description,
    thumbnail: sub.thumbnail,
    slug: sub.slug,
    category: {
      id: sub.category.id,
      title: sub.category.title,
      slug: sub.category.slug
    },
    _count: {
      posts: sub._count.posts
    }
  }));

  const posts: Post[] = postsData.map(post => ({
    id: post.id,
    title: post.title,
    excerpt: post.excerpt,
    thumbnail: post.thumbnail,
    createdAt: post.createdAt,
    tags: post.tags || [],
    slug: post.slug,
    category: post.category,
    subcategory: post.subcategory,
    author: {
      name: post.author?.name || null
    }
  }));

  const videos: Video[] = videosData.map(video => ({
    id: video.id,
    title: video.title,
    description: video.description,
    youtubeUrl: video.youtubeUrl,
    thumbnail: null, // This will be set in the client component
    createdAt: video.createdAt,
    slug: video.slug,
    author: {
      name: video.author?.name || null
    }
  }));

  return (
    <Suspense fallback={<Loading />}>
      <HomePageClient 
        settings={settings}
        categories={categories}
        subcategories={subcategories}
        posts={posts}
        videos={videos}
      />
    </Suspense>
  );
}