import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Poppins } from 'next/font/google';
import SubCatCarousel from '@/components/SubCatCarousel';
import { PrismaClient } from '@prisma/client';
import { generateMetadata as generateSiteMetadata, generateStructuredData, getSiteSettings } from '@/lib/seo';

const prisma = new PrismaClient();

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
  subcategories: SubCategory[];
}

interface Video {
  id: string;
  title: string;
  description: string;
  youtubeUrl: string;
  thumbnail: string | null;
  createdAt: string;
  slug: string;
}

interface Post {
  id: string;
  title: string;
  excerpt: string;
  thumbnail: string | null;
  createdAt: string;
  author: {
    name: string;
  };
  slug: string;
  category: {
    title: string;
    slug: string;
  };
  subcategory: {
    title: string;
    slug: string;
  } | null;
}

interface SubCategory {
  id: string;
  title: string;
  description: string | null;
  thumbnail: string | null;
  slug: string;
  categoryId: string;
  _count: {
    posts: number;
  };
}

async function getLatestVideos() {
  return await prisma.video.findMany({
    where: {
      published: true,
    },
    orderBy: {
      createdAt: 'desc'
    },
    take: 6,
    select: {
      id: true,
      title: true,
      description: true,
      youtubeUrl: true,
      createdAt: true,
      slug: true,
    },
  });
}

export async function generateMetadata() {
  return generateSiteMetadata(); // This will use default site settings
}

export default async function HomePage() {
  try {
    const settings = await getSiteSettings();
    
    const [categories, subcategories, posts, videos] = await Promise.all([
      prisma.postCategory.findMany({
        include: {
          subcategories: true,
        },
      }),
      prisma.postSubCategory.findMany({
        include: {
          category: {
            select: {
              id: true,
              title: true,
              slug: true
            }
          },
          _count: {
            select: {
              posts: true
            }
          }
        }
      }),
      prisma.post.findMany({
        where: {
          published: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
        take: 6,
        include: {
          category: true,
          subcategory: true,
          author: {
            select: {
              name: true
            }
          }
        },
      }),
      prisma.video.findMany({
        where: {
          published: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
        take: 6,
        select: {
          id: true,
          title: true,
          description: true,
          youtubeUrl: true,
          createdAt: true,
          slug: true
        }
      }),
    ]);

    const getYouTubeThumbnail = (url: string) => {
      const videoId = url.split('v=')[1]?.split('&')[0];
      return videoId ? `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg` : '/placeholder.jpg';
    };

    return (
      <>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(generateStructuredData(settings as any))
          }}
        />
        <div className={`min-h-screen bg-white ${poppins.className}`}>
          {/* Hero Section with Enhanced Design */}
          <section className="relative h-[70vh] bg-gradient-to-br from-neutral-100 to-neutral-50">
            <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10"></div>
            <div className="container mx-auto px-4 h-full flex items-center justify-between">
              {/* Left side content */}
              <div className="max-w-xl relative">
                <div className="absolute -top-10 -left-10 w-20 h-20 bg-neutral-900 rounded-full opacity-5"></div>
                <h1 className="text-6xl font-bold text-neutral-900 mb-6 leading-tight">
                Dream Beyond  <span className="text-neutral-700">Limits</span>
                </h1>
                <p className="text-xl text-neutral-600 mb-8 leading-relaxed">
                Discover tips, insights, and practices to reclaim your nights and embrace tranquility.
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

              {/* Right side slider */}
              <div className="hidden lg:block w-[400px] relative h-full">
                <div className="absolute inset-0 overflow-hidden">
                  <div className="h-full relative">
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-neutral-50/80 z-10 pointer-events-none"></div>
                    <div className="animate-slide-vertical">
                      {[...posts, ...posts].map((post, index) => (
                        <Link 
                          key={`${post.id}-${index}`}
                          href={`/posts/${post.slug}`}
                          className="block transform transition-all duration-500 hover:scale-105 hover:-translate-x-2 mb-4"
                        >
                          <div className="bg-white rounded-xl overflow-hidden shadow-lg w-[380px] hover:shadow-xl transition-shadow duration-300">
                            <div className="relative h-48">
                              <Image
                                src={post.thumbnail || '/placeholder.jpg'}
                                alt={post.title}
                                fill
                                className="object-cover"
                              />
                              {post.category && (
                                <span className="absolute top-4 left-4 px-3 py-1 bg-white/90 backdrop-blur-sm text-neutral-900 text-sm font-medium rounded-full">
                                  {post.category.title}
                                </span>
                              )}
                            </div>
                            <div className="p-5">
                              <h3 className="text-lg font-semibold text-neutral-900 mb-2 line-clamp-2">
                                {post.title}
                              </h3>
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                  <div className="w-8 h-8 rounded-full bg-neutral-200"></div>
                                  <span className="text-sm text-neutral-600">
                                    {post.author.name}
                                  </span>
                                </div>
                                <time className="text-sm text-neutral-500" dateTime={new Date(post.createdAt).toISOString()}>
                                  {new Date(post.createdAt).toLocaleDateString('en-US', {
                                    month: 'short',
                                    day: 'numeric'
                                  })}
                                </time>
                              </div>
                            </div>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Featured Categories with Enhanced Cards */}
          <section className="py-20 bg-white">
            <div className="container mx-auto px-4">
              <div className="flex justify-between items-end mb-12">
                <div>
                  <span className="text-sm font-medium text-neutral-500 uppercase tracking-wider">Browse by</span>
                  <h2 className="text-3xl font-semibold text-neutral-900 mt-1">Featured Categories</h2>
                </div>
                <Link href="/categories" className="text-neutral-900 font-medium hover:text-neutral-700">
                  View All Categories →
                </Link>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {categories.slice(0, 3).map((category) => (
                  <div
                    key={category.id}
                    className="group bg-neutral-50 rounded-xl p-6 hover:bg-neutral-100 transition-all duration-300 border border-neutral-100"
                  >
                    <div className="h-48 relative mb-4 rounded-lg overflow-hidden">
                      <Image
                        src={category.thumbnail || '/placeholder.jpg'}
                        alt={category.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    </div>
                    <div className="flex items-center gap-2 mb-3">
                      {category.subcategories.length > 0 && (
                        <span className="px-3 py-1 bg-neutral-200 text-neutral-600 text-sm rounded-full">
                          {category.subcategories.length} subcategories
                        </span>
                      )}
                    </div>
                    <h3 className="text-xl font-semibold text-neutral-900 mb-2">{category.title}</h3>
                    <p className="text-neutral-600 mb-4 line-clamp-2">{category.description}</p>
                    <Link href={`/categories/${category.slug}`} className="inline-flex items-center text-neutral-900 font-medium hover:gap-2 transition-all">
                      <span>Explore</span>
                      <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Trending Topics Carousel */}
          <SubCatCarousel subcategories={subcategories} />

          {/* Videos Section */}
          {videos.length > 0 && (
            <section className="py-16 bg-neutral-100">
              <div className="container mx-auto px-4">
                <div className="flex justify-between items-center mb-8">
                  <h2 className="text-3xl font-semibold text-neutral-900">Latest Videos</h2>
                  <Link
                    href="/videos/archive"
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
                            src={getYouTubeThumbnail(video.youtubeUrl)}
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
                          <div className="flex items-center justify-between text-sm text-neutral-500">
                            <time dateTime={new Date(video.createdAt).toISOString()}>
                              {new Date(video.createdAt).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                              })}
                            </time>
                            <span className="text-neutral-900 font-medium group-hover:translate-x-1 transition-transform">
                              Watch Now →
                            </span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </section>
          )}

          {/* Main Content Grid with Sidebar */}
          <section className="py-20 bg-white">
            <div className="container mx-auto px-4">
              <div className="flex justify-between items-end mb-12">
                <div>
                  <span className="text-sm font-medium text-neutral-500 uppercase tracking-wider">Latest Updates</span>
                  <h2 className="text-3xl font-semibold text-neutral-900 mt-1">From The Blog</h2>
                </div>
              </div>
              <div className="grid grid-cols-12 gap-8">
                {/* Main Content Area (9 columns) */}
                <div className="col-span-12 lg:col-span-9">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {posts.map((post) => (
                      <div
                        key={post.id}
                        className="bg-white rounded-xl overflow-hidden shadow hover:shadow-lg transition-all duration-300"
                      >
                        <Link href={`/posts/${post.slug}`} className="block">
                          <div className="relative h-48">
                            <Image
                              src={post.thumbnail || '/placeholder.jpg'}
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
                            <h2 className="text-xl font-semibold text-neutral-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
                              {post.title}
                            </h2>
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
                              <span className="text-neutral-900 font-medium hover:text-blue-600 transition-colors">
                                Read More →
                              </span>
                            </div>
                          </div>
                        </Link>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Sidebar (3 columns) */}
                <div className="col-span-12 lg:col-span-3 space-y-8">
                  {/* Search */}
                  <div className="bg-neutral-50 rounded-xl p-6">
                    <h3 className="text-lg font-semibold text-neutral-900 mb-4">Search</h3>
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="Search posts..."
                        className="w-full px-4 py-2 rounded-lg border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-neutral-900"
                      />
                      <svg className="w-5 h-5 absolute right-3 top-1/2 transform -translate-y-1/2 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                    </div>
                  </div>

                  {/* Popular Posts */}
                  <div className="bg-neutral-50 rounded-xl p-6">
                    <h3 className="text-lg font-semibold text-neutral-900 mb-4">Popular Posts</h3>
                    <div className="space-y-4">
                      {posts.slice(0, 3).map((post) => (
                        <Link key={post.id} href={`/posts/${post.id}`} className="flex gap-4 group">
                          <div className="w-20 h-20 relative rounded-lg overflow-hidden flex-shrink-0">
                            <Image
                              src={post.thumbnail || '/placeholder.jpg'}
                              alt={post.title}
                              fill
                              className="object-cover group-hover:scale-110 transition-transform duration-300"
                            />
                          </div>
                          <div>
                            <h4 className="text-neutral-900 font-medium line-clamp-2 group-hover:text-neutral-700">
                              {post.title}
                            </h4>
                            <span className="text-sm text-neutral-500">
                              {new Date(post.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>

                  {/* Categories */}
                  <div className="bg-neutral-50 rounded-xl p-6">
                    <h3 className="text-lg font-semibold text-neutral-900 mb-4">Categories</h3>
                    <div className="space-y-2">
                      {categories.slice(0, 4).map((category) => (
                        <Link
                          key={category.id}
                          href={`/categories/${category.slug}`}
                          className="flex items-center justify-between py-2 text-neutral-600 hover:text-neutral-900"
                        >
                          <span>{category.title}</span>
                          <span className="text-sm text-neutral-500">
                            ({category.subcategories.length})
                          </span>
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </>
    );
  } catch (error) {
    console.error('Error fetching data:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}
