'use client';

import React, { useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Disclosure } from '@headlessui/react';
import { motion } from 'framer-motion';
import { FiChevronDown } from 'react-icons/fi';

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

  const handleScrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollLeft -= 300;
    }
  };

  const handleScrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollLeft += 300;
    }
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
            className="flex gap-6 overflow-x-auto pb-8 -mx-4 px-4 scroll-smooth hide-scrollbar"
          >
            {subcategories.map((subcategory, index) => (
              <Link
                key={subcategory.id}
                href={subcategory.category?.slug 
                  ? `/categories/${subcategory.category.slug}/${subcategory.slug}`
                  : `/categories/${subcategory.slug}`}
                className="flex-none w-72 group"
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
                  <div className="aspect-square relative rounded-2xl overflow-hidden mb-4">
                    <Image
                      src={subcategory.thumbnail || '/placeholder.jpg'}
                      alt={subcategory.title}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      className="object-cover group-hover:scale-110 transition-transform duration-300"
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
                      <h3 className="text-xl font-semibold text-neutral-900 group-hover:text-neutral-700">
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
          <button
            onClick={handleScrollLeft}
            className="absolute left-0 top-1/2 -translate-y-1/2 w-12 h-12 flex items-center justify-center bg-white/80 rounded-full shadow-lg hover:bg-white transition-colors -ml-6 z-10"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            onClick={handleScrollRight}
            className="absolute right-0 top-1/2 -translate-y-1/2 w-12 h-12 flex items-center justify-center bg-white/80 rounded-full shadow-lg hover:bg-white transition-colors -mr-6 z-10"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    </section>
  );
}