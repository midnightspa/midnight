import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Poppins } from 'next/font/google';
import prisma from '@/lib/prisma';
import type { Metadata } from 'next';

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
});

interface Post {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  thumbnail: string | null;
  createdAt: string;
  tags: string[];
  slug: string;
  category?: {
    title: string;
    slug: string;
  };
  subcategory?: {
    title: string;
    slug: string;
  };
}

interface RelatedPost {
  id: string;
  title: string;
  thumbnail: string | null;
  createdAt: string;
  slug: string;
}

// Add metadata generation
export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const post = await prisma.post.findUnique({
    where: {
      slug: params.slug,
    },
    select: {
      title: true,
      excerpt: true,
      seoTitle: true,
      seoDescription: true,
      seoKeywords: true,
      thumbnail: true,
    },
  });

  if (!post) {
    return {
      title: 'Post Not Found',
      description: 'The requested post could not be found.',
      robots: { index: false, follow: false },
    };
  }

  const title = post.seoTitle || post.title;

  return {
    title: title,
    description: post.seoDescription || post.excerpt || undefined,
    keywords: post.seoKeywords || undefined,
    openGraph: {
      title,
      description: post.seoDescription || post.excerpt || undefined,
      type: 'article',
      images: post.thumbnail ? [{ url: post.thumbnail }] : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description: post.seoDescription || post.excerpt || undefined,
      images: post.thumbnail ? [post.thumbnail] : undefined,
    },
  };
}

// Add this at the top of the file after imports
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

export default async function PostPage({ params }: { params: { slug: string } }) {
  const post = await prisma.post.findUnique({
    where: {
      slug: params.slug,
    },
    select: {
      id: true,
      title: true,
      content: true,
      excerpt: true,
      thumbnail: true,
      createdAt: true,
      tags: true,
      slug: true,
      category: {
        select: {
          title: true,
          slug: true,
        },
      },
      subcategory: {
        select: {
          title: true,
          slug: true,
        },
      },
    },
  });

  if (!post) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-semibold text-neutral-900">Post not found</h1>
          <Link href="/" className="text-blue-600 hover:underline mt-4 inline-block">
            Return to homepage
          </Link>
        </div>
      </div>
    );
  }

  let relatedPosts: RelatedPost[] = [];
  if (post.category?.slug) {
    const fetchedPosts = await prisma.post.findMany({
      where: {
        categoryId: post.category.slug,
        NOT: {
          id: post.id,
        },
      },
      take: 3,
      select: {
        id: true,
        title: true,
        thumbnail: true,
        createdAt: true,
        slug: true,
      },
    });

    relatedPosts = fetchedPosts.map(post => ({
      ...post,
      createdAt: post.createdAt.toISOString(),
    }));
  }

  // Generate a random number of readers between 70 and 145
  const liveReaders = Math.floor(Math.random() * (145 - 70 + 1)) + 70;

  return (
    <div className={`min-h-screen bg-white ${poppins.className}`}>
      {/* Article Header */}
      <header className="pt-12 pb-8 px-4">
        <div className="container mx-auto max-w-5xl">
          <div className="grid grid-cols-12 gap-8">
            <div className="col-span-12 lg:col-span-9">
              {post.category && (
                <Link 
                  href={`/categories/${post.category.slug}`}
                  className="inline-block px-3 py-1 bg-red-100 text-red-600 rounded-full text-sm font-medium mb-4"
                >
                  {post.category.title}
                </Link>
              )}
              <h1 className="text-4xl md:text-5xl font-bold text-neutral-900 mb-6">
                {post.title}
              </h1>
              <div className="flex items-center gap-4 text-neutral-600">
                <span className="text-sm">
                  {new Date(post.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </span>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-sm font-medium text-green-600">{liveReaders} reading now</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Featured Image */}
      <div className="container mx-auto max-w-5xl px-4 mb-12">
        <div className="rounded-2xl overflow-hidden shadow-xl bg-white hover:shadow-2xl transition-shadow duration-300">
          <div className="w-full aspect-[21/9] relative">
            <Image
              src={post.thumbnail || '/placeholder.jpg'}
              alt={post.title}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 100vw, 1200px"
              className="object-cover"
              priority
              placeholder="blur"
              blurDataURL={`data:image/svg+xml;base64,${toBase64(shimmer(1200, 630))}`}
            />
          </div>
        </div>
      </div>

      {/* Content and Sidebar */}
      <div className="container mx-auto px-4 max-w-5xl">
        <div className="grid grid-cols-12 gap-8">
          {/* Main Content */}
          <main className="col-span-12 lg:col-span-8">
            <article className="prose prose-lg max-w-none">
              <div dangerouslySetInnerHTML={{ __html: post.content }} />
            </article>
          </main>

          {/* Sidebar */}
          <aside className="col-span-12 lg:col-span-4">
            <div className="lg:sticky lg:top-8 space-y-6">
              {/* Tags Section */}
              {Array.isArray(post.tags) && post.tags.length > 0 && (
                <div className="bg-white rounded-xl shadow-sm p-6 border border-neutral-100">
                  <h3 className="text-lg font-semibold text-neutral-900 mb-4 flex items-center gap-2">
                    <svg className="w-5 h-5 text-neutral-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A2 2 0 013 12V7a4 4 0 014-4z" />
                    </svg>
                    Tags
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {post.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-3 py-1 bg-neutral-50 text-neutral-600 rounded-full text-sm hover:bg-neutral-100 transition-colors cursor-pointer"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Categories Section */}
              {post.category && (
                <div className="bg-white rounded-xl shadow-sm p-6 border border-neutral-100">
                  <h3 className="text-lg font-semibold text-neutral-900 mb-4 flex items-center gap-2">
                    <svg className="w-5 h-5 text-neutral-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                    </svg>
                    Categories
                  </h3>
                  <div className="space-y-2">
                    <Link
                      href={`/categories/${post.category.slug}`}
                      className="flex items-center gap-2 px-4 py-2 bg-neutral-50 rounded-lg text-neutral-900 hover:bg-neutral-100 transition-colors group"
                    >
                      <span className="flex-1">{post.category.title}</span>
                      <svg className="w-4 h-4 text-neutral-400 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                      </svg>
                    </Link>
                    {post.subcategory && (
                      <Link
                        href={`/categories/${post.category.slug}?subcategory=${post.subcategory.slug}`}
                        className="flex items-center gap-2 px-4 py-2 bg-neutral-50 rounded-lg text-neutral-900 hover:bg-neutral-100 transition-colors group"
                      >
                        <span className="flex-1">{post.subcategory.title}</span>
                        <svg className="w-4 h-4 text-neutral-400 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                        </svg>
                      </Link>
                    )}
                  </div>
                </div>
              )}

              {/* Related Posts Section */}
              {relatedPosts.length > 0 && (
                <div className="bg-white rounded-xl shadow-sm p-6 border border-neutral-100">
                  <h3 className="text-lg font-semibold text-neutral-900 mb-4 flex items-center gap-2">
                    <svg className="w-5 h-5 text-neutral-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                    Related Posts
                  </h3>
                  <div className="space-y-4">
                    {relatedPosts.map((relatedPost) => (
                      <Link
                        key={relatedPost.id}
                        href={`/posts/${relatedPost.slug}`}
                        className="group block"
                      >
                        <div className="flex gap-4">
                          <div className="w-20 h-20 relative rounded-lg overflow-hidden flex-shrink-0">
                            <Image
                              src={relatedPost.thumbnail || '/placeholder.jpg'}
                              alt={relatedPost.title}
                              fill
                              sizes="(max-width: 768px) 80px, 80px"
                              className="object-cover group-hover:scale-105 transition-transform duration-300"
                              placeholder="blur"
                              blurDataURL={`data:image/svg+xml;base64,${toBase64(shimmer(80, 80))}`}
                              loading="lazy"
                            />
                          </div>
                          <div>
                            <h4 className="text-neutral-900 font-medium group-hover:text-blue-600 transition-colors line-clamp-2">
                              {relatedPost.title}
                            </h4>
                            <time className="text-sm text-neutral-500">
                              {new Date(relatedPost.createdAt).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                              })}
                            </time>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
} 