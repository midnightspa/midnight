import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('query') || searchParams.get('q') || '';

    if (!query.trim()) {
      return NextResponse.json({ 
        posts: [],
        videos: [],
        products: []
      });
    }

    const [posts, videos, products] = await Promise.all([
      // Search posts
      prisma.post.findMany({
        where: {
          OR: [
            { title: { contains: query, mode: 'insensitive' } },
            { content: { contains: query, mode: 'insensitive' } },
            { excerpt: { contains: query, mode: 'insensitive' } },
          ],
          published: true,
        },
        select: {
          id: true,
          title: true,
          slug: true,
          excerpt: true,
          thumbnail: true,
        },
        take: 5,
      }),

      // Search videos
      prisma.video.findMany({
        where: {
          OR: [
            { title: { contains: query, mode: 'insensitive' } },
            { description: { contains: query, mode: 'insensitive' } },
          ],
          published: true,
        },
        select: {
          id: true,
          title: true,
          slug: true,
          description: true,
          youtubeUrl: true,
        },
        take: 5,
      }),

      // Search products
      prisma.product.findMany({
        where: {
          OR: [
            { title: { contains: query, mode: 'insensitive' } },
            { description: { contains: query, mode: 'insensitive' } },
          ],
          published: true,
        },
        select: {
          id: true,
          title: true,
          slug: true,
          description: true,
          thumbnail: true,
        },
        take: 5,
      }),
    ]);

    // Process video thumbnails
    const processedVideos = videos.map(video => ({
      ...video,
      thumbnail: getYouTubeThumbnail(video.youtubeUrl),
    }));

    return NextResponse.json({
      posts,
      videos: processedVideos,
      products,
    });
  } catch (error) {
    console.error('Search error:', error);
    return NextResponse.json(
      { error: 'Search failed' },
      { status: 500 }
    );
  }
}

function getYouTubeThumbnail(url: string): string {
  const videoId = url.match(/(?:youtu\.be\/|youtube\.com(?:\/embed\/|\/v\/|\/watch\?v=|\/user\/\S+|\/ytscreeningroom\?v=|\/sandalsResorts#\w\/\w\/.*\/))([^\/&\n?\s]{11})/)?.[1];
  return videoId ? `https://img.youtube.com/vi/${videoId}/mqdefault.jpg` : '/placeholder.jpg';
} 