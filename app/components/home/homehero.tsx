import React from 'react';
import { Poppins } from 'next/font/google';
import prisma from '@/lib/prisma';
import ClientHero from './ClientHero';
import { unstable_cache } from 'next/cache';

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  display: 'swap',
});

interface Post {
  id: string;
  title: string;
  excerpt: string;
  thumbnail: string | null;
  createdAt: string;
  tags: string[];
  slug: string;
  category: {
    title: string;
    slug: string;
  } | null;
  subcategory: {
    title: string;
    slug: string;
  } | null;
}

// Cache the posts query for 1 hour
const getCachedPosts = unstable_cache(
  async () => {
    try {
      const posts = await prisma.post.findMany({
        where: {
          published: true,
        },
        orderBy: {
          createdAt: 'desc'
        },
        take: 3, // Reduced from 6 to 3 since we only show 3 posts
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
          }
        }
      });

      return posts.map(post => ({
        id: post.id,
        title: post.title,
        excerpt: post.excerpt || '',
        thumbnail: post.thumbnail,
        createdAt: post.createdAt.toISOString(),
        tags: post.tags || [],
        slug: post.slug,
        category: post.category ? {
          title: post.category.title,
          slug: post.category.slug,
        } : null,
        subcategory: post.subcategory ? {
          title: post.subcategory.title,
          slug: post.subcategory.slug,
        } : null
      }));
    } catch (error) {
      console.error('Error fetching posts:', error);
      return [];
    }
  },
  ['hero-posts'],
  { revalidate: 3600 } // Cache for 1 hour
);

export default async function HomeHero() {
  const posts = await getCachedPosts();

  return (
    <section className="relative bg-gradient-to-b from-neutral-50 to-white">
      <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-5"></div>
      <div className={poppins.className}>
        <ClientHero 
          key={posts.length > 0 ? posts[0].id : 'empty-hero'}
          posts={posts.map(post => ({
            ...post,
            thumbnail: post.thumbnail ? 
              (post.thumbnail.startsWith('http') ? post.thumbnail : 
               post.thumbnail.startsWith('/') ? post.thumbnail : `/${post.thumbnail}`) 
              : '/placeholder.jpg'
          }))}
        />
      </div>
    </section>
  );
}
