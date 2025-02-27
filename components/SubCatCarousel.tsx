'use client';

import React, { useRef, useState, useEffect } from 'react';
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
  const carouselRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [imageHeight, setImageHeight] = useState(0);
  
  // Number of items to show based on screen size
  const getItemsPerView = () => {
    if (typeof window !== 'undefined') {
      if (window.innerWidth < 640) return 1.5; // Mobile
      if (window.innerWidth < 768) return 2.5; // Small tablets
      if (window.innerWidth < 1024) return 3.5; // Tablets
      if (window.innerWidth < 1280) return 4; // Small desktops
      return 5; // Large desktops
    }
    return 5; // Default for SSR
  };
  
  const [itemsPerView, setItemsPerView] = useState(5);
  
  // Update items per view on resize and calculate image height
  useEffect(() => {
    const handleResize = () => {
      setItemsPerView(getItemsPerView());
      
      // Calculate image height for arrow positioning
      if (carouselRef.current) {
        const itemWidth = carouselRef.current.clientWidth / getItemsPerView();
        // For square images, height equals width
        setImageHeight(itemWidth);
      }
    };
    
    // Set initial values
    handleResize();
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  // Intersection observer to detect when carousel is in view
  useEffect(() => {
    if (!carouselRef.current) return;
    
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { threshold: 0.1 }
    );
    
    observer.observe(carouselRef.current);
    return () => observer.disconnect();
  }, []);
  
  // Handle navigation
  const scrollToIndex = (index: number) => {
    if (!carouselRef.current) return;
    
    const newIndex = Math.max(0, Math.min(index, subcategories.length - itemsPerView));
    const itemWidth = carouselRef.current.clientWidth / itemsPerView;
    
    carouselRef.current.scrollTo({
      left: newIndex * itemWidth,
      behavior: 'smooth'
    });
    
    setActiveIndex(newIndex);
  };
  
  // Debug function to check if right arrow should be visible
  const shouldShowRightArrow = () => {
    return activeIndex < Math.max(0, subcategories.length - Math.floor(itemsPerView));
  };
  
  const handleScrollLeft = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    scrollToIndex(activeIndex - 1);
  };
  
  const handleScrollRight = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    scrollToIndex(activeIndex + 1);
  };
  
  // Handle scroll event to update active index
  const handleScroll = () => {
    if (!carouselRef.current || !isVisible) return;
    
    const scrollPosition = carouselRef.current.scrollLeft;
    const itemWidth = carouselRef.current.clientWidth / itemsPerView;
    const newIndex = Math.round(scrollPosition / itemWidth);
    
    if (newIndex !== activeIndex) {
      setActiveIndex(newIndex);
    }
  };
  
  // Touch handlers for mobile swipe
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
  };
  
  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };
  
  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;
    
    if (isLeftSwipe) {
      scrollToIndex(activeIndex + 1);
    } else if (isRightSwipe) {
      scrollToIndex(activeIndex - 1);
    }
    
    setTouchStart(null);
    setTouchEnd(null);
  };
  
  return (
    <section className="py-16 bg-neutral-50">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <h2 className="text-3xl md:text-4xl font-bold text-neutral-900">Top trending topics</h2>
          <p className="text-lg text-neutral-600 mt-2">
            Discover {subcategories.length} topics
          </p>
        </div>

        <div className="relative">
          {/* Carousel Container */}
          <div 
            ref={carouselRef}
            className="flex overflow-x-auto snap-x snap-mandatory scrollbar-hide pb-8"
            style={{
              scrollbarWidth: 'none',
              msOverflowStyle: 'none',
              WebkitOverflowScrolling: 'touch',
              scrollSnapType: 'x mandatory'
            }}
            onScroll={handleScroll}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            {subcategories.map((subcategory, index) => (
              <Link
                key={subcategory.id}
                href={subcategory.category?.slug 
                  ? `/categories/${subcategory.category.slug}/${subcategory.slug}`
                  : `/categories/${subcategory.slug}`}
                className={`flex-shrink-0 px-2 snap-start`}
                style={{ width: `${100 / itemsPerView}%` }}
              >
                <div className="relative h-full">
                  <div className="absolute top-3 left-3 z-10">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium
                      ${index === 0 ? 'bg-blue-100 text-blue-800' : 
                        index === 1 ? 'bg-red-100 text-red-800' :
                        index === 2 ? 'bg-yellow-100 text-yellow-800' :
                        'bg-neutral-100 text-neutral-800'}`}
                    >
                      #{index + 1}
                    </span>
                  </div>
                  <div className="aspect-square relative rounded-xl overflow-hidden mb-3 bg-neutral-100">
                    <Image
                      src={subcategory.thumbnail || '/placeholder.jpg'}
                      alt={subcategory.title}
                      fill
                      sizes={`(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 20vw`}
                      className="object-cover transition-transform duration-300 hover:scale-105"
                      loading={index < itemsPerView ? "eager" : "lazy"}
                    />
                  </div>
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center
                      ${index === 0 ? 'bg-blue-100' : 
                        index === 1 ? 'bg-red-100' :
                        index === 2 ? 'bg-yellow-100' :
                        'bg-neutral-100'}`}
                    >
                      <span className="text-xl">🎯</span>
                    </div>
                    <div>
                      <h3 className="text-base font-semibold text-neutral-900 line-clamp-1">
                        {subcategory.title}
                      </h3>
                      <p className="text-xs text-neutral-500">
                        {subcategory._count.posts} Articles
                      </p>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* Navigation Arrows - Completely redesigned */}
          <div className="absolute top-0 left-0 right-0 h-0 z-20">
            {/* Left Arrow - Always visible but disabled when at the beginning */}
            <div 
              className="absolute left-2 md:left-0 top-0"
              style={{ transform: `translateY(${imageHeight / 2}px)` }}
            >
              <button
                onClick={handleScrollLeft}
                disabled={activeIndex <= 0}
                className={`flex items-center justify-center w-12 h-12 bg-white rounded-full shadow-lg border border-neutral-100 transition-colors focus:outline-none focus:ring-2 focus:ring-neutral-300 ${
                  activeIndex <= 0 
                    ? 'opacity-50 cursor-not-allowed' 
                    : 'hover:bg-neutral-50'
                }`}
                aria-label="Previous items"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M15 19L8 12L15 5" stroke="#111827" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </div>
            
            {/* Right Arrow - Always visible but disabled when at the end */}
            <div 
              className="absolute right-2 md:right-0 top-0"
              style={{ transform: `translateY(${imageHeight / 2}px)` }}
            >
              <button
                onClick={handleScrollRight}
                disabled={!shouldShowRightArrow()}
                className={`flex items-center justify-center w-12 h-12 bg-white rounded-full shadow-lg border border-neutral-100 transition-colors focus:outline-none focus:ring-2 focus:ring-neutral-300 ${
                  !shouldShowRightArrow() 
                    ? 'opacity-50 cursor-not-allowed' 
                    : 'hover:bg-neutral-50'
                }`}
                aria-label="Next items"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M9 5L16 12L9 19" stroke="#111827" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </div>
          </div>
          
          {/* Dot Indicators (mobile only) */}
          <div className="flex justify-center mt-2 gap-1.5 md:hidden">
            {Array.from({ length: Math.ceil(subcategories.length / itemsPerView) }).map((_, index) => (
              <button
                key={index}
                onClick={() => scrollToIndex(index)}
                className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                  Math.floor(activeIndex) === index 
                    ? 'bg-neutral-900 w-3' 
                    : 'bg-neutral-300'
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}