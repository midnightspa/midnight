'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Poppins } from 'next/font/google';
import YouTubeSubscribe from '@/app/components/YouTubeSubscribe';

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
});

interface Video {
  id: string;
  title: string;
  description: string;
  youtubeUrl: string;
  thumbnail: string | null;
  createdAt: string;
  slug: string;
}

interface VideoArchiveProps {
  initialVideos: Video[];
}

export function VideoArchive({ initialVideos }: VideoArchiveProps) {
  const getYouTubeThumbnail = (url: string) => {
    const videoId = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([^&?]+)/)?.[1];
    return videoId ? `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg` : '/placeholder.jpg';
  };

  return (
    <div className={`min-h-screen bg-neutral-50 ${poppins.className}`}>
      {/* YouTube-style Header */}
      <div className="relative">
        {/* Cover Image */}
        <div className="h-48 md:h-60 lg:h-80 relative bg-gradient-to-r from-blue-600 to-purple-600">
          <Image
            src="/images/midnightstabanner.jpg"
            alt="Channel Cover"
            fill
            className="object-cover"
          />
        </div>

        {/* Channel Info Section */}
        <div className="container mx-auto px-4">
          <div className="relative -mt-16 pb-8 flex flex-col md:flex-row items-start md:items-end gap-6 md:gap-8">
            {/* Profile Picture */}
            <div className="w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-white overflow-hidden relative bg-white shadow-lg">
              <Image
                src="/images/midnightspayoutube.jpg"
                alt="Channel Profile"
                fill
                className="object-cover"
              />
            </div>

            {/* Channel Info */}
            <div className="flex-1 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mt-8">
              <div className='mt-12'>
                <h1 className="text-2xl md:text-3xl font-bold text-neutral-900">
                  Midnight Spa
                </h1>
                <div className="flex items-center gap-4 mt-2 text-neutral-600">
                  <span className="text-sm">{initialVideos.length} videos</span>
                  <span className="text-sm">1.2K subscribers</span>
                </div>
                <p className="text-lg text-gray-600 mb-8">
                  Explore our collection of videos designed to help you understand and master the art of relaxation. Whether you&apos;re new to spa treatments or looking to enhance your wellness journey, you&apos;ll find valuable insights and techniques in our video library. Let&apos;s embark on this journey together.
                </p>
              </div>

              {/* Subscribe Section */}
              <div className="flex flex-col items-center gap-2">
                <h3 className="text-sm font-semibold text-neutral-900 text-center">
                  🎥 Subscribe to Our YouTube Channel!
                </h3>
               
                <YouTubeSubscribe channelId="UCBUNH_lKitDawWd7zKYgMMQ" />
              </div>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="border-b border-neutral-200">
            <div className="flex gap-8">
              <button className="px-1 py-4 text-sm font-medium text-neutral-900 border-b-2 border-neutral-900">
                Videos
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Videos Grid */}
      <section className="py-12 bg-neutral-100">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {initialVideos.map((video) => (
              <Link
                key={video.id}
                href={`/videos/${video.slug}`}
                className="group block"
              >
                <div className="bg-white rounded-[20px] overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300">
                  <div className="aspect-video relative">
                    <Image
                      src={video.thumbnail || getYouTubeThumbnail(video.youtubeUrl)}
                      alt={video.title}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                      <div className="w-16 h-16 rounded-full bg-white/90 flex items-center justify-center transform group-hover:scale-110 transition-transform">
                        <svg 
                          className="w-8 h-8 text-neutral-900" 
                          fill="currentColor" 
                          viewBox="0 0 24 24"
                        >
                          <path d="M8 5v14l11-7z" />
                        </svg>
                      </div>
                    </div>
                  </div>
                  <div className="p-6">
                    <h2 className="text-xl font-semibold text-neutral-900 mb-2 line-clamp-1 group-hover:text-blue-600 transition-colors">
                      {video.title}
                    </h2>
                    <p className="text-neutral-600 line-clamp-2 text-sm">
                      {video.description}
                    </p>
                    <div className="mt-4 flex items-center text-sm text-neutral-500">
                      <time dateTime={video.createdAt}>
                        {new Date(video.createdAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </time>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {initialVideos.length === 0 && (
            <div className="text-center py-12">
              <h3 className="text-lg font-medium text-neutral-900">No videos found</h3>
              <p className="text-neutral-600 mt-2">
                Check back later for new content
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
} 