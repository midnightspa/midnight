'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { slugify } from '@/lib/utils';

interface Category {
  id: string;
  title: string;
  slug: string;
}

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
  const [categories, setCategories] = useState<Category[]>([]);
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(
    initialData?.thumbnail || null
  );
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Fetch categories for the parent category dropdown
    const fetchCategories = async () => {
      try {
        const response = await fetch('/api/categories');
        if (!response.ok) throw new Error('Failed to fetch categories');
        const data = await response.json();
        // Filter out the current category if we're editing
        const filteredCategories = initialData
          ? data.filter((cat: Category) => cat.id !== initialData.id)
          : data;
        setCategories(filteredCategories);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    fetchCategories();
  }, [initialData]);

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
    setError(null);

    try {
      const formData = new FormData(e.currentTarget);
      
      // Add the thumbnail URL if it exists
      if (thumbnailPreview) {
        formData.set('thumbnail', thumbnailPreview);
      }

      const url = initialData
        ? `/api/categories?id=${initialData.id}`
        : '/api/categories';

      const response = await fetch(url, {
        method: initialData ? 'PUT' : 'POST',
        body: formData,
        headers: {
          'Accept': 'application/json',
        },
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to save category');
      }

      // Force revalidation of the categories page
      await fetch('/api/revalidate?path=/dashboard/categories', {
        method: 'POST',
      });

      router.push('/dashboard/categories');
      router.refresh();
    } catch (error) {
      console.error('Error saving category:', error);
      setError(error instanceof Error ? error.message : 'An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      )}

      <div>
        <label htmlFor="categoryId" className="block text-sm font-medium text-gray-700">
          Parent Category (Optional - Select to create a subcategory)
        </label>
        <select
          id="categoryId"
          name="categoryId"
          defaultValue={initialData?.categoryId || ''}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        >
          <option value="">None (Create as main category)</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.title}
            </option>
          ))}
        </select>
      </div>

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