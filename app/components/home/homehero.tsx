import React, { Suspense } from 'react';
import Link from 'next/link';
import { Poppins } from 'next/font/google';
import prisma from '@/lib/prisma';
import ClientHero from './ClientHero';

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
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

async function getPosts(): Promise<Post[]> {
  "use server"
  try {
    const posts = await prisma.post.findMany({
      where: {
        published: true,
      },
      orderBy: {
        createdAt: 'desc'
      },
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
}

export default async function HomeHero() {
  const posts = await getPosts();

  return (
    <section className="relative bg-gray-100">
      <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10"></div>
      <Suspense fallback={
        <div className="animate-pulse bg-gray-200 h-[70vh]">
          <div className="container mx-auto px-4 py-8">
            <div className="h-8 bg-gray-300 w-3/4 mx-auto mb-4 rounded"></div>
            <div className="h-4 bg-gray-300 w-1/2 mx-auto rounded"></div>
          </div>
        </div>
      }>
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
      </Suspense>
    </section>
  );
}
