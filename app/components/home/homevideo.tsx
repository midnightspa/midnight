import React from 'react';
import Link from 'next/link';
import ImageWithFallback from '@/app/components/ImageWithFallback';
import WatchMoreButton from '@/app/components/WatchMoreButton';
import prisma from '@/lib/prisma';

interface Video {
  id: string;
  title: string;
  description: string;
  youtubeUrl: string;
  createdAt: string;
  slug: string;
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

const getYouTubeThumbnail = (url: string) => {
  try {
    const videoId = url.split('v=')[1]?.split('&')[0];
    return videoId ? `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg` : '/placeholder.jpg';
  } catch (error) {
    console.error('Error getting YouTube thumbnail:', error);
    return '/placeholder.jpg';
  }
};

async function getVideos() {
  try {
    const videos = await prisma.video.findMany({
      where: { published: true },
      orderBy: { createdAt: 'desc' },
      take: 6,
      select: {
        id: true,
        title: true,
        description: true,
        youtubeUrl: true,
        createdAt: true,
        slug: true,
        author: {
          select: { name: true }
        }
      }
    });

    return videos.map(video => ({
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
  } catch (error) {
    console.error('Error fetching videos:', error);
    return [];
  }
}

export default async function HomeVideo() {
  const videos = await getVideos();

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
                  <ImageWithFallback
                    src={getYouTubeThumbnail(video.youtubeUrl)}
                    alt={video.title}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover"
                    placeholder="blur"
                    blurDataURL={`data:image/svg+xml;base64,${toBase64(shimmer(700, 475))}`}
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-16 h-16 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <svg 
                        xmlns="http://www.w3.org/2000/svg" 
                        fill="none" 
                        viewBox="0 0 24 24" 
                        strokeWidth={1.5} 
                        stroke="currentColor" 
                        className="w-16 h-16 text-white drop-shadow-lg"
                      >
                        <path 
                          strokeLinecap="round" 
                          strokeLinejoin="round" 
                          d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" 
                        />
                        <path 
                          strokeLinecap="round" 
                          strokeLinejoin="round" 
                          d="M15.91 11.672a.375.375 0 010 .656l-5.603 3.113a.375.375 0 01-.557-.328V8.887c0-.286.307-.466.557-.327l5.603 3.112z" 
                        />
                      </svg>
                    </div>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-neutral-900 mb-2 line-clamp-2">
                    {video.title}
                  </h3>
                  <div className="flex items-center justify-end">
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
  );
}