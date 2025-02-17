import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Poppins } from 'next/font/google';
import YouTubeSubscribe from '@/app/components/YouTubeSubscribe';
import SEO from '@/app/components/SEO';
import RelatedVideos from '@/app/components/RelatedVideos';
import prisma from '@/lib/prisma';

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
});

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

async function getVideo(slug: string) {
  const video = await prisma.video.findFirst({
    where: {
      slug: slug,
      published: true,
    },
  });
  return video;
}

async function getLatestVideos() {
  const videos = await prisma.video.findMany({
    where: {
      published: true,
    },
    orderBy: {
      createdAt: 'desc'
    },
    take: 6, // Fetch 6 to account for current video
  });
  return videos;
}

export default async function VideoPage({ params }: { params: { slug: string } }) {
  const [video, latestVideos] = await Promise.all([
    getVideo(params.slug),
    getLatestVideos(),
  ]);

  const liveViewers = Math.floor(Math.random() * 100) + 1;

  if (!video) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-semibold text-neutral-900">Video not found</h1>
          <Link href="/videos" className="text-blue-600 hover:underline mt-4 inline-block">
            Return to videos
          </Link>
        </div>
      </div>
    );
  }

  const getYouTubeEmbedUrl = (url: string) => {
    const videoId = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([^&?]+)/)?.[1];
    return videoId ? `https://www.youtube.com/embed/${videoId}` : null;
  };

  const getYouTubeThumbnail = (url: string) => {
    const videoId = url.match(/(?:youtu\.be\/|youtube\.com(?:\/embed\/|\/v\/|\/watch\?v=|\/user\/\S+|\/ytscreeningroom\?v=|\/sandalsResorts#\w\/\w\/.*\/))([^\/&\n?\s]{11})/)?.[1];
    return videoId ? `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg` : '/images/placeholder-video.jpg';
  };

  const embedUrl = getYouTubeEmbedUrl(video.youtubeUrl);

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
            className="object-cover opacity-50"
          />
          <div className="absolute inset-0 bg-black/50" />
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
            <div className="flex-1 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold">
                  Midnight Spa
                </h1>
                <div className="flex items-center gap-4 mt-2 text-white/80">
                  <span className="text-sm text-gray-800">1.2K subscribers</span>
                  <span className="text-sm text-gray-800">•</span>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                    <span className="text-sm text-gray-800">{liveViewers} watching</span>
                  </div>
                </div>
              </div>

              {/* YouTube Subscribe Button */}
              <div className="flex items-center">
                <YouTubeSubscribe channelId="UCBUNH_lKitDawWd7zKYgMMQ" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-12 gap-8">
          {/* Video and Description */}
          <div className="col-span-12 lg:col-span-8">
            {/* Video Title */}
            <h1 className="text-2xl font-bold text-neutral-900 mb-4">
              {video.title}
            </h1>

            {/* Video Player */}
            {embedUrl && (
              <div className="relative aspect-video rounded-xl overflow-hidden bg-black shadow-lg mb-6">
                <iframe
                  src={embedUrl}
                  title={video.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="absolute top-0 left-0 w-full h-full"
                />
              </div>
            )}

            {/* Video Description */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="prose prose-neutral max-w-none">
                {video.description}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <aside className="col-span-12 lg:col-span-4">
            <div className="lg:sticky lg:top-8 space-y-6">
              {/* Latest Videos */}
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h3 className="text-lg font-semibold text-neutral-900 mb-4">Latest Videos</h3>
                <div className="space-y-4">
                  {latestVideos
                    .filter(v => v.id !== video.id)
                    .slice(0, 5)
                    .map((latestVideo) => (
                      <Link
                        key={latestVideo.id}
                        href={`/videos/${latestVideo.slug}`}
                        className="group block"
                      >
                        <div className="relative aspect-video rounded-lg overflow-hidden mb-2">
                          <Image
                            src={getYouTubeThumbnail(latestVideo.youtubeUrl)}
                            alt={latestVideo.title}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                          <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                            <div className="w-12 h-12 rounded-full bg-white/90 flex items-center justify-center transform group-hover:scale-110 transition-transform">
                              <svg className="w-6 h-6 text-neutral-900" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M8 5v14l11-7z" />
                              </svg>
                            </div>
                          </div>
                        </div>
                        <h4 className="font-medium text-neutral-900 group-hover:text-blue-600 transition-colors line-clamp-2">
                          {latestVideo.title}
                        </h4>
                        <p className="text-sm text-gray-500 mt-1">
                          {new Date(latestVideo.createdAt).toLocaleDateString()}
                        </p>
                      </Link>
                    ))}
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
} 