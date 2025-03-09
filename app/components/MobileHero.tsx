'use client';

import React, { useRef, useState, useEffect } from 'react';
import Link from 'next/link';
import { useInView } from 'react-intersection-observer';
import Image from 'next/image';

interface MobileHeroProps {
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
  }>;
}

const BLUR_DATA_URL = "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/4gHYSUNDX1BST0ZJTEUAAQEAAAHIAAAAAAQwAABtbnRyUkdCIFhZWiAH4AABAAEAAAAAAABhY3NwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAA9tYAAQAAAADTLQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAlkZXNjAAAA8AAAACRyWFlaAAABFAAAABRnWFlaAAABKAAAABRiWFlaAAABPAAAABR3dHB0AAABUAAAABRyVFJDAAABZAAAAChnVFJDAAABZAAAAChiVFJDAAABZAAAAChjcHJ0AAABjAAAADxtbHVjAAAAAAAAAAEAAAAMZW5VUwAAAAgAAAAcAHMAUgBHAEJYWVogAAAAAAAAb6IAADj1AAADkFhZWiAAAAAAAABimQAAt4UAABjaWFlaIAAAAAAAACSgAAAPhAAAts9YWVogAAAAAAAA9tYAAQAAAADTLXBhcmEAAAAAAAQAAAACZmYAAPKnAAANWQAAE9AAAApbAAAAAAAAAABtbHVjAAAAAAAAAAEAAAAMZW5VUwAAACAAAAAcAEcAbwBvAGcAbABlACAASQBuAGMALgAgADIAMAAxADb/2wBDABQODxIPDRQSEBIXFRQdHx4eHRseHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh7/2wBDAR4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh7/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAb/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k=";

export default function MobileHero({ posts }: MobileHeroProps) {
  const [mounted, setMounted] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const carouselRef = useRef<HTMLDivElement>(null);
  const { ref: headerRef, inView: isHeaderInView } = useInView({ 
    triggerOnce: true,
    threshold: 0.1,
    initialInView: true
  });

  // Get the first post's image URL for preloading
  const firstPostImage = posts[0]?.thumbnail;

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted || !carouselRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = Number(entry.target.getAttribute('data-index'));
            if (!isNaN(index)) setActiveIndex(index);
          }
        });
      },
      { threshold: 0.5 }
    );

    const slides = carouselRef.current.querySelectorAll('[data-index]');
    slides.forEach((slide) => observer.observe(slide));

    return () => observer.disconnect();
  }, [mounted]);

  if (!mounted) {
    return (
      <div className="animate-pulse bg-gray-200 h-[50vh] sm:h-[45vh]">
        <div className="container mx-auto px-4 py-6">
          <div className="h-8 bg-gray-300 w-3/4 mx-auto mb-4 rounded"></div>
          <div className="h-4 bg-gray-300 w-1/2 mx-auto rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="lg:hidden bg-gradient-to-b from-neutral-50 to-white">
      <div className="container mx-auto px-4 py-6">
        {/* Header Section */}
        <div 
          ref={headerRef}
          className={`text-center mb-6 transition-opacity duration-500 ${
            isHeaderInView ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <h1 className="text-2xl sm:text-3xl font-bold text-neutral-900 mb-2">
            Dream Beyond <span className="text-neutral-700">Limits</span>
          </h1>
          <p className="text-sm sm:text-base text-neutral-600 max-w-md mx-auto">
            Discover tips, insights, and practices to reclaim your nights.
          </p>
        </div>

        {/* Carousel Container */}
        <div className="relative mb-4">
          {/* Carousel Track */}
          <div 
            ref={carouselRef}
            className="flex overflow-x-auto snap-x snap-mandatory scrollbar-hide gap-3"
            style={{ scrollbarWidth: 'none' }}
          >
            {posts.slice(0, 3).map((post, index) => (
              <div 
                key={post.id}
                data-index={index}
                className="min-w-[280px] w-[280px] flex-shrink-0 snap-center"
              >
                <Link href={`/posts/${post.slug}`} className="block">
                  <div className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                    <div className="relative aspect-[4/3]">
                      <Image
                        src={post.thumbnail}
                        alt={post.title}
                        fill
                        className="object-cover"
                        priority={index === 0}
                        quality={75}
                        sizes="280px"
                        placeholder="blur"
                        blurDataURL={BLUR_DATA_URL}
                        loading={index === 0 ? "eager" : "lazy"}
                      />
                      {post.category && (
                        <div className="absolute top-2 left-2 px-2 py-0.5 bg-white/90 backdrop-blur-sm text-neutral-900 text-xs font-medium rounded-full">
                          {post.category.title}
                        </div>
                      )}
                    </div>
                    <div className="p-3">
                      <h2 className="text-base font-bold text-neutral-900 mb-1 line-clamp-2">{post.title}</h2>
                      <p className="text-xs text-neutral-600 line-clamp-2">{post.excerpt}</p>
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>

          {/* Dot indicators */}
          <div className="flex justify-center gap-1 mt-3">
            {posts.slice(0, 3).map((_, index) => (
              <div
                key={index}
                className={`h-1 rounded-full transition-all duration-300 ${
                  index === activeIndex ? 'w-4 bg-neutral-900' : 'w-1 bg-neutral-300'
                }`}
                role="button"
                tabIndex={0}
                onClick={() => {
                  if (carouselRef.current) {
                    carouselRef.current.scrollTo({
                      left: index * 280,
                      behavior: 'smooth'
                    });
                  }
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    if (carouselRef.current) {
                      carouselRef.current.scrollTo({
                        left: index * 280,
                        behavior: 'smooth'
                      });
                    }
                  }
                }}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>

        {/* CTA Buttons */}
        <div 
          className={`mt-4 flex justify-center gap-2 transition-opacity duration-500 ${
            isHeaderInView ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <Link
            href="/categories"
            className="px-3 py-1.5 bg-neutral-900 text-white text-sm rounded-lg hover:bg-neutral-800 transition-colors"
          >
            Explore Categories
          </Link>
          <Link
            href="/videos"
            className="px-3 py-1.5 bg-white text-neutral-900 text-sm rounded-lg hover:bg-neutral-50 transition-colors border border-neutral-200"
          >
            Watch Videos
          </Link>
        </div>
      </div>
    </div>
  );
}