'use client';

import React, { useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Poppins } from 'next/font/google';
const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
});

interface SubCategory {
  id: string;
  title: string;
  slug: string;
  thumbnail: string;
  _count: {
    posts: number;
  };
}

interface Post {
  id: string;
  title: string;
  slug: string;
  thumbnail: string;
  excerpt: string;
  createdAt: string;
  category?: {
    title: string;
    slug: string;
  };
  subcategory?: {
    title: string;
    slug: string;
  };
  author: {
    name: string;
  };
}

interface Video {
  id: string;
  title: string;
  description: string;
  youtubeUrl: string;
  thumbnail: string;
  slug: string;
}

interface HomeClientProps {
  subcategories: SubCategory[];
  posts: Post[];
  videos: Video[];
}

export default function HomeClient({ subcategories, posts, videos }: HomeClientProps) {
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
    <main className={poppins.className}>
      {/* Hero Section */}
      <section className="relative h-[70vh] bg-gradient-to-br from-neutral-100 to-neutral-50">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10"></div>
        <div className="container mx-auto px-4 h-full flex items-center">
          <div className="max-w-2xl relative">
            <div className="absolute -top-10 -left-10 w-20 h-20 bg-neutral-900 rounded-full opacity-5"></div>
            <h1 className="text-6xl font-bold text-neutral-900 mb-6 leading-tight">
              Discover Amazing <span className="text-neutral-700">Content</span>
            </h1>
            <p className="text-xl text-neutral-600 mb-8 leading-relaxed">
              Explore our collection of articles, videos, and insights about the topics that matter to you.
            </p>
            <div className="flex gap-4">
              <Link
                href="/categories"
                className="inline-flex items-center px-8 py-4 bg-neutral-900 text-white rounded-lg hover:bg-neutral-800 transition-all transform hover:scale-105 shadow-lg"
              >
                Explore Categories
              </Link>
              <Link
                href="/videos"
                className="inline-flex items-center px-8 py-4 bg-white text-neutral-900 rounded-lg hover:bg-neutral-50 transition-all transform hover:scale-105 shadow-lg border border-neutral-200"
              >
                Watch Videos
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Trending Topics Carousel */}
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
                  href={`/categories/${subcategory.slug}`}
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
                        src={subcategory.thumbnail}
                        alt={subcategory.title}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        priority={index < 3}
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
              className="absolute left-0 top-1/2 -translate-y-1/2 w-14 h-14 flex items-center justify-center bg-white/90 backdrop-blur-sm rounded-full shadow-lg hover:shadow-xl hover:bg-white transition-all duration-300 -ml-7 z-10 group"
            >
              <svg 
                className="w-6 h-6 text-gray-800 transform group-hover:scale-110 transition-transform duration-300" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2.5} 
                  d="M15 19l-7-7 7-7"
                />
              </svg>
              <div className="absolute inset-0 rounded-full border border-gray-200 group-hover:border-gray-300 transition-colors duration-300"></div>
            </button>
            <button
              onClick={handleScrollRight}
              className="absolute right-0 top-1/2 -translate-y-1/2 w-14 h-14 flex items-center justify-center bg-white/90 backdrop-blur-sm rounded-full shadow-lg hover:shadow-xl hover:bg-white transition-all duration-300 -mr-7 z-10 group"
            >
              <svg 
                className="w-6 h-6 text-gray-800 transform group-hover:scale-110 transition-transform duration-300" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2.5} 
                  d="M9 5l7 7-7 7"
                />
              </svg>
              <div className="absolute inset-0 rounded-full border border-gray-200 group-hover:border-gray-300 transition-colors duration-300"></div>
            </button>
          </div>
        </div>
      </section>

      {/* Latest Posts Grid */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-end mb-12">
            <div>
              <span className="text-sm font-medium text-neutral-500 uppercase tracking-wider">Latest Updates</span>
              <h2 className="text-3xl font-semibold text-neutral-900 mt-1">From The Blog</h2>
            </div>
            <Link href="/posts" className="text-neutral-900 font-medium hover:text-neutral-700">
              View All Posts →
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post) => (
              <Link
                key={post.id}
                href={`/posts/${post.slug}`}
                className="group block"
              >
                <div className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300">
                  <div className="relative h-48">
                    <Image
                      src={post.thumbnail}
                      alt={post.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="p-6">
                    {post.subcategory && (
                      <span className="text-sm font-medium text-blue-600 mb-2 block">
                        {post.subcategory.title}
                      </span>
                    )}
                    <h3 className="text-xl font-semibold text-neutral-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
                      {post.title}
                    </h3>
                    <p className="text-neutral-600 mb-4 line-clamp-2">
                      {post.excerpt}
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-neutral-200"></div>
                        <span className="text-sm text-neutral-600">
                          {post.author.name}
                        </span>
                      </div>
                      <span className="text-neutral-900 font-medium group-hover:text-blue-600 transition-colors">
                        Read More →
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Videos Section */}
      {videos.length > 0 && (
        <section className="py-16 bg-neutral-100">
          <div className="container mx-auto px-4">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-3xl font-semibold text-neutral-900">Latest Videos</h2>
              <Link
                href="/videos"
                className="text-blue-600 hover:text-blue-700 font-medium"
              >
                View All →
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {videos.map((video) => (
                <Link
                  key={video.id}
                  href={`/videos/${video.slug}`}
                  className="group block"
                >
                  <div className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300">
                    <div className="aspect-video relative">
                      <Image
                        src={video.thumbnail}
                        alt={video.title}
                        fill
                        className="object-cover"
                      />
                      <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                        <div className="w-16 h-16 rounded-full bg-white/90 flex items-center justify-center transform group-hover:scale-110 transition-transform">
                          <svg className="w-8 h-8 text-neutral-900" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M6.3 2.841A1.5 1.5 0 004 4.11v11.78a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
                          </svg>
                        </div>
                      </div>
                    </div>
                    <div className="p-6">
                      <h3 className="text-xl font-semibold text-neutral-900 mb-2 group-hover:text-neutral-700">
                        {video.title}
                      </h3>
                      <p className="text-neutral-600 mb-4 line-clamp-2">
                        {video.description}
                      </p>
                      <span className="text-neutral-900 font-medium group-hover:translate-x-1 transition-transform inline-block">
                        Watch Now →
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Newsletter Section */}
      <section className="py-20 bg-neutral-50">
        <div className="container mx-auto px-4 max-w-4xl text-center">
          <span className="text-sm font-medium text-neutral-500 uppercase tracking-wider">Newsletter</span>
          <h2 className="text-3xl font-semibold text-neutral-900 mt-1 mb-4">Stay Updated</h2>
          <p className="text-neutral-600 mb-8 text-lg">
            Subscribe to our newsletter to receive the latest updates and exclusive content.
          </p>
          <form className="flex gap-4 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 rounded-lg border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-neutral-900"
            />
            <button
              type="submit"
              className="px-6 py-3 bg-neutral-900 text-white rounded-lg hover:bg-neutral-800 transition-all transform hover:scale-105"
            >
              Subscribe
            </button>
          </form>
          <p className="mt-4 text-sm text-neutral-500">
            We respect your privacy. Unsubscribe at any time.
          </p>
        </div>
      </section>
    </main>
  );
} 