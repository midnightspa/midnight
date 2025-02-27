'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Poppins } from 'next/font/google';
import { motion } from 'framer-motion';
import { useDebounce } from '@/hooks/useDebounce';
import ClientOnly from '@/components/ClientOnly';

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
});

interface Category {
  id: string;
  title: string;
  description: string;
  thumbnail: string | null;
  slug: string;
  subcategories: any[];
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

const toBase64 = (str: string) =>
  typeof window === 'undefined'
    ? Buffer.from(str).toString('base64')
    : window.btoa(str);

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'grid' | 'list'>('grid');
  const [isSearching, setIsSearching] = useState(false);

  // Debounce search query
  const debouncedSearch = useDebounce(searchQuery, 300);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/categories', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        if (!response.ok) throw new Error('Failed to fetch categories');
        const data = await response.json();
        setCategories(data);
      } catch (error) {
        console.error('Error fetching categories:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    const searchCategories = async () => {
      try {
        setIsSearching(true);
        if (!debouncedSearch) {
          const response = await fetch('/api/categories', {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
          });
          if (!response.ok) throw new Error('Failed to fetch categories');
          const data = await response.json();
          setCategories(data);
          return;
        }

        const response = await fetch(`/api/categories/search?q=${encodeURIComponent(debouncedSearch)}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        if (!response.ok) throw new Error('Failed to search categories');
        const data = await response.json();
        setCategories(data);
      } catch (error) {
        console.error('Error searching categories:', error);
      } finally {
        setIsSearching(false);
      }
    };

    searchCategories();
  }, [debouncedSearch]);

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-neutral-200 border-t-neutral-900 rounded-full animate-spin"></div>
      </div>
    );
  }

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <div className={`min-h-screen bg-neutral-50 ${poppins.className}`}>
      {/* Hero Section with Pattern Background */}
      <section className="relative py-24 bg-gradient-to-br from-neutral-900 to-neutral-800 overflow-hidden">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10"></div>
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10"></div>
        <div className="container mx-auto px-4 relative">
          <ClientOnly>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="max-w-4xl mx-auto text-center"
            >
              <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
                Explore Our Categories
              </h1>
              <p className="text-xl text-white/80 mb-8">
                Discover a wide range of topics and find exactly what you're looking for
              </p>
            </motion.div>
          </ClientOnly>
          
          {/* Search Bar */}
          <div className="max-w-2xl mx-auto mt-8">
            <div className="relative">
              <input
                type="text"
                placeholder="Search categories..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-6 py-4 bg-white/90 backdrop-blur-sm rounded-full shadow-lg text-neutral-900 focus:outline-none focus:ring-2 focus:ring-neutral-900"
              />
              <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                {isSearching ? (
                  <div className="w-6 h-6 border-2 border-neutral-300 border-t-neutral-900 rounded-full animate-spin"></div>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-neutral-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Grid */}
      <section className="py-16 container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-neutral-900">All Categories</h2>
          <div className="flex space-x-2">
            <button
              onClick={() => setActiveTab('grid')}
              className={`p-2 rounded ${
                activeTab === 'grid' ? 'bg-neutral-900 text-white' : 'bg-white text-neutral-900'
              }`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
                />
              </svg>
            </button>
            <button
              onClick={() => setActiveTab('list')}
              className={`p-2 rounded ${
                activeTab === 'list' ? 'bg-neutral-900 text-white' : 'bg-white text-neutral-900'
              }`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          </div>
        </div>

        {categories.length === 0 ? (
          <div className="text-center py-12">
            <h3 className="text-2xl font-medium text-neutral-700">No categories found</h3>
            <p className="text-neutral-500 mt-2">Try a different search term</p>
          </div>
        ) : activeTab === 'grid' ? (
          <ClientOnly>
            <motion.div
              variants={container}
              initial="hidden"
              animate="show"
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {categories.map((category) => (
                <motion.div key={category.id} variants={item}>
                  <Link href={`/categories/${category.slug}`}>
                    <div className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
                      <div className="relative h-48">
                        <Image
                          src={category.thumbnail || '/placeholder.jpg'}
                          alt={category.title}
                          fill
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                          className="object-cover"
                          placeholder="blur"
                          blurDataURL={`data:image/svg+xml;base64,${toBase64(shimmer(700, 475))}`}
                        />
                      </div>
                      <div className="p-6">
                        <h3 className="text-xl font-semibold text-neutral-900 mb-2">{category.title}</h3>
                        <p className="text-neutral-600 line-clamp-2">{category.description}</p>
                        <div className="mt-4 flex justify-between items-center">
                          <span className="text-sm text-neutral-500">{category.subcategories.length} subcategories</span>
                          <span className="inline-flex items-center text-neutral-900 font-medium">
                            View
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-4 w-4 ml-1"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M9 5l7 7-7 7"
                              />
                            </svg>
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          </ClientOnly>
        ) : (
          <div className="space-y-4">
            {categories.map((category) => (
              <div key={category.id} className="bg-white rounded-xl p-6 shadow-md">
                <div className="flex items-start gap-6">
                  <div className="relative w-24 h-24 flex-shrink-0 rounded-lg overflow-hidden">
                    <Image
                      src={category.thumbnail || '/placeholder.jpg'}
                      alt={category.title}
                      fill
                      sizes="96px"
                      className="object-cover"
                      placeholder="blur"
                      blurDataURL={`data:image/svg+xml;base64,${toBase64(shimmer(96, 96))}`}
                    />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-neutral-900 mb-2">{category.title}</h3>
                    <p className="text-neutral-600 mb-4">{category.description}</p>
                    <Link
                      href={`/categories/${category.slug}`}
                      className="inline-flex items-center text-neutral-900 font-medium"
                    >
                      View Category
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 ml-1"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
} 