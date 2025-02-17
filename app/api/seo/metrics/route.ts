import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    // Get total pages count
    const [posts, videos, products] = await Promise.all([
      prisma.post.count(),
      prisma.video.count(),
      prisma.product.count(),
    ]);

    const totalPages = posts + videos + products;

    // Get missing meta tags count
    const [missingTitles, missingDescriptions, missingImages] = await Promise.all([
      prisma.post.count({
        where: {
          OR: [
            { seoTitle: null },
            { seoTitle: '' },
          ],
        },
      }),
      prisma.post.count({
        where: {
          OR: [
            { seoDescription: null },
            { seoDescription: '' },
          ],
        },
      }),
      prisma.post.count({
        where: {
          OR: [
            { thumbnail: null },
            { thumbnail: '' },
          ],
        },
      }),
    ]);

    // For this example, we'll use static performance scores
    // In a real application, you would integrate with tools like Google PageSpeed Insights
    const performance = {
      mobile: 85,
      desktop: 92,
    };

    return NextResponse.json({
      totalPages,
      indexedPages: totalPages, // In a real app, get this from Google Search Console API
      missingMetaTags: {
        title: missingTitles,
        description: missingDescriptions,
        ogImage: missingImages,
      },
      performance,
    });
  } catch (error) {
    console.error('Error fetching SEO metrics:', error);
    return NextResponse.json(
      { error: 'Failed to fetch SEO metrics' },
      { status: 500 }
    );
  }
} 