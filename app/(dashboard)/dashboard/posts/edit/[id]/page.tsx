import React from 'react';
import prisma from '@/lib/prisma';
import { notFound } from 'next/navigation';
import PostForm from './components/PostForm';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Edit Post - Dashboard',
  description: 'Edit your blog post',
};

async function getPost(id: string) {
  try {
    const post = await prisma.post.findUnique({
      where: { id },
      select: {
        id: true,
        title: true,
        slug: true,
        content: true,
        excerpt: true,
        thumbnail: true,
        published: true,
        tags: true,
        seoTitle: true,
        seoDescription: true,
        seoKeywords: true,
        categoryId: true,
        subcategoryId: true,
        category: {
          select: {
            id: true,
            title: true,
            slug: true,
          }
        },
        subcategory: {
          select: {
            id: true,
            title: true,
            slug: true,
          }
        },
        author: {
          select: {
            id: true,
            name: true,
            email: true,
          }
        },
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!post) {
      return null;
    }

    // Ensure name is never null
    if (post.author && post.author.name === null) {
      post.author.name = 'Anonymous';
    }

    return {
      ...post,
      createdAt: post.createdAt.toISOString(),
      updatedAt: post.updatedAt.toISOString(),
    };
  } catch (error) {
    console.error('Error fetching post:', error);
    throw new Error('Failed to fetch post');
  }
}

export default async function EditPostPage({ params }: { params: { id: string } }) {
  const post = await getPost(params.id);

  if (!post) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Edit Post: {post.title}</h1>
        <div className="text-sm text-gray-500">
          Last updated: {new Date(post.updatedAt).toLocaleDateString()}
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow">
        <div className="p-6">
          <PostForm 
            postId={params.id}
            initialData={{
              title: post.title,
              slug: post.slug,
              content: post.content,
              excerpt: post.excerpt || '',
              categoryId: post.categoryId,
              subcategoryId: post.subcategoryId || '',
              tags: post.tags || [],
              seoTitle: post.seoTitle || '',
              seoDescription: post.seoDescription || '',
              seoKeywords: post.seoKeywords || '',
              published: post.published,
              thumbnail: post.thumbnail || '',
              category: post.category,
              subcategory: post.subcategory,
              author: {
                id: post.author.id,
                name: post.author.name || 'Anonymous',
                email: post.author.email,
              },
            }}
          />
        </div>
      </div>
    </div>
  );
} 