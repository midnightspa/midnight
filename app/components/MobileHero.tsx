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

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    const currentRef = carouselRef.current;
    if (currentRef) {
      const handleScroll = () => {
        const scrollPosition = currentRef.scrollLeft;
        const slideWidth = currentRef.offsetWidth;
        const newIndex = Math.round(scrollPosition / slideWidth);
        if (newIndex !== activeIndex) {
          setActiveIndex(newIndex);
        }
      };

      currentRef.addEventListener('scroll', handleScroll);
      return () => currentRef.removeEventListener('scroll', handleScroll);
    }
  }, [mounted, activeIndex]);

  const handleDotClick = (index: number) => {
    if (!mounted) return;
    setActiveIndex(index);
    if (carouselRef.current) {
      carouselRef.current.scrollTo({
        left: index * carouselRef.current.offsetWidth,
        behavior: 'smooth'
      });
    }
  };

  if (!mounted) {
    return (
      <div className="animate-pulse bg-gray-200 h-[60vh] sm:h-[50vh]">
        <div className="container mx-auto px-4 py-8">
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
          className="text-center mb-6 transition-all duration-500"
          style={{
            opacity: isHeaderInView ? 1 : 0,
            transform: isHeaderInView ? 'translateY(0)' : 'translateY(20px)'
          }}
        >
          <h1 className="text-3xl sm:text-4xl font-bold text-neutral-900 mb-2">
            Dream Beyond <span className="text-neutral-700">Limits</span>
          </h1>
          <p className="text-base sm:text-lg text-neutral-600 max-w-md mx-auto">
            Discover tips, insights, and practices to reclaim your nights.
          </p>
        </div>

        {/* Carousel Container */}
        <div className="relative mb-4">
          {/* Carousel Track */}
          <div 
            ref={carouselRef}
            className="flex overflow-x-auto snap-x snap-mandatory scrollbar-hide gap-4"
            style={{ 
              scrollbarWidth: 'none',
              msOverflowStyle: 'none',
              WebkitOverflowScrolling: 'touch'
            }}
          >
            {posts.slice(0, 3).map((post, index) => (
              <div 
                key={post.id}
                className="min-w-[85%] sm:min-w-[70%] flex-shrink-0 snap-center"
              >
                <Link href={`/posts/${post.slug}`} className="block">
                  <div className="bg-white rounded-2xl overflow-hidden shadow-lg transition-all duration-300 hover:shadow-xl hover:transform hover:scale-[1.02]">
                    <div className="relative aspect-[16/10] sm:aspect-[16/9]">
                      <Image
                        src={post.thumbnail}
                        alt={post.title}
                        fill
                        className="object-cover"
                        priority={index === 0}
                        quality={index === 0 ? 90 : 75}
                        sizes="(max-width: 640px) 85vw, (max-width: 1024px) 70vw, 33vw"
                      />
                      {post.category && (
                        <div className="absolute top-4 left-4 px-3 py-1 bg-white/90 backdrop-blur-sm text-neutral-900 text-sm font-medium rounded-full">
                          {post.category.title}
                        </div>
                      )}
                    </div>
                    <div className="p-4 sm:p-5">
                      <h2 className="text-xl sm:text-2xl font-bold text-neutral-900 mb-2 line-clamp-2">{post.title}</h2>
                      <p className="text-neutral-600 line-clamp-2 text-sm sm:text-base">{post.excerpt}</p>
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>

          {/* Dot indicators */}
          <div className="flex justify-center gap-2 mt-4">
            {posts.slice(0, 3).map((_, index) => (
              <button
                key={index}
                onClick={() => handleDotClick(index)}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  index === activeIndex ? 'bg-neutral-900 w-4' : 'bg-neutral-300'
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>

        {/* CTA Buttons */}
        <div 
          className="mt-6 flex flex-wrap justify-center gap-3 transition-all duration-500"
          style={{
            opacity: isHeaderInView ? 1 : 0,
            transform: isHeaderInView ? 'translateY(0)' : 'translateY(20px)'
          }}
        >
          <Link
            href="/categories"
            className="inline-flex items-center px-5 py-2.5 bg-neutral-900 text-white rounded-lg hover:bg-neutral-800 transition-colors text-sm font-medium shadow-sm hover:shadow-md"
          >
            Explore Categories
          </Link>
          <Link
            href="/videos"
            className="inline-flex items-center px-5 py-2.5 bg-white text-neutral-900 rounded-lg hover:bg-neutral-50 transition-colors border border-neutral-200 text-sm font-medium shadow-sm hover:shadow-md"
          >
            Watch Videos
          </Link>
        </div>
      </div>
    </div>
  );
}