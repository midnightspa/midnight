import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Poppins } from 'next/font/google';
import type { Metadata } from 'next';
import prisma from '@/lib/prisma';
import CategoryClient from './CategoryClient';

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
});

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const resolvedParams = await params;
  const category = await prisma.postCategory.findFirst({
    where: {
      slug: resolvedParams.slug,
    }
  });

  if (!category) {
    return {
      title: 'Category Not Found',
      description: 'The requested category could not be found.',
      robots: { index: false, follow: false }
    };
  }

  return {
    title: category.seoTitle || `${category.title} - Wellness & Relaxation Articles`,
    description: category.seoDescription || `Explore our collection of articles about ${category.title.toLowerCase()}. Find expert tips, guides, and insights to enhance your wellness journey.`,
    keywords: category.seoKeywords || `${category.title.toLowerCase()}, wellness, relaxation, spa treatments, health tips`,
    openGraph: {
      title: category.seoTitle || category.title,
      description: category.seoDescription || category.description || `Explore our collection of articles about ${category.title.toLowerCase()}.`,
      type: 'website',
      images: category.thumbnail ? [
        {
          url: category.thumbnail,
          width: 1200,
          height: 630,
          alt: category.title
        }
      ] : undefined
    },
    twitter: {
      card: 'summary_large_image',
      title: category.seoTitle || category.title,
      description: category.seoDescription || category.description || `Explore our collection of articles about ${category.title.toLowerCase()}.`,
      images: category.thumbnail ? [category.thumbnail] : undefined
    }
  };
}

export default async function CategoryPage() {
  return (
    <div className={poppins.className}>
      <CategoryClient />
    </div>
  );
} 