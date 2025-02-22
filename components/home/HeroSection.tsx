'use client';

import React from 'react';
import Link from 'next/link';
import ImageWithFallback from '@/app/components/ImageWithFallback';
import MobileHero from '@/app/components/MobileHero';
import { Post } from '@/types';

interface HeroSectionProps {
  posts: Post[];
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

const getImageUrl = (url: string | null) => {
  if (!url) return DEFAULT_THUMBNAIL;
  if (url.startsWith('http')) return url;
  return url.startsWith('/') ? url : `/${url}`;
};

export default function HeroSection({ posts }: HeroSectionProps) {
  return (
    <section className="relative bg-gray-100">
      <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10"></div>
      
      {/* Mobile Hero */}
      <MobileHero posts={posts} />

      {/* Desktop & Tablet Hero */}
      <div className="hidden lg:flex container mx-auto px-4 h-[70vh] items-center justify-between relative overflow-hidden">
        {/* Left side content */}
        <div className="max-w-xl relative z-10">
          <div className="absolute -top-10 -left-10 w-20 h-20 bg-neutral-900 rounded-full opacity-5"></div>
          <h1 className="text-6xl font-bold text-neutral-900 mb-6 leading-tight">
            Dream Beyond <span className="text-neutral-700">Limits</span>
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
                {[...posts, ...posts].map((post, index) => (
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
                          placeholder="blur"
                          blurDataURL={`data:image/svg+xml;base64,${toBase64(shimmer(700, 475))}`}
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
  );
} 