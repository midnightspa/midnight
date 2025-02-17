'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Poppins } from 'next/font/google';

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

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('/api/categories');
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

  // Filter categories based on search query
  const filteredCategories = categories.filter(category => 
    category.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    category.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-neutral-200 border-t-neutral-900 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-white ${poppins.className}`}>
      {/* Breadcrumb */}
      <div className="bg-neutral-50 border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center space-x-2 text-sm">
            <Link href="/" className="text-neutral-600 hover:text-neutral-900">
              Home
            </Link>
            <span className="text-neutral-400">/</span>
            <span className="text-neutral-900">Categories</span>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-br from-neutral-100 to-neutral-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl">
            <h1 className="text-4xl font-bold text-neutral-900 mb-4">
              Categories
            </h1>
            <p className="text-xl text-neutral-600">
              Explore our diverse range of topics and find the content that interests you the most.
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-12 gap-8">
          {/* Main Content Area - 9 columns */}
          <div className="col-span-12 lg:col-span-9">
            {/* Filters Bar */}
            <div className="bg-white p-4 rounded-xl shadow-sm mb-8">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search categories..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border border-neutral-200 pl-10 focus:outline-none focus:ring-2 focus:ring-neutral-900"
                />
                <svg
                  className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400"
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
              </div>
            </div>

            {/* Categories Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCategories.map((category) => (
                <div key={category.id} className="space-y-4">
                  {/* Category Card */}
                  <Link
                    href={`/categories/${category.slug}`}
                    className="group block bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow"
                  >
                    <div className="aspect-video relative">
                      <Image
                        src={category.thumbnail || '/placeholder.jpg'}
                        alt={category.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <div className="p-6">
                      <h2 className="text-xl font-semibold text-neutral-900 group-hover:text-blue-600 transition-colors mb-2">
                        {category.title}
                      </h2>
                      <p className="text-neutral-600 mb-4 line-clamp-2">
                        {category.description || 'Explore articles and content in this category.'}
                      </p>
                      <div className="flex items-center justify-between text-sm text-neutral-500">
                        <span>{category.subcategories.length} Subcategories</span>
                        <span className="text-blue-600 group-hover:translate-x-1 transition-transform">
                          Explore →
                        </span>
                      </div>
                    </div>
                  </Link>

                  {/* Subcategories List */}
                  {category.subcategories.length > 0 && (
                    <div className="space-y-2">
                      {category.subcategories.map((subcategory) => (
                        <Link
                          key={subcategory.id}
                          href={`/categories/${category.slug}/${subcategory.slug}`}
                          className="block bg-white rounded-lg p-3 hover:bg-neutral-50 transition-colors"
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-neutral-700 hover:text-blue-600 transition-colors">
                              {subcategory.title}
                            </span>
                            <span className="text-sm text-neutral-400">
                              {subcategory._count?.posts || 0} posts
                            </span>
                          </div>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {filteredCategories.length === 0 && (
              <div className="bg-white rounded-xl shadow-sm p-12 text-center">
                <h3 className="text-xl font-semibold text-neutral-900 mb-2">No categories found</h3>
                <p className="text-neutral-600">
                  Try adjusting your search query.
                </p>
              </div>
            )}
          </div>

          {/* Sidebar - 3 columns */}
          <div className="col-span-12 lg:col-span-3 space-y-6">
            {/* Popular Categories */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-lg font-semibold text-neutral-900 mb-4">Popular Categories</h3>
              <div className="space-y-2">
                {categories.slice(0, 5).map((category) => (
                  <Link
                    key={category.id}
                    href={`/categories/${category.slug}`}
                    className="block py-2 px-3 rounded-lg hover:bg-neutral-50 text-neutral-600 hover:text-neutral-900 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <span>{category.title}</span>
                      <span className="text-sm text-neutral-400">{category.subcategories.length}</span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* Quick Stats */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-lg font-semibold text-neutral-900 mb-4">Quick Stats</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-neutral-600">Total Categories</span>
                  <span className="font-semibold text-neutral-900">{categories.length}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-neutral-600">Total Subcategories</span>
                  <span className="font-semibold text-neutral-900">
                    {categories.reduce((total, cat) => total + cat.subcategories.length, 0)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 