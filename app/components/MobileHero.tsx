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
    initialInView: true // Ensure consistent initial render
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  // Only add event listeners after hydration
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

  // Initial loading state
  const loadingContent = (
    <div className="animate-pulse bg-gray-200 h-[70vh]">
      <div className="container mx-auto px-4 py-8">
        <div className="h-8 bg-gray-300 w-3/4 mx-auto mb-4 rounded"></div>
        <div className="h-4 bg-gray-300 w-1/2 mx-auto rounded"></div>
      </div>
    </div>
  );

  if (!mounted) {
    return loadingContent;
  }

  return (
    <div className="lg:hidden">
      <div className="container mx-auto px-4 py-8">
        {/* Header Section */}
        <div 
          ref={headerRef}
          className="text-center mb-8 transition-all duration-500"
          style={{
            opacity: isHeaderInView ? 1 : 0,
            transform: isHeaderInView ? 'translateY(0)' : 'translateY(20px)'
          }}
        >
          <h1 className="text-4xl font-bold text-neutral-900 mb-3">
            Dream Beyond <span className="text-neutral-700">Limits</span>
          </h1>
          <p className="text-lg text-neutral-600 max-w-md mx-auto">
            Discover tips, insights, and practices to reclaim your nights and embrace tranquility.
          </p>
        </div>

        {/* Carousel Container */}
        <div className="relative mb-6">
          {/* Carousel Track */}
          <div 
            ref={carouselRef}
            className="flex overflow-x-auto snap-x snap-mandatory scrollbar-hide"
            style={{ 
              scrollbarWidth: 'none',
              msOverflowStyle: 'none',
              WebkitOverflowScrolling: 'touch'
            }}
          >
            {posts.slice(0, 3).map((post, index) => (
              <div 
                key={post.id}
                className="min-w-full w-full flex-shrink-0 snap-center px-1"
              >
                <Link href={`/posts/${post.slug}`} className="block">
                  <div className="relative aspect-[16/9] rounded-lg overflow-hidden">
                    <Image
                      src={post.thumbnail}
                      alt={post.title}
                      fill
                      className="object-cover"
                      priority={index === 0}
                      quality={index === 0 ? 90 : 75}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10" />
                    <div className="absolute bottom-0 left-0 right-0 p-6 z-20">
                      <h2 className="text-2xl font-bold text-white mb-2">{post.title}</h2>
                      <p className="text-white/80">{post.excerpt}</p>
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
                className={`w-2 h-2 rounded-full transition-all ${
                  index === activeIndex ? 'bg-neutral-900 w-4' : 'bg-neutral-300'
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>

        {/* CTA Buttons */}
        <div 
          className="mt-8 flex flex-wrap justify-center gap-3 transition-all duration-500"
          style={{
            opacity: isHeaderInView ? 1 : 0,
            transform: isHeaderInView ? 'translateY(0)' : 'translateY(20px)'
          }}
        >
          <Link
            href="/categories"
            className="inline-flex items-center px-5 py-2.5 bg-neutral-900 text-white rounded-lg hover:bg-neutral-800 transition-colors text-sm font-medium"
          >
            Explore Categories
          </Link>
          <Link
            href="/videos"
            className="inline-flex items-center px-5 py-2.5 bg-white text-neutral-900 rounded-lg hover:bg-neutral-50 transition-colors border border-neutral-200 text-sm font-medium"
          >
            Watch Videos
          </Link>
        </div>
      </div>
    </div>
  );
}