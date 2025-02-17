'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { slugify } from '@/lib/utils';

interface CategoryFormProps {
  initialData?: {
    id: string;
    title: string;
    description: string | null;
    thumbnail: string | null;
    slug: string;
    seoTitle: string | null;
    seoDescription: string | null;
    seoKeywords: string | null;
    categoryId?: string | null;
  };
}

export default function CategoryForm({ initialData }: CategoryFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(
    initialData?.thumbnail || null
  );

  const handleThumbnailChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('thumbnail', file);

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) throw new Error('Upload failed');

      const data = await response.json();
      setThumbnailPreview(data.url);
    } catch (error) {
      console.error('Error uploading thumbnail:', error);
    }
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const title = e.target.value;
    const slugInput = document.getElementById('slug') as HTMLInputElement;
    if (slugInput) {
      slugInput.value = slugify(title);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData(e.currentTarget);
      const data = {
        title: formData.get('title'),
        slug: formData.get('slug'),
        description: formData.get('description'),
        thumbnail: thumbnailPreview,
        seoTitle: formData.get('seoTitle'),
        seoDescription: formData.get('seoDescription'),
        seoKeywords: formData.get('seoKeywords'),
        categoryId: formData.get('categoryId'),
      };

      const url = initialData
        ? `/api/categories/${initialData.id}`
        : '/api/categories';

      const response = await fetch(url, {
        method: initialData ? 'PATCH' : 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error('Failed to save category');

      router.push('/dashboard/categories');
      router.refresh();
    } catch (error) {
      console.error('Error saving category:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700">
          Title
        </label>
        <input
          type="text"
          name="title"
          id="title"
          required
          defaultValue={initialData?.title}
          onChange={handleTitleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
      </div>

      <div>
        <label htmlFor="slug" className="block text-sm font-medium text-gray-700">
          Slug
        </label>
        <input
          type="text"
          name="slug"
          id="slug"
          required
          defaultValue={initialData?.slug}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700">
          Description
        </label>
        <textarea
          name="description"
          id="description"
          rows={4}
          defaultValue={initialData?.description || ''}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Thumbnail</label>
        <div className="mt-1 flex items-center">
          {thumbnailPreview && (
            <img
              src={thumbnailPreview}
              alt="Thumbnail preview"
              className="h-32 w-32 object-cover rounded-lg"
            />
          )}
          <label className="ml-5 cursor-pointer bg-white py-2 px-3 border border-gray-300 rounded-md shadow-sm text-sm leading-4 font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
            <span>Upload thumbnail</span>
            <input
              type="file"
              className="hidden"
              onChange={handleThumbnailChange}
              accept="image/*"
            />
          </label>
        </div>
      </div>

      <div>
        <label htmlFor="seoTitle" className="block text-sm font-medium text-gray-700">
          SEO Title
        </label>
        <input
          type="text"
          name="seoTitle"
          id="seoTitle"
          defaultValue={initialData?.seoTitle || ''}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
      </div>

      <div>
        <label htmlFor="seoDescription" className="block text-sm font-medium text-gray-700">
          SEO Description
        </label>
        <textarea
          name="seoDescription"
          id="seoDescription"
          rows={3}
          defaultValue={initialData?.seoDescription || ''}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
      </div>

      <div>
        <label htmlFor="seoKeywords" className="block text-sm font-medium text-gray-700">
          SEO Keywords
        </label>
        <input
          type="text"
          name="seoKeywords"
          id="seoKeywords"
          defaultValue={initialData?.seoKeywords || ''}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={loading}
          className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
        >
          {loading ? 'Saving...' : initialData ? 'Update Category' : 'Create Category'}
        </button>
      </div>
    </form>
  );
} 