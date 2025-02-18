'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { slugify } from '@/lib/utils';
import Image from 'next/image';

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
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(
    initialData?.thumbnail || null
  );
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('/api/categories');
        if (!response.ok) throw new Error('Failed to fetch categories');
        const data = await response.json();
        const filteredCategories = initialData
          ? data.filter((cat: Category) => cat.id !== initialData.id)
          : data;
        setCategories(filteredCategories);
      } catch (error) {
        console.error('Error fetching categories:', error);
        setError('Failed to fetch categories. Please try refreshing the page.');
      }
    };

    fetchCategories();
  }, [initialData]);

  const handleThumbnailChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Please upload an image file');
      return;
    }

    // Validate file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      setError('Image size should be less than 5MB');
      return;
    }

    try {
      setThumbnailFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setThumbnailPreview(reader.result as string);
      };
      reader.onerror = () => {
        setError('Failed to read the image file');
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.error('Error handling thumbnail:', error);
      setError('Failed to process the image. Please try another file.');
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
      const form = e.currentTarget;
      const formData = new FormData(form);
      
      // Validate required fields
      const title = formData.get('title') as string;
      const slug = formData.get('slug') as string;
      
      if (!title || !slug) {
        throw new Error('Title and slug are required');
      }

      // Handle thumbnail upload
      if (thumbnailFile) {
        formData.set('thumbnail', thumbnailFile);
      } else if (initialData?.thumbnail) {
        formData.set('thumbnail', initialData.thumbnail);
      }

      const url = initialData
        ? `/api/categories?id=${initialData.id}`
        : '/api/categories';

      const response = await fetch(url, {
        method: initialData ? 'PUT' : 'POST',
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
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
    <form onSubmit={handleSubmit} className="space-y-6" encType="multipart/form-data">
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
            <div className="relative h-32 w-32">
              <Image
                src={thumbnailPreview}
                alt="Thumbnail preview"
                fill
                className="object-cover rounded-lg"
                unoptimized
              />
            </div>
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
        <p className="mt-2 text-sm text-gray-500">
          Recommended: JPG, PNG, or GIF. Max 5MB.
        </p>
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