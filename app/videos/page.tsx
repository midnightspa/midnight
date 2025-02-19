import { Metadata } from 'next';
import { VideoArchive } from './components/VideoArchive';
import prisma from '@/lib/prisma';
import { generateMetadata as generateSiteMetadata } from '@/lib/seo';

export async function generateMetadata(): Promise<Metadata> {
  const metadata = await generateSiteMetadata(
    'Sleep and Relaxation Videos | Soothing Music for Insomnia & Deep Sleep',
    'Explore our collection of sleep relaxation videos featuring soothing music, calming sounds, and ASMR to help with insomnia, anxiety, and stress relief. Watch now and experience deep, restful sleep.'
  );

  return {
    ...metadata,
    keywords: 'sleep relaxation videos, soothing music, insomnia relief, deep sleep music, calming sounds, ASMR sleep, white noise, sleep meditation, nature sounds, stress relief music, sleep therapy, bedtime music'
  };
}

export default async function VideosPage() {
  const dbVideos = await prisma.video.findMany({
    where: {
      published: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  const videos = dbVideos.map(video => ({
    id: video.id,
    title: video.title,
    description: video.description || '',
    youtubeUrl: video.youtubeUrl,
    thumbnail: null,
    createdAt: video.createdAt.toISOString(),
    slug: video.slug,
  }));

  return <VideoArchive initialVideos={videos} />;
} 