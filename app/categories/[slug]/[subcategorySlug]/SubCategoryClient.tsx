'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { Poppins } from 'next/font/google';

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
});

interface Post {
  id: string;
  title: string;
  excerpt: string;
  thumbnail: string | null;
  createdAt: string;
  category: {
    id: string;
    title: string;
    slug: string;
  };
  subcategory?: {
    id: string;
    title: string;
    slug: string;
  };
  tags: string[];
  slug: string;
}

interface Category {
  id: string;
  title: string;
  description: string | null;
  slug: string;
  subcategories: {
    id: string;
    title: string;
    slug: string;
    _count: {
      posts: number;
    };
  }[];
}

interface SubCategory {
  id: string;
  title: string;
  description: string | null;
  slug: string;
  category: {
    id: string;
    title: string;
    slug: string;
  };
}

export default function SubCategoryClient() {
  const params = useParams();
  const router = useRouter();
  const [category, setCategory] = useState<Category | null>(null);
  const [subcategory, setSubcategory] = useState<SubCategory | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<string>('newest');
  const [searchQuery, setSearchQuery] = useState<string>('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setError(null);
        setLoading(true);

        const resolvedParams = await params;
        const categorySlug = resolvedParams.slug;
        const subcategorySlug = resolvedParams.subcategorySlug;

        if (!categorySlug || !subcategorySlug || 
            typeof categorySlug !== 'string' || 
            typeof subcategorySlug !== 'string') {
          setError('Invalid URL');
          return;
        }

        // Fetch category data
        const categoryRes = await fetch(`/api/categories/${categorySlug}`);
        if (!categoryRes.ok) {
          const categoryError = await categoryRes.json();
          throw new Error(categoryError.error || 'Failed to fetch category');
        }
        const categoryData = await categoryRes.json();
        setCategory(categoryData);

        // Find the subcategory from the category data
        const subcategoryData = categoryData.subcategories.find(
          (sub: any) => sub.slug === subcategorySlug
        );
        if (!subcategoryData) {
          throw new Error('Subcategory not found');
        }
        setSubcategory(subcategoryData);

        // Fetch posts for this subcategory
        const postsRes = await fetch(`/api/posts?subcategory=${subcategorySlug}`);
        if (!postsRes.ok) {
          const postsError = await postsRes.json();
          throw new Error(postsError.error || 'Failed to fetch posts');
        }
        const postsData = await postsRes.json();
        setPosts(postsData);

      } catch (error) {
        console.error('Error fetching data:', error);
        setError(error instanceof Error ? error.message : 'Failed to fetch data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [params]);

  // Filter and sort posts
  const filteredPosts = posts
    .filter(post => {
      const matchesSearch = !searchQuery || 
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesSearch;
    })
    .sort((a, b) => {
      if (sortBy === 'newest') {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      } else {
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      }
    });

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-neutral-200 border-t-neutral-900 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-semibold text-neutral-900 mb-4">Error</h1>
          <p className="text-neutral-600 mb-6">{error}</p>
          <Link href="/" className="text-blue-600 hover:underline">
            Return to homepage
          </Link>
        </div>
      </div>
    );
  }

  if (!category || !subcategory) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-semibold text-neutral-900">Page not found</h1>
          <Link href="/" className="text-blue-600 hover:underline mt-4 inline-block">
            Return to homepage
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-white ${poppins.className}`}>
      {/* Breadcrumb */}
      <div className="bg-neutral-50 border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center space-x-2 text-sm">
            <Link href="/categories" className="text-neutral-600 hover:text-neutral-900">
              Categories
            </Link>
            <span className="text-neutral-400">/</span>
            <Link 
              href={`/categories/${category.slug}`} 
              className="text-neutral-600 hover:text-neutral-900"
            >
              {category.title}
            </Link>
            <span className="text-neutral-400">/</span>
            <span className="text-neutral-900">{subcategory.title}</span>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-br from-neutral-100 to-neutral-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl">
            <h1 className="text-4xl font-bold text-neutral-900 mb-4">
              {subcategory.title}
            </h1>
            {subcategory.description && (
              <p className="text-xl text-neutral-600">
                {subcategory.description}
              </p>
            )}
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        {/* Grid Layout */}
        <div className="grid grid-cols-12 gap-8">
          {/* Main Content Area - 9 columns */}
          <div className="col-span-12 lg:col-span-9">
            {/* Filters Bar */}
            <div className="bg-white p-4 rounded-xl shadow-sm mb-8">
              <div className="flex flex-wrap gap-4 items-center justify-between">
                <div className="flex items-center gap-4">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="px-3 py-2 rounded-lg border border-neutral-200 text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900"
                  >
                    <option value="newest">Newest First</option>
                    <option value="oldest">Oldest First</option>
                  </select>
                </div>
                <div className="flex-1 max-w-md">
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Search posts..."
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
              </div>
            </div>

            {/* Posts Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPosts.map((post) => (
                <Link
                  key={post.id}
                  href={`/posts/${post.slug}`}
                  className="group bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow"
                >
                  <div className="aspect-video relative">
                    <Image
                      src={post.thumbnail || '/placeholder.jpg'}
                      alt={post.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="text-lg font-semibold text-neutral-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
                      {post.title}
                    </h3>
                    <p className="text-neutral-600 text-sm mb-4 line-clamp-2">
                      {post.excerpt}
                    </p>
                    <div className="flex items-center justify-end">
                      <time className="text-sm text-neutral-500" dateTime={new Date(post.createdAt).toISOString()}>
                        {new Date(post.createdAt).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric'
                        })}
                      </time>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {filteredPosts.length === 0 && (
              <div className="bg-white rounded-xl shadow-sm p-12 text-center">
                <h3 className="text-xl font-semibold text-neutral-900 mb-2">No posts found</h3>
                <p className="text-neutral-600">
                  No posts available in this subcategory yet.
                </p>
              </div>
            )}
          </div>

          {/* Sidebar - 3 columns */}
          <div className="col-span-12 lg:col-span-3 space-y-6">
            {/* Category Info */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-lg font-semibold text-neutral-900 mb-4">About This Category</h3>
              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-medium text-neutral-700">Category</h4>
                  <p className="text-neutral-600">{category.title}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-neutral-700">Subcategory</h4>
                  <p className="text-neutral-600">{subcategory.title}</p>
                </div>
                {subcategory.description && (
                  <div>
                    <h4 className="text-sm font-medium text-neutral-700">Description</h4>
                    <p className="text-neutral-600">{subcategory.description}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Other Subcategories */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-lg font-semibold text-neutral-900 mb-4">Other Subcategories</h3>
              <div className="space-y-2">
                {category.subcategories
                  .filter(sub => sub.slug !== subcategory.slug)
                  .map(sub => (
                    <Link
                      key={sub.id}
                      href={`/categories/${category.slug}/${sub.slug}`}
                      className="block py-2 px-3 rounded-lg hover:bg-neutral-50 text-neutral-600 hover:text-neutral-900 transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <span>{sub.title}</span>
                        <span className="text-sm text-neutral-400">{sub._count.posts}</span>
                      </div>
                    </Link>
                  ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 