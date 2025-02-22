'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Video } from '@/types';
import WatchMoreButton from '@/app/components/WatchMoreButton';

interface VideosSectionProps {
  videos: Video[];
}

const DEFAULT_THUMBNAIL = '/placeholder.jpg';

const getYouTubeThumbnail = (url: string) => {
  try {
    const videoId = url.split('v=')[1]?.split('&')[0];
    return videoId ? `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg` : DEFAULT_THUMBNAIL;
  } catch (error) {
    console.error('Error getting YouTube thumbnail:', error);
    return DEFAULT_THUMBNAIL;
  }
};

export default function VideosSection({ videos }: VideosSectionProps) {
  if (videos.length === 0) return null;

  return (
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
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
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
        <WatchMoreButton />
      </div>
    </section>
  );
} 