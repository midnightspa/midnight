import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

interface Video {
  id: string;
  title: string;
  description: string;
  youtubeUrl: string;
  createdAt: string;
  slug: string;
  seoTitle?: string;
  seoDescription?: string;
}

interface RelatedVideosProps {
  currentVideoId: string;
  videos: Video[];
}

export default function RelatedVideos({ currentVideoId, videos }: RelatedVideosProps) {
  // Filter out current video and shuffle the remaining videos
  const shuffledVideos = React.useMemo(() => {
    const filteredVideos = videos.filter(video => video.id !== currentVideoId);
    return [...filteredVideos]
      .sort(() => Math.random() - 0.5)
      .slice(0, 4);
  }, [videos, currentVideoId]);

  const getYouTubeThumbnail = (url: string) => {
    const videoId = url.match(/(?:youtu\.be\/|youtube\.com(?:\/embed\/|\/v\/|\/watch\?v=|\/user\/\S+|\/ytscreeningroom\?v=|\/sandalsResorts#\w\/\w\/.*\/))([^\/&\n?\s]{11})/)?.[1];
    return videoId ? `https://img.youtube.com/vi/${videoId}/mqdefault.jpg` : null;
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">Related Videos</h2>
      <div className="space-y-4">
        {shuffledVideos.map((video) => (
          <Link
            key={video.id}
            href={`/videos/${video.slug}`}
            className="flex gap-4 group hover:bg-gray-50 p-2 rounded-lg transition-colors"
          >
            {/* Thumbnail */}
            <div className="relative w-32 h-20 flex-shrink-0 overflow-hidden rounded-md">
              <Image
                src={getYouTubeThumbnail(video.youtubeUrl) || '/placeholder.jpg'}
                alt={video.title}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <h3 className="text-sm font-medium text-gray-900 line-clamp-2 group-hover:text-blue-600 transition-colors">
                {video.title}
              </h3>
              <p className="mt-1 text-xs text-gray-500 line-clamp-2">
                {video.description}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
} 