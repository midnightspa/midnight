import type { Metadata } from 'next';
import prisma from '@/lib/prisma';

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const resolvedParams = await params;
  const subcategory = await prisma.postSubCategory.findUnique({
    where: {
      slug: resolvedParams.slug,
    },
    select: {
      title: true,
      description: true,
      seoTitle: true,
      seoDescription: true,
      seoKeywords: true,
      thumbnail: true,
    },
  });

  if (!subcategory) {
    return {
      title: 'Subcategory Not Found',
      description: 'The requested subcategory could not be found.',
      robots: { index: false, follow: false },
    };
  }

  const title = subcategory.seoTitle || subcategory.title;

  return {
    title: title,
    description: subcategory.seoDescription || subcategory.description || undefined,
    keywords: subcategory.seoKeywords || undefined,
    openGraph: {
      title,
      description: subcategory.seoDescription || subcategory.description || undefined,
      type: 'website',
      images: subcategory.thumbnail ? [{ url: subcategory.thumbnail }] : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description: subcategory.seoDescription || subcategory.description || undefined,
      images: subcategory.thumbnail ? [subcategory.thumbnail] : undefined,
    },
  };
}

// Rest of your component code... 