'use client';

import React, { useRef, useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

interface SubCategory {
  id: string;
  title: string;
  slug: string;
  thumbnail: string | null;
  _count: {
    posts: number;
  };
  category: {
    id: string;
    title: string;
    slug: string;
  };
}

interface SubCatCarouselProps {
  subcategories: SubCategory[];
}

export default function SubCatCarousel({ subcategories }: SubCatCarouselProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [currentIndex, setCurrentIndex] = useState(0);
  const itemsPerView = 5;

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const handleWheel = (e: WheelEvent) => {
      if (e.deltaY !== 0) {
        e.preventDefault();
        if (e.deltaY > 0) {
          handleScrollRight();
        } else {
          handleScrollLeft();
        }
      }
    };

    container.addEventListener('wheel', handleWheel, { passive: false });
    return () => container.removeEventListener('wheel', handleWheel);
  }, [currentIndex]);

  const scrollToIndex = (index: number) => {
    if (!scrollContainerRef.current) return;
    const itemWidth = scrollContainerRef.current.clientWidth / itemsPerView;
    const gap = 24; // gap-6 = 1.5rem = 24px
    
    scrollContainerRef.current.scrollTo({
      left: index * (itemWidth + gap),
      behavior: 'smooth'
    });
    setCurrentIndex(index);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!scrollContainerRef.current) return;
    setIsDragging(true);
    setStartX(e.pageX - scrollContainerRef.current.offsetLeft);
    setScrollLeft(scrollContainerRef.current.scrollLeft);
  };

  const handleMouseUp = () => {
    if (!scrollContainerRef.current || !isDragging) return;
    setIsDragging(false);
    
    const itemWidth = scrollContainerRef.current.clientWidth / itemsPerView;
    const gap = 24;
    const currentScroll = scrollContainerRef.current.scrollLeft;
    const newIndex = Math.round(currentScroll / (itemWidth + gap));
    scrollToIndex(newIndex);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !scrollContainerRef.current) return;
    e.preventDefault();
    const x = e.pageX - scrollContainerRef.current.offsetLeft;
    const walk = (x - startX) * 2;
    scrollContainerRef.current.scrollLeft = scrollLeft - walk;
  };

  const handleScrollLeft = () => {
    const newIndex = Math.max(currentIndex - 1, 0);
    scrollToIndex(newIndex);
  };

  const handleScrollRight = () => {
    const newIndex = Math.min(currentIndex + 1, subcategories.length - itemsPerView);
    scrollToIndex(newIndex);
  };

  return (
    <section className="py-20 bg-neutral-50">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <h2 className="text-4xl font-bold text-neutral-900">Top trending topics</h2>
          <p className="text-lg text-neutral-600 mt-2">
            Discover {subcategories.length} topics
          </p>
        </div>

        <div className="relative">
          <div 
            ref={scrollContainerRef}
            className="grid grid-cols-5 gap-6 overflow-x-auto pb-8 -mx-4 px-4 scroll-smooth hide-scrollbar"
            style={{
              scrollbarWidth: 'none',
              msOverflowStyle: 'none',
              WebkitOverflowScrolling: 'touch',
              gridAutoFlow: 'column',
              gridAutoColumns: '20%',
            }}
            onMouseDown={handleMouseDown}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onMouseMove={handleMouseMove}
          >
            {subcategories.map((subcategory, index) => (
              <Link
                key={subcategory.id}
                href={subcategory.category?.slug 
                  ? `/categories/${subcategory.category.slug}/${subcategory.slug}`
                  : `/categories/${subcategory.slug}`}
                className="block"
                onClick={(e) => {
                  if (isDragging) {
                    e.preventDefault();
                  }
                }}
              >
                <div className="relative">
                  <div className="absolute top-4 left-4 z-10">
                    <span className={`px-2 py-1 rounded-full text-sm font-medium
                      ${index === 0 ? 'bg-blue-100 text-blue-800' : 
                        index === 1 ? 'bg-red-100 text-red-800' :
                        index === 2 ? 'bg-yellow-100 text-yellow-800' :
                        'bg-neutral-100 text-neutral-800'}`}
                    >
                      #{index + 1}
                    </span>
                  </div>
                  <div className="aspect-square relative rounded-2xl overflow-hidden mb-4 bg-neutral-100">
                    <Image
                      src={subcategory.thumbnail || '/placeholder.jpg'}
                      alt={subcategory.title}
                      fill
                      sizes="20vw"
                      className="object-cover group-hover:scale-110 transition-transform duration-300"
                      priority={index < itemsPerView}
                    />
                  </div>
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center
                      ${index === 0 ? 'bg-blue-100' : 
                        index === 1 ? 'bg-red-100' :
                        index === 2 ? 'bg-yellow-100' :
                        'bg-neutral-100'}`}
                    >
                      <span className="text-2xl">🎯</span>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-neutral-900 group-hover:text-neutral-700 line-clamp-1">
                        {subcategory.title}
                      </h3>
                      <p className="text-sm text-neutral-500">
                        {subcategory._count.posts} Articles
                      </p>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* Navigation Buttons */}
          {currentIndex > 0 && (
            <button
              onClick={handleScrollLeft}
              className="absolute left-0 top-1/2 -translate-y-1/2 w-12 h-12 flex items-center justify-center bg-white/80 backdrop-blur-sm rounded-full shadow-lg hover:bg-white transition-colors -ml-6 z-10"
              aria-label="Previous item"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
          )}
          {currentIndex < subcategories.length - itemsPerView && (
            <button
              onClick={handleScrollRight}
              className="absolute right-0 top-1/2 -translate-y-1/2 w-12 h-12 flex items-center justify-center bg-white/80 backdrop-blur-sm rounded-full shadow-lg hover:bg-white transition-colors -mr-6 z-10"
              aria-label="Next item"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          )}
        </div>
      </div>
    </section>
  );
}