'use client';

import React, { useRef, useState } from 'react';
import Link from 'next/link';
import { useInView } from 'framer-motion';
import { getImageUrl } from '@/app/utils/imageUtils';
import Image from 'next/image';

interface Post {
  id: string;
  title: string;
  excerpt: string;
  thumbnail: string | null;
  slug: string;
  category: {
    title: string;
    slug: string;
  } | null;
}

interface MobileHeroProps {
  posts: Post[];
}

export default function MobileHero({ posts }: MobileHeroProps) {
  const headerRef = useRef(null);
  const carouselRef = useRef<HTMLDivElement>(null);
  const isHeaderInView = useInView(headerRef, { once: true });
  const [activeIndex, setActiveIndex] = useState(0);
  
  // Handle dot indicator click
  const handleDotClick = (index: number) => {
    setActiveIndex(index);
    if (carouselRef.current) {
      carouselRef.current.scrollTo({
        left: index * carouselRef.current.offsetWidth,
        behavior: 'smooth'
      });
    }
  };
  
  // Handle scroll event to update active index
  const handleScroll = () => {
    if (carouselRef.current) {
      const scrollPosition = carouselRef.current.scrollLeft;
      const slideWidth = carouselRef.current.offsetWidth;
      const newIndex = Math.round(scrollPosition / slideWidth);
      if (newIndex !== activeIndex) {
        setActiveIndex(newIndex);
      }
    }
  };
  
  return (
    <div className="lg:hidden">
      <div className="container mx-auto px-4 py-8">
        {/* Header Section */}
        <div 
          ref={headerRef}
          className="text-center mb-8"
          style={{
            opacity: isHeaderInView ? 1 : 0,
            transform: isHeaderInView ? 'translateY(0)' : 'translateY(20px)',
            transition: 'opacity 0.5s ease, transform 0.5s ease'
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
            onScroll={handleScroll}
          >
            {posts.slice(0, 3).map((post, index) => (
              <div 
                key={post.id}
                className="min-w-full w-full flex-shrink-0 snap-center px-1"
              >
                <Link href={`/posts/${post.slug}`}>
                  <div className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300 h-full">
                    <div className="relative aspect-[16/9]">
                      <Image
                        src={getImageUrl(post.thumbnail)}
                        alt={post.title}
                        fill
                        sizes="(max-width: 768px) 100vw, 50vw"
                        className="object-cover"
                        priority={index === 0}
                        loading={index === 0 ? "eager" : "lazy"}
                      />
                      {post.category && (
                        <span className="absolute top-3 left-3 px-3 py-1 bg-white/90 backdrop-blur-sm text-neutral-900 text-xs font-medium rounded-full">
                          {post.category.title}
                        </span>
                      )}
                    </div>
                    <div className="p-4">
                      <h2 className="text-xl font-semibold text-neutral-900 mb-2 line-clamp-2">
                        {post.title}
                      </h2>
                      <p className="text-neutral-600 text-sm line-clamp-2">
                        {post.excerpt}
                      </p>
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>
          
          {/* Dot Indicators */}
          <div className="flex justify-center mt-4 gap-2">
            {posts.slice(0, 3).map((_, index) => (
              <button
                key={index}
                onClick={() => handleDotClick(index)}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  activeIndex === index 
                    ? 'bg-neutral-900 w-4' 
                    : 'bg-neutral-300'
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>

        {/* CTA Buttons */}
        <div 
          className="mt-8 flex flex-wrap justify-center gap-3"
          style={{
            opacity: isHeaderInView ? 1 : 0,
            transform: isHeaderInView ? 'translateY(0)' : 'translateY(20px)',
            transition: 'opacity 0.5s ease 0.3s, transform 0.5s ease 0.3s'
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