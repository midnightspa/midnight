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
  const category = await prisma.postCategory.findUnique({
    where: {
      slug: params.slug,
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

  if (!category) {
    return {
      title: 'Category Not Found',
      description: 'The requested category could not be found.',
      robots: { index: false, follow: false },
    };
  }

  const title = category.seoTitle || category.title;

  return {
    title: title,
    description: category.seoDescription || category.description || undefined,
    keywords: category.seoKeywords || undefined,
    openGraph: {
      title,
      description: category.seoDescription || category.description || undefined,
      type: 'website',
      images: category.thumbnail ? [{ url: category.thumbnail }] : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description: category.seoDescription || category.description || undefined,
      images: category.thumbnail ? [category.thumbnail] : undefined,
    },
  };
}

export default async function CategoryPage() {
  return (
    <div className={poppins.className}>
      <CategoryClient />
    </div>
  );
} 