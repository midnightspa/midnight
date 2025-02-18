const { PrismaClient } = require('@prisma/client');
const { writeFile } = require('fs/promises');
const path = require('path');

const prisma = new PrismaClient();
const baseUrl = 'https://themidnightspa.com';

function formatDate(date) {
  return date.toISOString().split('T')[0];
}

function generateUrl(loc, lastmod, changefreq, priority) {
  return `
  <url>
    <loc>${loc}</loc>
    <lastmod>${formatDate(lastmod)}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`;
}

async function generateSitemap() {
  try {
    // Fetch all published content
    const [posts, videos, products, categories, subcategories] = await Promise.all([
      prisma.post.findMany({
        where: { published: true },
        select: {
          slug: true,
          updatedAt: true,
        },
      }),
      prisma.video.findMany({
        where: { published: true },
        select: {
          slug: true,
          updatedAt: true,
        },
      }),
      prisma.product.findMany({
        where: { published: true },
        select: {
          slug: true,
          updatedAt: true,
        },
      }),
      prisma.postCategory.findMany({
        select: {
          slug: true,
          updatedAt: true,
        },
      }),
      prisma.postSubCategory.findMany({
        select: {
          slug: true,
          category: {
            select: {
              slug: true,
            },
          },
          updatedAt: true,
        },
      }),
    ]);

    // Generate URLs for each content type
    const staticUrls = [
      generateUrl(baseUrl, new Date(), 'daily', '1.0'),
      generateUrl(`${baseUrl}/shop`, new Date(), 'daily', '0.8'),
      generateUrl(`${baseUrl}/videos`, new Date(), 'daily', '0.8'),
      generateUrl(`${baseUrl}/categories`, new Date(), 'daily', '0.8'),
    ];

    const postUrls = posts.map(post =>
      generateUrl(
        `${baseUrl}/posts/${post.slug}`,
        post.updatedAt,
        'weekly',
        '0.7'
      )
    );

    const videoUrls = videos.map(video =>
      generateUrl(
        `${baseUrl}/videos/${video.slug}`,
        video.updatedAt,
        'weekly',
        '0.7'
      )
    );

    const productUrls = products.map(product =>
      generateUrl(
        `${baseUrl}/shop/${product.slug}`,
        product.updatedAt,
        'weekly',
        '0.7'
      )
    );

    const categoryUrls = categories.map(category =>
      generateUrl(
        `${baseUrl}/categories/${category.slug}`,
        category.updatedAt,
        'weekly',
        '0.6'
      )
    );

    const subcategoryUrls = subcategories.map(subcategory =>
      generateUrl(
        `${baseUrl}/categories/${subcategory.category.slug}/${subcategory.slug}`,
        subcategory.updatedAt,
        'weekly',
        '0.6'
      )
    );

    // Combine all URLs
    const allUrls = [
      ...staticUrls,
      ...postUrls,
      ...videoUrls,
      ...productUrls,
      ...categoryUrls,
      ...subcategoryUrls,
    ];

    // Generate sitemap XML
    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${allUrls.join('')}
</urlset>`;

    // Write sitemap to file
    const sitemapPath = path.join(process.cwd(), 'public', 'sitemap.xml');
    await writeFile(sitemapPath, sitemap);

    // Update sitemap URL in site settings
    await prisma.siteSettings.updateMany({
      data: {
        sitemapXml: `${baseUrl}/sitemap.xml`,
      },
    });

    console.log('✅ Sitemap generated successfully!');
  } catch (error) {
    console.error('Error generating sitemap:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Execute the function
generateSitemap(); 