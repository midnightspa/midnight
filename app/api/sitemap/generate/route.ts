import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/auth.config';
import fs from 'fs/promises';
import path from 'path';
import prisma from '@/lib/prisma';

async function getAllUrls() {
  const [posts, videos, products, categories, subcategories] = await Promise.all([
    prisma.post.findMany({
      where: { published: true },
      select: { slug: true },
    }),
    prisma.video.findMany({
      where: { published: true },
      select: { slug: true },
    }),
    prisma.product.findMany({
      where: { published: true },
      select: { slug: true },
    }),
    prisma.postCategory.findMany({
      select: { slug: true },
    }),
    prisma.postSubCategory.findMany({
      select: { slug: true },
    }),
  ]);

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://themidnightspa.com';

  const urls = [
    baseUrl,
    `${baseUrl}/about`,
    `${baseUrl}/contact`,
    `${baseUrl}/services`,
    `${baseUrl}/blog`,
    `${baseUrl}/videos`,
    `${baseUrl}/shop`,
    ...posts.map(post => `${baseUrl}/posts/${post.slug}`),
    ...videos.map(video => `${baseUrl}/videos/${video.slug}`),
    ...products.map(product => `${baseUrl}/shop/${product.slug}`),
    ...categories.map(category => `${baseUrl}/categories/${category.slug}`),
    ...subcategories.map(subcategory => `${baseUrl}/subcategories/${subcategory.slug}`),
  ];

  return Array.from(new Set(urls)); // Convert Set to Array
}

function generateSitemapXml(urls: string[]) {
  const xmlUrls = urls
    .map(url => `
    <url>
      <loc>${url}</loc>
      <lastmod>${new Date().toISOString()}</lastmod>
      <changefreq>daily</changefreq>
      <priority>0.7</priority>
    </url>`)
    .join('');

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${xmlUrls}
</urlset>`;
}

export async function POST() {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const urls = await getAllUrls();
    const sitemap = generateSitemapXml(urls);
    const sitemapPath = path.join(process.cwd(), 'public', 'sitemap.xml');

    await fs.writeFile(sitemapPath, sitemap);

    // Submit sitemap URL to Google
    const sitemapUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/sitemap.xml`;
    try {
      await fetch(`https://www.google.com/ping?sitemap=${encodeURIComponent(sitemapUrl)}`);
    } catch (error) {
      console.error('Failed to ping Google with sitemap:', error);
      // Continue execution even if ping fails
    }

    return NextResponse.json({
      success: true,
      urlCount: urls.length,
      lastUpdated: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Error generating sitemap:', error);
    return NextResponse.json(
      { error: 'Failed to generate sitemap' },
      { status: 500 }
    );
  }
} 