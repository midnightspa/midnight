'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { getImageUrl } from '@/app/utils/imageUtils';
import ImageLoader from '@/app/components/ImageLoader';

interface Post {
  id: string;
  title: string;
  excerpt: string;
  thumbnail: string | null;
  slug: string;
  category: {
    title: string;
    slug: string;
  } | null;
}

interface MobileHeroProps {
  posts: Post[];
}

export default function MobileHero({ posts }: MobileHeroProps) {
  return (
    <div className="lg:hidden">
      <div className="container mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold text-neutral-900 mb-4">
            Dream Beyond <span className="text-neutral-700">Limits</span>
          </h1>
          <p className="text-lg text-neutral-600">
            Discover tips, insights, and practices to reclaim your nights and embrace tranquility.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 gap-6">
          {posts.slice(0, 3).map((post, index) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Link href={`/posts/${post.slug}`}>
                <div className="bg-white rounded-xl overflow-hidden shadow-lg">
                  <div className="relative h-48">
                    <ImageLoader
                      src={getImageUrl(post.thumbnail)}
                      alt={post.title}
                      fill
                      sizes="100vw"
                      className="object-cover"
                      priority={index === 0}
                    />
                    {post.category && (
                      <span className="absolute top-4 left-4 px-3 py-1 bg-white/90 backdrop-blur-sm text-neutral-900 text-sm font-medium rounded-full">
                        {post.category.title}
                      </span>
                    )}
                  </div>
                  <div className="p-4">
                    <h2 className="text-xl font-semibold text-neutral-900 mb-2">
                      {post.title}
                    </h2>
                    <p className="text-neutral-600 line-clamp-2">
                      {post.excerpt}
                    </p>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-8 flex justify-center gap-4"
        >
          <Link
            href="/categories"
            className="inline-flex items-center px-6 py-3 bg-neutral-900 text-white rounded-lg hover:bg-neutral-800 transition-all transform hover:scale-105 shadow-lg text-sm"
          >
            Explore Categories
          </Link>
          <Link
            href="/videos"
            className="inline-flex items-center px-6 py-3 bg-white text-neutral-900 rounded-lg hover:bg-neutral-50 transition-all transform hover:scale-105 shadow-lg border border-neutral-200 text-sm"
          >
            Watch Videos
          </Link>
        </motion.div>
      </div>
    </div>
  );
}