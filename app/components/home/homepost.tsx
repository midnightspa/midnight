import React from 'react';
import Link from 'next/link';
import ImageWithFallback from '@/app/components/ImageWithFallback';
import SearchArticles from '@/app/components/SearchArticles';
import prisma from '@/lib/prisma';

interface Post {
  id: string;
  title: string;
  excerpt: string;
  thumbnail: string | null;
  createdAt: string;
  tags: string[];
  slug: string;
  category: {
    title: string;
    slug: string;
  } | null;
  subcategory: {
    title: string;
    slug: string;
  } | null;
  author: {
    name: string;
  };
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

const toBase64 = (str: string) => Buffer.from(str).toString('base64');

const DEFAULT_THUMBNAIL = '/placeholder.jpg';

const getImageUrl = (url: string | null) => {
  if (!url) return DEFAULT_THUMBNAIL;
  if (url.startsWith('http')) return url;
  return url.startsWith('/') ? url : `/${url}`;
};

async function getPosts(): Promise<Post[]> {
  try {
    const posts = await prisma.post.findMany({
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
        excerpt: true,
        thumbnail: true,
        createdAt: true,
        tags: true,
        slug: true,
        category: {
          select: {
            title: true,
            slug: true,
          }
        },
        subcategory: {
          select: {
            title: true,
            slug: true,
          }
        },
        author: {
          select: {
            name: true
          }
        }
      }
    });

    return posts.map(post => ({
      id: post.id || '',
      title: post.title || 'Untitled Post',
      excerpt: post.excerpt || '',
      thumbnail: post.thumbnail,
      createdAt: post.createdAt.toISOString(),
      tags: post.tags || [],
      slug: post.slug,
      category: post.category ? {
        title: post.category.title,
        slug: post.category.slug,
      } : null,
      subcategory: post.subcategory ? {
        title: post.subcategory.title,
        slug: post.subcategory.slug,
      } : null,
      author: {
        name: post.author?.name || 'Anonymous'
      }
    }));
  } catch (error) {
    console.error('Error fetching posts:', error);
    return [];
  }
}

async function getSubcategories() {
  try {
    const subcategories = await prisma.postSubCategory.findMany({
      select: {
        id: true,
        title: true,
        slug: true,
        _count: {
          select: {
            posts: true
          }
        }
      }
    });

    return subcategories.map(subcategory => ({
      ...subcategory,
      _count: {
        posts: subcategory._count?.posts || 0
      }
    }));
  } catch (error) {
    console.error('Error fetching subcategories:', error);
    return [];
  }
}

export default async function HomePost() {
  const [posts, subcategories] = await Promise.all([
    getPosts(),
    getSubcategories()
  ]);

  // Extract unique tags from posts
  const uniqueTags = Array.from(new Set(
    posts
      .filter(post => Array.isArray(post.tags))
      .flatMap(post => post.tags || [])
      .filter(Boolean)
  )).slice(0, 10);

  return (
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
              {posts.slice(0, 6).map((post) => (
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
                        placeholder="blur"
                        blurDataURL={`data:image/svg+xml;base64,${toBase64(shimmer(700, 475))}`}
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
                      <div className="flex items-center justify-end">
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
                {subcategories.slice(0, 5).map((subcategory) => (
                  <Link
                    key={subcategory.id}
                    href={`/categories/${subcategory.slug}`}
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
  );
}
