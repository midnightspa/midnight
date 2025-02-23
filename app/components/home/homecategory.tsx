import React from 'react';
import Link from 'next/link';
import ImageWithFallback from '@/app/components/ImageWithFallback';
import prisma from '@/lib/prisma';
import { Poppins } from 'next/font/google';
import { unstable_noStore as noStore } from 'next/cache';

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
});

interface Category {
  id: string;
  title: string;
  slug: string;
  thumbnail: string | null;
  postCount: number;
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

async function getCategories(): Promise<Category[]> {
  try {
    console.log('[HomeCategory] Starting getCategories function');
    noStore();
    
    console.log('[HomeCategory] Attempting to fetch categories from database');
    const categories = await prisma.postCategory.findMany({
      select: {
        id: true,
        title: true,
        slug: true,
        thumbnail: true,
        posts: {
          select: {
            id: true
          }
        }
      }
    }).catch((error: Error & { code?: string }) => {
      console.error('[HomeCategory] Database query error:', {
        message: error.message,
        code: error.code,
        stack: error.stack
      });
      throw error;
    });

    console.log(`[HomeCategory] Successfully fetched ${categories.length} categories`);

    return categories.map((category) => {
      try {
        return {
          id: category.id,
          title: category.title,
          slug: category.slug,
          thumbnail: category.thumbnail,
          postCount: category.posts.length
        };
      } catch (error) {
        const err = error as Error;
        console.error('[HomeCategory] Error mapping category:', {
          categoryId: category?.id,
          error: err.message,
          stack: err.stack,
          categoryData: JSON.stringify(category, null, 2)
        });
        throw err;
      }
    });
  } catch (error) {
    const err = error as Error;
    console.error('[HomeCategory] Fatal error in getCategories:', {
      message: err.message,
      stack: err.stack,
      type: err.constructor.name
    });
    return [];
  }
}

export default async function HomeCategory() {
  try {
    console.log('[HomeCategory] Component rendering started');
    const categories = await getCategories();
    console.log('[HomeCategory] Categories fetched successfully, rendering component');

    return (
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-end mb-12">
            <div>
              <span className="text-sm font-medium text-neutral-500 uppercase tracking-wider">Browse by</span>
              <h2 className="text-3xl font-semibold text-neutral-900 mt-1">Featured Categories</h2>
            </div>
            <Link href="/categories" className="text-neutral-900 font-medium hover:text-neutral-700">
              View All Categories →
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {categories.slice(0, 3).map((category) => {
              try {
                return (
                  <div
                    key={category.id}
                    className="group bg-neutral-50 rounded-xl p-6 hover:bg-neutral-100 transition-all duration-300 border border-neutral-100"
                  >
                    <div className="h-48 relative mb-4 rounded-lg overflow-hidden">
                      <ImageWithFallback
                        src={getImageUrl(category.thumbnail)}
                        alt={category.title}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                        placeholder="blur"
                        blurDataURL={`data:image/svg+xml;base64,${toBase64(shimmer(700, 475))}`}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    </div>
                    <div className="flex items-center gap-2 mb-3">
                      <span className="px-3 py-1 bg-neutral-200 text-neutral-600 text-sm rounded-full">
                        {category.postCount} posts
                      </span>
                    </div>
                    <h3 className="text-xl font-semibold text-neutral-900 mb-2">{category.title}</h3>
                    <Link href={`/categories/${category.slug}`} className="inline-flex items-center text-neutral-900 font-medium hover:gap-2 transition-all">
                      <span>Explore</span>
                      <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </Link>
                  </div>
                );
              } catch (error) {
                const err = error as Error;
                console.error('[HomeCategory] Error rendering category:', {
                  categoryId: category?.id,
                  error: err.message,
                  stack: err.stack
                });
                return null;
              }
            })}
          </div>
        </div>
      </section>
    );
  } catch (error) {
    const err = error as Error;
    console.error('[HomeCategory] Error rendering component:', {
      message: err.message,
      stack: err.stack,
      type: err.constructor.name
    });
    return <div>Error loading categories. Please try again later.</div>;
  }
}
