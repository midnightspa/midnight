import React from 'react';
import Link from 'next/link';
import { Poppins } from 'next/font/google';
import SubCatCarousel from '@/components/SubCatCarousel';
import prisma from '@/lib/prisma';
import MobileHero from '@/app/components/MobileHero';
import ImageWithFallback from '@/app/components/ImageWithFallback';
import SearchArticles from '@/app/components/SearchArticles';
import WatchMoreButton from '@/app/components/WatchMoreButton';

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
});

const DEFAULT_THUMBNAIL = '/placeholder.jpg';

const getImageUrl = (url: string | null) => {
  if (!url) return DEFAULT_THUMBNAIL;
  if (url.startsWith('http')) return url;
  return url.startsWith('/') ? url : `/${url}`;
};

const getYouTubeThumbnail = (url: string) => {
  try {
    const videoId = url.split('v=')[1]?.split('&')[0];
    return videoId ? `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg` : DEFAULT_THUMBNAIL;
  } catch (error) {
    console.error('Error getting YouTube thumbnail:', error);
    return DEFAULT_THUMBNAIL;
  }
};

export default async function HomePage() {
  try {
    // Initialize empty arrays for data
    let categories: any[] = [];
    let subcategories: any[] = [];
    let posts: any[] = [];
    let videos: any[] = [];

    try {
      categories = await prisma.postCategory.findMany({
        select: {
          id: true,
          title: true,
          description: true,
          thumbnail: true,
          slug: true,
          subcategories: {
            select: {
              id: true,
              title: true,
              description: true,
              thumbnail: true,
              slug: true,
            }
          }
        }
      });
    } catch (error) {
      console.error('Error fetching categories:', error);
    }

    try {
      subcategories = await prisma.postSubCategory.findMany({
        take: 10,
        orderBy: {
          posts: {
            _count: 'desc'
          }
        },
        select: {
          id: true,
          title: true,
          description: true,
          thumbnail: true,
          slug: true,
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
      });
    } catch (error) {
      console.error('Error fetching subcategories:', error);
    }

    try {
      posts = await prisma.post.findMany({
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
          excerpt: true,
          thumbnail: true,
          createdAt: true,
          slug: true,
          tags: true,
          category: {
            select: {
              title: true,
              slug: true
            }
          },
          subcategory: {
            select: {
              title: true,
              slug: true
            }
          },
          author: {
            select: {
              name: true
            }
          }
        }
      });
    } catch (error) {
      console.error('Error fetching posts:', error);
    }

    try {
      videos = await prisma.video.findMany({
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
          slug: true,
          author: {
            select: {
              name: true
            }
          }
        }
      });
    } catch (error) {
      console.error('Error fetching videos:', error);
    }

    // Safely extract unique tags from posts
    const uniqueTags = Array.from(new Set(
      posts
        .filter(post => Array.isArray(post.tags))
        .flatMap(post => post.tags || [])
        .filter(Boolean)
    )).slice(0, 10);

    // Ensure all required data is present and handle missing data gracefully
    const sanitizedPosts = posts.map(post => ({
      ...post,
      id: post.id || '',
      title: post.title || 'Untitled Post',
      excerpt: post.excerpt || '',
      thumbnail: post.thumbnail || null,
      createdAt: post.createdAt?.toString() || new Date().toISOString(),
      tags: Array.isArray(post.tags) ? post.tags : [],
      category: post.category || null,
      subcategory: post.subcategory || null,
      author: {
        name: post.author?.name || 'Anonymous'
      }
    }));

    const sanitizedCategories = categories.map(category => ({
      ...category,
      id: category.id || '',
      title: category.title || 'Uncategorized',
      description: category.description || '',
      thumbnail: category.thumbnail || null,
      subcategories: Array.isArray(category.subcategories) ? category.subcategories : []
    }));

    const sanitizedSubcategories = subcategories.map(subcategory => ({
      ...subcategory,
      id: subcategory.id || '',
      title: subcategory.title || 'Uncategorized',
      description: subcategory.description || '',
      thumbnail: subcategory.thumbnail || null,
      category: subcategory.category || {
        id: '',
        title: 'Uncategorized',
        slug: ''
      },
      _count: {
        posts: subcategory._count?.posts || 0
      }
    }));

    const sanitizedVideos = videos.map(video => ({
      ...video,
      id: video.id || '',
      title: video.title || 'Untitled Video',
      description: video.description || '',
      youtubeUrl: video.youtubeUrl || '',
      createdAt: video.createdAt?.toString() || new Date().toISOString(),
      author: {
        name: video.author?.name || 'Anonymous'
      }
    }));

    return (
      <div className={`min-h-screen bg-white ${poppins.className}`}>
        {/* Hero Section with Enhanced Design */}
        <section className="relative bg-gray-100">
          <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10"></div>
          
          {/* Mobile Hero */}
          <MobileHero posts={sanitizedPosts} />

          {/* Desktop & Tablet Hero */}
          <div className="hidden lg:flex container mx-auto px-4 h-[70vh] items-center justify-between relative overflow-hidden">
            {/* Left side content */}
            <div className="max-w-xl relative z-10">
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
            <div className="w-[400px] relative h-[70vh] overflow-hidden">
              <div className="absolute inset-0">
                <div className="relative h-full">
                  <div className="absolute inset-0 bg-gradient-to-b from-gray-100 via-transparent to-gray-100 z-10 pointer-events-none"></div>
                  <div className="vertical-carousel py-8">
                    {[...sanitizedPosts, ...sanitizedPosts].map((post, index) => (
                      <Link 
                        key={`${post.id}-${index}`}
                        href={`/posts/${post.slug}`}
                        className="block transform transition-all duration-500 hover:scale-105 hover:-translate-x-2 mb-6"
                      >
                        <div className="bg-white rounded-xl overflow-hidden shadow-lg w-[380px] hover:shadow-xl transition-shadow duration-300">
                          <div className="relative h-40">
                            <ImageWithFallback
                              src={getImageUrl(post.thumbnail)}
                              alt={post.title}
                              fill
                              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                              className="object-cover"
                              priority={index < 2}
                            />
                            {post.category && (
                              <span className="absolute top-4 left-4 px-3 py-1 bg-white/90 backdrop-blur-sm text-neutral-900 text-sm font-medium rounded-full">
                                {post.category.title}
                              </span>
                            )}
                          </div>
                          <div className="p-4">
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
              {sanitizedCategories.slice(0, 3).map((category) => (
                <div
                  key={category.id}
                  className="group bg-neutral-50 rounded-xl p-6 hover:bg-neutral-100 transition-all duration-300 border border-neutral-100"
                >
                  <div className="h-48 relative mb-4 rounded-lg overflow-hidden">
                    <ImageWithFallback
                      src={getImageUrl(category.thumbnail)}
                      alt={category.title}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
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
        <SubCatCarousel subcategories={sanitizedSubcategories} />

        {/* Videos Section */}
        {sanitizedVideos.length > 0 && (
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
                {sanitizedVideos.map((video) => (
                  <Link
                    key={video.id}
                    href={`/videos/${video.slug}`}
                    className="group block"
                  >
                    <div className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300">
                      <div className="aspect-video relative">
                        <ImageWithFallback
                          src={getYouTubeThumbnail(video.youtubeUrl)}
                          alt={video.title}
                          fill
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                          className="object-cover"
                        />
                      </div>
                      <div className="p-4">
                        <h3 className="text-lg font-semibold text-neutral-900 mb-2 line-clamp-2">
                          {video.title}
                        </h3>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-neutral-200"></div>
                            <span className="text-sm text-neutral-600">
                              {video.author.name}
                            </span>
                          </div>
                          <time className="text-sm text-neutral-500" dateTime={new Date(video.createdAt).toISOString()}>
                            {new Date(video.createdAt).toLocaleDateString('en-US', {
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
              <WatchMoreButton />
            </div>
          </section>
        )}

        {/* Latest Posts Grid Section */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="flex justify-between items-end mb-12">
              <div>
                <span className="text-sm font-medium text-neutral-500 uppercase tracking-wider">Latest Updates</span>
                <h2 className="text-3xl font-semibold text-neutral-900 mt-1">Featured Articles</h2>
              </div>
              <Link href="/categories" className="text-neutral-900 font-medium hover:text-neutral-700">
                View All Articles →
              </Link>
            </div>

            <div className="grid grid-cols-12 gap-8">
              {/* Main Posts Grid - 8 columns */}
              <div className="col-span-12 lg:col-span-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {sanitizedPosts.slice(0, 6).map((post) => (
                    <Link
                      key={post.id}
                      href={`/posts/${post.slug}`}
                      className="group block"
                    >
                      <div className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-neutral-100">
                        <div className="aspect-[4/3] relative">
                          <ImageWithFallback
                            src={getImageUrl(post.thumbnail)}
                            alt={post.title}
                            fill
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 25vw"
                            className="object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                          {post.category && (
                            <span className="absolute top-4 left-4 px-3 py-1 bg-white/90 backdrop-blur-sm text-neutral-900 text-sm font-medium rounded-full">
                              {post.category.title}
                            </span>
                          )}
                        </div>
                        <div className="p-4">
                          <h3 className="text-base font-semibold text-neutral-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
                            {post.title}
                          </h3>
                          <p className="text-neutral-600 line-clamp-2 mb-4 text-sm">
                            {post.excerpt}
                          </p>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <div className="w-6 h-6 rounded-full bg-neutral-200"></div>
                              <span className="text-xs text-neutral-600">
                                {post.author.name}
                              </span>
                            </div>
                            <time className="text-xs text-neutral-500" dateTime={new Date(post.createdAt).toISOString()}>
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

              {/* Sidebar - 4 columns */}
              <div className="col-span-12 lg:col-span-4 space-y-8">
                {/* Search Box */}
                <SearchArticles />

                {/* Subcategories */}
                <div className="bg-white rounded-xl shadow-sm p-6 border border-neutral-100">
                  <h3 className="text-lg font-semibold text-neutral-900 mb-4">Popular Categories</h3>
                  <div className="space-y-2">
                    {sanitizedSubcategories.slice(0, 5).map((subcategory) => (
                      <Link
                        key={subcategory.id}
                        href={`/categories/${subcategory.category.slug}/${subcategory.slug}`}
                        className="flex items-center justify-between py-2 px-3 rounded-lg hover:bg-neutral-50 transition-colors group"
                      >
                        <span className="text-neutral-600 group-hover:text-neutral-900">
                          {subcategory.title}
                        </span>
                        <span className="text-sm text-neutral-400 bg-neutral-100 px-2 py-1 rounded-full">
                          {subcategory._count.posts}
                        </span>
                      </Link>
                    ))}
                  </div>
                </div>

                {/* Tags Cloud */}
                <div className="bg-white rounded-xl shadow-sm p-6 border border-neutral-100">
                  <h3 className="text-lg font-semibold text-neutral-900 mb-4">Popular Tags</h3>
                  <div className="flex flex-wrap gap-2">
                    {uniqueTags.map((tag) => (
                      <Link
                        key={tag}
                        href={`/tags/${tag}`}
                        className="px-3 py-1 bg-neutral-100 text-neutral-600 rounded-full text-sm hover:bg-neutral-200 transition-colors"
                      >
                        {tag}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    );
  } catch (error) {
    console.error('Error in HomePage:', error);
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <h1 className="text-2xl font-semibold text-gray-900 mb-4">Something went wrong</h1>
          <p className="text-gray-600">We're working on fixing this issue. Please try again later.</p>
          <p className="text-sm text-gray-500 mt-2">{error instanceof Error ? error.message : 'Unknown error'}</p>
        </div>
      </div>
    );
  }
}