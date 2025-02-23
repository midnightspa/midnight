'use client';

import React from 'react';
import Link from 'next/link';
import ImageWithFallback from './ImageWithFallback';

interface Props {
  posts: Array<{
    id: string;
    title: string;
    excerpt: string;
    thumbnailUrl: string;
    createdAt: string;
    slug: string;
    category?: {
      title: string;
      slug: string;
    };
    author: {
      name: string;
    };
  }>;
  blurDataURL: string;
}

export default function ClientSideCarousel({ posts, blurDataURL }: Props) {
  return (
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
                      src={post.thumbnailUrl}
                      alt={post.title}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      className="object-cover"
                      placeholder="blur"
                      blurDataURL={blurDataURL}
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
  );
} 