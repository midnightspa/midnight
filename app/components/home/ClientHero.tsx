'use client';

import React, { Suspense, useState, useEffect } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';

// Loading fallbacks
const MobileHeroFallback = () => (
  <div className="lg:hidden animate-pulse bg-gray-200 h-[70vh] rounded-xl" />
);

const CarouselFallback = () => (
  <div className="hidden lg:block animate-pulse bg-gray-200 h-[70vh] w-[400px] rounded-xl" />
);

// Dynamically import components with no SSR
const MobileHero = dynamic(() => import('@/app/components/MobileHero'), {
  loading: () => <MobileHeroFallback />,
  ssr: false
});

const ClientSideCarousel = dynamic(() => import('@/app/components/ClientSideCarousel'), {
  loading: () => <CarouselFallback />,
  ssr: false
});

interface ClientHeroProps {
  posts: Array<{
    id: string;
    title: string;
    excerpt: string;
    thumbnail: string;
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
  }>;
}

export default function ClientHero({ posts }: ClientHeroProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="animate-pulse bg-gray-200 h-[70vh]">
        <div className="container mx-auto px-4 py-8">
          <div className="h-8 bg-gray-300 w-3/4 mx-auto mb-4 rounded"></div>
          <div className="h-4 bg-gray-300 w-1/2 mx-auto rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Mobile Hero */}
      <div className="lg:hidden">
        <MobileHero posts={posts} />
      </div>

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
        <div className="relative">
          <ClientSideCarousel 
            posts={posts.map(post => ({
              id: post.id,
              title: post.title,
              excerpt: post.excerpt,
              thumbnailUrl: post.thumbnail,
              createdAt: post.createdAt,
              slug: post.slug,
              category: post.category || undefined
            }))} 
            blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/4gHYSUNDX1BST0ZJTEUAAQEAAAHIAAAAAAQwAABtbnRyUkdCIFhZWiAH4AABAAEAAAAAAABhY3NwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAA9tYAAQAAAADTLQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAlkZXNjAAAA8AAAACRyWFlaAAABFAAAABRnWFlaAAABKAAAABRiWFlaAAABPAAAABR3dHB0AAABUAAAABRyVFJDAAABZAAAAChnVFJDAAABZAAAAChiVFJDAAABZAAAAChjcHJ0AAABjAAAADxtbHVjAAAAAAAAAAEAAAAMZW5VUwAAAAgAAAAcAHMAUgBHAEJYWVogAAAAAAAAb6IAADj1AAADkFhZWiAAAAAAAABimQAAt4UAABjaWFlaIAAAAAAAACSgAAAPhAAAts9YWVogAAAAAAAA9tYAAQAAAADTLXBhcmEAAAAAAAQAAAACZmYAAPKnAAANWQAAE9AAAApbAAAAAAAAAABtbHVjAAAAAAAAAAEAAAAMZW5VUwAAACAAAAAcAEcAbwBvAGcAbABlACAASQBuAGMALgAgADIAMAAxADb/2wBDABQODxIPDRQSEBIXFRQdHx4eHRseHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh7/2wBDAR4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh7/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAb/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k="
          />
        </div>
      </div>
    </>
  );
} 