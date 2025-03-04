import React from 'react';
import Link from 'next/link';
import ImageWithFallback from '@/app/components/ImageWithFallback';
import prisma from '@/lib/prisma';

const DEFAULT_THUMBNAIL = '/placeholder.jpg';

// Function to get the image URL (handling cases where the URL is relative)
const getImageUrl = (url: string | null) => {
  if (!url) return DEFAULT_THUMBNAIL;
  if (url.startsWith('http')) return url;
  return url.startsWith('/') ? url : `/${url}`;
};

// ✅ Convert to an **async Server Component** for fetching data
export default async function HomeCategory() {
  const dbCategories = await prisma.postCategory
    .findMany({
      include: {
        subcategories: {
          select: {
            id: true,
            title: true,
            description: true,
            thumbnail: true,
            slug: true,
          },
        },
      },
    })
    .catch((error) => {
      console.error('Error fetching categories:', error);
      return [];
    });

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
          {dbCategories.slice(0, 3).map((category) => (
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
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
              </div>
              <div className="flex items-center gap-2 mb-3">
                {category.subcategories.length > 0 && (
                  <span className="px-3 py-1 bg-neutral-200 text-neutral-600 text-sm rounded-full">
                    {category.subcategories.length} subcategories
                  </span>
                )}
              </div>
              <h3 className="text-xl font-semibold text-neutral-900 mb-2">{category.title}</h3>
              <p className="text-neutral-600 mb-4 line-clamp-2">{category.description}</p>
              <Link
                href={`/categories/${category.slug}`}
                className="inline-flex items-center text-neutral-900 font-medium hover:gap-2 transition-all"
              >
                <span>Explore</span>
                <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}