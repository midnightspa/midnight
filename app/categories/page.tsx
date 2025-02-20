'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Poppins } from 'next/font/google';
import { motion } from 'framer-motion';
import { useDebounce } from '@/hooks/useDebounce';

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
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl mx-auto text-center"
          >
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
              Explore Our Categories
            </h1>
            <p className="text-xl text-neutral-200 mb-12">
              Discover a world of knowledge across our diverse range of topics
            </p>
            
            {/* Search Bar */}
            <div className="max-w-2xl mx-auto relative">
              <input
                type="text"
                placeholder="Search categories..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-6 py-4 rounded-full border-2 border-white/10 bg-white/10 backdrop-blur-sm text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/20"
              />
              {isSearching ? (
                <div className="w-6 h-6 absolute right-6 top-1/2 transform -translate-y-1/2">
                  <div className="w-4 h-4 border-2 border-white/60 border-t-transparent rounded-full animate-spin"></div>
                </div>
              ) : (
                <svg
                  className="w-6 h-6 absolute right-6 top-1/2 transform -translate-y-1/2 text-white/60"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
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
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-16">
        {/* View Toggle and Stats */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-8">
          <div className="flex items-center gap-4 mb-4 md:mb-0">
            <button
              onClick={() => setActiveTab('grid')}
              className={`px-4 py-2 rounded-lg flex items-center gap-2 ${
                activeTab === 'grid'
                  ? 'bg-neutral-900 text-white'
                  : 'bg-white text-neutral-600 hover:bg-neutral-100'
              }`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
              </svg>
              Grid
            </button>
            <button
              onClick={() => setActiveTab('list')}
              className={`px-4 py-2 rounded-lg flex items-center gap-2 ${
                activeTab === 'list'
                  ? 'bg-neutral-900 text-white'
                  : 'bg-white text-neutral-600 hover:bg-neutral-100'
              }`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
              List
            </button>
          </div>
          <div className="flex items-center gap-6 text-sm">
            <div className="bg-white px-4 py-2 rounded-lg">
              <span className="text-neutral-600">Categories:</span>
              <span className="ml-2 font-semibold text-neutral-900">{categories.length}</span>
            </div>
            <div className="bg-white px-4 py-2 rounded-lg">
              <span className="text-neutral-600">Subcategories:</span>
              <span className="ml-2 font-semibold text-neutral-900">
                {categories.reduce((total, cat) => total + cat.subcategories.length, 0)}
              </span>
            </div>
          </div>
        </div>

        {/* Categories Display */}
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className={activeTab === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'}
        >
          {categories.map((category) => (
            <motion.div key={category.id} variants={item}>
              {activeTab === 'grid' ? (
                // Grid View
                <Link
                  href={`/categories/${category.slug}`}
                  className="group block bg-white rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300"
                >
                  <div className="aspect-[16/9] relative">
                    <Image
                      src={category.thumbnail || '/placeholder.jpg'}
                      alt={category.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                      placeholder="blur"
                      blurDataURL={`data:image/svg+xml;base64,${toBase64(shimmer(700, 475))}`}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </div>
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="text-xl font-semibold text-neutral-900 group-hover:text-blue-600 transition-colors">
                        {category.title}
                      </h2>
                      <span className="px-3 py-1 bg-neutral-100 text-neutral-600 rounded-full text-sm">
                        {category.subcategories.length} Topics
                      </span>
                    </div>
                    <p className="text-neutral-600 line-clamp-2 mb-4">
                      {category.description || 'Explore articles and content in this category.'}
                    </p>
                    <div className="flex items-center text-sm text-neutral-500">
                      <span className="flex items-center group-hover:text-blue-600 transition-colors">
                        Explore Category
                        <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </span>
                    </div>
                  </div>
                </Link>
              ) : (
                // List View
                <div className="bg-white rounded-xl p-6 hover:shadow-lg transition-shadow">
                  <div className="flex items-start gap-6">
                    <div className="relative w-24 h-24 flex-shrink-0 rounded-lg overflow-hidden">
                      <Image
                        src={category.thumbnail || '/placeholder.jpg'}
                        alt={category.title}
                        fill
                        className="object-cover"
                        placeholder="blur"
                        blurDataURL={`data:image/svg+xml;base64,${toBase64(shimmer(96, 96))}`}
                      />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h2 className="text-xl font-semibold text-neutral-900">
                          {category.title}
                        </h2>
                        <span className="px-3 py-1 bg-neutral-100 text-neutral-600 rounded-full text-sm">
                          {category.subcategories.length} Topics
                        </span>
                      </div>
                      <p className="text-neutral-600 mb-4">
                        {category.description || 'Explore articles and content in this category.'}
                      </p>
                      <div className="flex items-center gap-4">
                        <Link
                          href={`/categories/${category.slug}`}
                          className="text-blue-600 hover:text-blue-700 font-medium text-sm flex items-center"
                        >
                          View Category
                          <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </Link>
                        {category.subcategories.length > 0 && (
                          <button
                            onClick={() => setSelectedCategory(selectedCategory === category.id ? null : category.id)}
                            className="text-neutral-600 hover:text-neutral-900 text-sm flex items-center"
                          >
                            Show Subcategories
                            <svg
                              className={`w-4 h-4 ml-1 transition-transform ${
                                selectedCategory === category.id ? 'rotate-180' : ''
                              }`}
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                  {/* Subcategories Expansion Panel */}
                  {selectedCategory === category.id && category.subcategories.length > 0 && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="mt-4 pt-4 border-t border-neutral-100"
                    >
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {category.subcategories.map((subcategory) => (
                          <Link
                            key={subcategory.id}
                            href={`/categories/${category.slug}/${subcategory.slug}`}
                            className="flex items-center justify-between p-2 rounded-lg hover:bg-neutral-50"
                          >
                            <span className="text-neutral-700">{subcategory.title}</span>
                            <span className="text-sm text-neutral-500">{subcategory._count?.posts || 0} posts</span>
                          </Link>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </div>
              )}
            </motion.div>
          ))}
        </motion.div>

        {categories.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl shadow-sm p-12 text-center"
          >
            <h3 className="text-xl font-semibold text-neutral-900 mb-2">No categories found</h3>
            <p className="text-neutral-600">
              Try adjusting your search query or browse our featured categories.
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
} 