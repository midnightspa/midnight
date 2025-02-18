import React from 'react';
import type { Metadata } from 'next';
import prisma from '@/lib/prisma';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Archive',
  description: 'Browse all our content by date',
};

export default async function ArchivePage() {
  const posts = await prisma.post.findMany({
    where: {
      published: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
    select: {
      id: true,
      title: true,
      slug: true,
      createdAt: true,
    },
  });

  // Group posts by year and month
  const groupedPosts = posts.reduce((acc, post) => {
    const date = new Date(post.createdAt);
    const year = date.getFullYear();
    const month = date.toLocaleString('default', { month: 'long' });

    if (!acc[year]) {
      acc[year] = {};
    }
    if (!acc[year][month]) {
      acc[year][month] = [];
    }
    acc[year][month].push(post);
    return acc;
  }, {} as Record<number, Record<string, typeof posts>>);

  // Sort years in descending order
  const sortedYears = Object.keys(groupedPosts)
    .map(Number)
    .sort((a, b) => b - a);

  return (
    <div className="min-h-screen bg-white py-16">
      <div className="container mx-auto px-4 max-w-4xl">
        <h1 className="text-4xl font-bold text-neutral-900 mb-12">Archive</h1>
        
        {sortedYears.map(year => (
          <div key={year} className="mb-12">
            <h2 className="text-2xl font-semibold text-neutral-900 mb-6">{year}</h2>
            {Object.entries(groupedPosts[year]).map(([month, monthPosts]) => (
              <div key={month} className="mb-8">
                <h3 className="text-lg font-medium text-neutral-600 mb-4">{month}</h3>
                <div className="space-y-3">
                  {monthPosts.map(post => (
                    <div key={post.id} className="flex items-center gap-4">
                      <span className="text-sm text-neutral-500">
                        {new Date(post.createdAt).toLocaleDateString('en-US', {
                          day: 'numeric',
                          month: 'short',
                        })}
                      </span>
                      <Link
                        href={`/posts/${post.slug}`}
                        className="text-neutral-900 hover:text-blue-600 transition-colors"
                      >
                        {post.title}
                      </Link>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
} 