'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useParams, useSearchParams } from 'next/navigation';
import { Poppins } from 'next/font/google';
import type { Metadata } from 'next';
import prisma from '@/lib/prisma';

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
  author: {
    name: string;
  };
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
  thumbnail: string | null;
  slug: string;
  subcategories: {
    id: string;
    title: string;
    slug: string;
    _count: {
      posts: number;
    };
  }[];
  seoTitle?: string;
  seoDescription?: string;
}

interface SubCategory {
  id: string;
  title: string;
  description: string | null;
  thumbnail: string | null;
  slug: string;
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const category = await prisma.postCategory.findUnique({
    where: {
      slug: params.slug,
    },
    select: {
      title: true,
      description: true,
      seoTitle: true,
      seoDescription: true,
      seoKeywords: true,
      thumbnail: true,
    },
  });

  if (!category) {
    return {
      title: 'Category Not Found',
      description: 'The requested category could not be found.',
      robots: { index: false, follow: false },
    };
  }

  const title = category.seoTitle || category.title;

  return {
    title: title,
    description: category.seoDescription || category.description || undefined,
    keywords: category.seoKeywords || undefined,
    openGraph: {
      title,
      description: category.seoDescription || category.description || undefined,
      type: 'website',
      images: category.thumbnail ? [{ url: category.thumbnail }] : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description: category.seoDescription || category.description || undefined,
      images: category.thumbnail ? [category.thumbnail] : undefined,
    },
  };
}

export default function CategoryArchive() {
  const params = useParams();
  const searchParams = useSearchParams();
  const [category, setCategory] = useState<Category | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<string>('newest');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Safely get subcategory from searchParams
  const activeSubcategory = searchParams?.get('subcategory') ?? null;

  useEffect(() => {
    const fetchData = async () => {
      try {
        setError(null);
        setLoading(true);

        const categorySlug = params?.slug;
        if (!categorySlug || typeof categorySlug !== 'string') {
          setError('Invalid category URL');
          return;
        }

        // First fetch category data
        const categoryRes = await fetch(`/api/categories/${categorySlug}`);
        
        if (!categoryRes.ok) {
          const categoryError = await categoryRes.json();
          throw new Error(categoryError.error || 'Failed to fetch category');
        }

        const categoryData = await categoryRes.json();
        setCategory(categoryData);

        // Then fetch posts only if a subcategory is selected
        if (activeSubcategory) {
          const postsRes = await fetch(`/api/posts?subcategory=${activeSubcategory}`);
          
          if (!postsRes.ok) {
            const postsError = await postsRes.json();
            throw new Error(postsError.error || 'Failed to fetch posts');
          }

          const postsData = await postsRes.json();
          setPosts(postsData);
        } else {
          // If no subcategory is selected, clear the posts
          setPosts([]);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        setError(error instanceof Error ? error.message : 'Failed to fetch data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [params?.slug, activeSubcategory]);

  // Get all unique tags from posts (with type safety)
  const allTags = Array.from(new Set(posts?.flatMap(post => post.tags || []) || []));

  // Filter and sort posts
  const filteredPosts = posts.filter(post => {
    const matchesTags = selectedTags.length === 0 || selectedTags.some(tag => post.tags.includes(tag));
    const matchesSearch = !searchQuery || 
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesTags && matchesSearch;
  }).sort((a, b) => {
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

  if (!category) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-semibold text-neutral-900">Category not found</h1>
          <Link href="/" className="text-blue-600 hover:underline mt-4 inline-block">
            Return to homepage
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-white ${poppins.className}`}>
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-br from-neutral-100 to-neutral-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl">
            <h1 className="text-4xl font-bold text-neutral-900 mb-4">
              {category.title}
            </h1>
            {category.description && (
              <p className="text-xl text-neutral-600">
                {category.description}
              </p>
            )}
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <div className="lg:w-1/4">
            <div className="bg-white rounded-xl shadow-sm p-6 sticky top-24">
              <h2 className="text-lg font-semibold text-neutral-900 mb-4">Subcategories</h2>
              <div className="space-y-2">
                <Link
                  href={`/categories/${params?.slug}`}
                  className={`block w-full text-left px-4 py-2 rounded-lg transition-colors ${
                    !activeSubcategory 
                      ? 'bg-blue-50 text-blue-700' 
                      : 'text-neutral-600 hover:bg-neutral-50'
                  }`}
                >
                  Select a Subcategory
                </Link>
                {category?.subcategories.map((subcategory) => (
                  <Link
                    key={subcategory.id}
                    href={`/categories/${params?.slug}/${subcategory.slug}`}
                    className={`block w-full text-left px-4 py-2 rounded-lg transition-colors ${
                      activeSubcategory === subcategory.slug 
                        ? 'bg-blue-50 text-blue-700' 
                        : 'text-neutral-600 hover:bg-neutral-50'
                    }`}
                  >
                    <span className="flex items-center justify-between">
                      <span>{subcategory.title}</span>
                      <span className="text-sm text-neutral-400">
                        {subcategory._count.posts}
                      </span>
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:w-3/4">
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                  <div className="p-6">
                    <h2 className="text-xl font-semibold text-neutral-900 group-hover:text-blue-600 transition-colors mb-2">
                      {post.title}
                    </h2>
                    <p className="text-neutral-600 mb-4 line-clamp-2">
                      {post.excerpt}
                    </p>
                    <div className="flex items-center justify-between text-sm text-neutral-500">
                      <span>{post.author.name}</span>
                      <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {filteredPosts.length === 0 && (
              <div className="bg-white rounded-xl shadow-sm p-12 text-center">
                <h3 className="text-xl font-semibold text-neutral-900 mb-2">No posts found</h3>
                <p className="text-neutral-600">
                  {!activeSubcategory 
                    ? 'Please select a subcategory to view posts.' 
                    : 'No posts available in this subcategory yet.'}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 