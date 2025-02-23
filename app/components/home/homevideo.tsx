import React from 'react';
import Link from 'next/link';
import ImageWithFallback from '@/app/components/ImageWithFallback';
import WatchMoreButton from '@/app/components/WatchMoreButton';

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

interface HomeVideoProps {
  videos: Video[];
}

export default function HomeVideo({ videos }: HomeVideoProps) {
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
  );
}
