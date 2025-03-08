import React from 'react';
import Link from 'next/link';
import { Poppins } from 'next/font/google';
import MobileHero from '@/app/components/MobileHero';
import ClientSideCarousel from '@/app/components/ClientSideCarousel';
import prisma from '@/lib/prisma';

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

const shimmer = (w: number, h: number) => `
<svg width="${w}" height="${h}" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
  <defs>
    <linearGradient id="g">
      <stop stop-color="#f6f7f8" offset="20%" />
      <stop stop-color="#edeef1" offset="50%" />
      <stop stop-color="#f6f7f8" offset="70%" />
    </linearGradient>
  </defs>
  <rect width="${w}" height="${h}" fill="#f6f7f8" />
  <rect id="r" width="${w}" height="${h}" fill="url(#g)" />
  <animate xlink:href="#r" attributeName="x" from="-${w}" to="${w}" dur="1s" repeatCount="indefinite"  />
</svg>`;

const toBase64 = (str: string) => Buffer.from(str).toString('base64');

const DEFAULT_THUMBNAIL = '/placeholder.jpg';

const getImageUrl = (url: string | null) => {
  if (!url) return DEFAULT_THUMBNAIL;
  if (url.startsWith('http')) return url;
  return url.startsWith('/') ? url : `/${url}`;
};

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
      
      {/* Mobile Hero */}
      <MobileHero posts={posts} />

      {/* Desktop & Tablet Hero */}
      <div className="hidden lg:flex container mx-auto px-4 h-[70vh] items-center justify-between relative overflow-hidden">
        {/* Left side content */}
        <div className="max-w-xl relative z-10">
          <div className="absolute -top-10 -left-10 w-20 h-20 bg-neutral-900 rounded-full opacity-5"></div>
          <h1 className="text-6xl font-bold text-neutral-900 mb-6 leading-tight">
            Dream Beyond <span className="text-neutral-700">Limits</span>
          </h1>
          <p className="text-xl text-neutral-600 mb-8 leading-relaxed">
            Discover tips, insights, and practices to reclaim your nights and embrace tranquility.
          </p>
          <div className="flex gap-4">
            <Link
              href="/categories"
              className="inline-flex items-center px-8 py-4 bg-neutral-900 text-white rounded-lg hover:bg-neutral-800 transition-all transform hover:scale-105 shadow-lg"
            >
              Explore Categories
            </Link>
            <Link
              href="/videos"
              className="inline-flex items-center px-8 py-4 bg-white text-neutral-900 rounded-lg hover:bg-neutral-50 transition-all transform hover:scale-105 shadow-lg border border-neutral-200"
            >
              Watch Videos
            </Link>
          </div>
        </div>

        {/* Right side slider */}
        <ClientSideCarousel 
          posts={posts.map(post => ({
            id: post.id,
            title: post.title,
            excerpt: post.excerpt,
            thumbnailUrl: getImageUrl(post.thumbnail),
            createdAt: post.createdAt,
            slug: post.slug,
            category: post.category || undefined
          }))} 
          blurDataURL={`data:image/svg+xml;base64,${toBase64(shimmer(700, 475))}`}
        />
      </div>
    </section>
  );
}
