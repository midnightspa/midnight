import React from 'react';
import Link from 'next/link';
import { Poppins } from 'next/font/google';
import SubCatCarousel from '@/components/SubCatCarousel';
import prisma from '@/lib/prisma';  // Import the centralized Prisma client
import { generateMetadata as generateSiteMetadata, generateStructuredData, getSiteSettings } from '@/lib/seo';
import MobileHero from '@/app/components/MobileHero';
import ImageWithFallback from '@/app/components/ImageWithFallback';
import { Metadata } from 'next';
import Script from 'next/script';
import SearchArticles from '@/app/components/SearchArticles';
import WatchMoreButton from '@/app/components/WatchMoreButton';
import HeroSection from '@/components/home/HeroSection';
import FeaturedCategories from '@/components/home/FeaturedCategories';
import VideosSection from '@/components/home/VideosSection';
import LatestPosts from '@/components/home/LatestPosts';

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

const DEFAULT_THUMBNAIL = '/placeholder.jpg';

async function getLatestVideos() {
  try {
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
  } catch (error) {
    console.error('Error fetching latest videos:', error);
    return [];
  }
}

export async function generateMetadata(): Promise<Metadata> {
  return generateSiteMetadata(
    'Midnight Spa - Your Ultimate Destination for Relaxation and Wellness',
    'Discover luxury spa treatments, wellness tips, and relaxation techniques at Midnight Spa. Expert guides, personalized services, and a tranquil atmosphere for your ultimate wellness journey.',
    `${process.env.NEXT_PUBLIC_BASE_URL}/images/og-image.jpg`
  );
}

export default async function HomePage() {
  try {
    // Initialize empty arrays for data
    let settings = null;
    let categories: any[] = [];
    let subcategories: any[] = [];
    let posts: any[] = [];
    let videos: any[] = [];

    try {
      settings = await getSiteSettings();
    } catch (error) {
      console.error('Error fetching settings:', error);
    }

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

    const getYouTubeThumbnail = (url: string) => {
      try {
        const videoId = url.split('v=')[1]?.split('&')[0];
        return videoId ? `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg` : DEFAULT_THUMBNAIL;
      } catch (error) {
        console.error('Error getting YouTube thumbnail:', error);
        return DEFAULT_THUMBNAIL;
      }
    };

    const getImageUrl = (url: string | null) => {
      if (!url) return DEFAULT_THUMBNAIL;
      if (url.startsWith('http')) return url;
      return url.startsWith('/') ? url : `/${url}`;
    };

    const structuredData = generateStructuredData({
      organizationName: settings?.organizationName || undefined,
      organizationLogo: settings?.organizationLogo || undefined,
      contactPhone: settings?.contactPhone || undefined,
      contactEmail: settings?.contactEmail || undefined,
      contactAddress: settings?.contactAddress || undefined
    });

    return (
      <>
        <Script
          id="structured-data"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
        <div className="min-h-screen bg-white">
          <HeroSection posts={sanitizedPosts} />
          <FeaturedCategories categories={sanitizedCategories} />
          <SubCatCarousel subcategories={sanitizedSubcategories} />
          <VideosSection videos={sanitizedVideos} />
          <LatestPosts 
            posts={sanitizedPosts} 
            subcategories={sanitizedSubcategories}
            uniqueTags={uniqueTags}
          />
        </div>
      </>
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