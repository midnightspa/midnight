'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

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
    type: 'DIGITAL' | 'PHYSICAL';
  };
}

export default function CategoryForm({ initialData }: CategoryFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form state
  const [title, setTitle] = useState(initialData?.title || '');
  const [slug, setSlug] = useState(initialData?.slug || '');
  const [description, setDescription] = useState(initialData?.description || '');
  const [type, setType] = useState<'DIGITAL' | 'PHYSICAL'>(initialData?.type || 'DIGITAL');
  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(initialData?.thumbnail || null);
  
  // SEO fields
  const [seoTitle, setSeoTitle] = useState(initialData?.seoTitle || '');
  const [seoDescription, setSeoDescription] = useState(initialData?.seoDescription || '');
  const [seoKeywords, setSeoKeywords] = useState(initialData?.seoKeywords || '');

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTitle = e.target.value;
    setTitle(newTitle);
    if (!initialData) {
      setSlug(generateSlug(newTitle));
    }
  };

  const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setThumbnail(file);
      
      // Create preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setThumbnailPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('title', title);
      formData.append('slug', slug);
      formData.append('description', description);
      formData.append('type', type);
      formData.append('seoTitle', seoTitle);
      formData.append('seoDescription', seoDescription);
      formData.append('seoKeywords', seoKeywords);

      if (thumbnail) {
        formData.append('thumbnail', thumbnail);
      }

      const url = initialData
        ? `/api/dashboard/products/categories/${initialData.id}`
        : '/api/dashboard/products/categories';

      const response = await fetch(url, {
        method: initialData ? 'PATCH' : 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to save category');
      }

      router.push('/dashboard/products/categories');
      router.refresh();
    } catch (error) {
      console.error('Error saving category:', error);
      setError(error instanceof Error ? error.message : 'Failed to save category');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-lg">
          {error}
        </div>
      )}

      {/* Basic Information */}
      <div className="bg-white p-6 rounded-lg shadow-sm space-y-4">
        <h2 className="text-lg font-semibold">Basic Information</h2>
        
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700">
            Title
          </label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={handleTitleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label htmlFor="slug" className="block text-sm font-medium text-gray-700">
            Slug
          </label>
          <input
            type="text"
            id="slug"
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">
            Description
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        <div>
          <label htmlFor="type" className="block text-sm font-medium text-gray-700">
            Type
          </label>
          <select
            id="type"
            value={type}
            onChange={(e) => setType(e.target.value as 'DIGITAL' | 'PHYSICAL')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            required
          >
            <option value="DIGITAL">Digital</option>
            <option value="PHYSICAL">Physical</option>
          </select>
        </div>
      </div>

      {/* Thumbnail */}
      <div className="bg-white p-6 rounded-lg shadow-sm space-y-4">
        <h2 className="text-lg font-semibold">Thumbnail</h2>
        
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Category Image
          </label>
          <input
            type="file"
            onChange={handleThumbnailChange}
            accept="image/*"
            className="mt-1 block w-full"
          />
        </div>

        {thumbnailPreview && (
          <div className="mt-4">
            <div className="relative w-32 h-32">
              <Image
                src={thumbnailPreview}
                alt="Thumbnail preview"
                fill
                className="object-cover rounded-lg"
              />
            </div>
          </div>
        )}
      </div>

      {/* SEO Information */}
      <div className="bg-white p-6 rounded-lg shadow-sm space-y-4">
        <h2 className="text-lg font-semibold">SEO Information</h2>
        
        <div>
          <label htmlFor="seoTitle" className="block text-sm font-medium text-gray-700">
            SEO Title
          </label>
          <input
            type="text"
            id="seoTitle"
            value={seoTitle}
            onChange={(e) => setSeoTitle(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
          <p className="mt-1 text-sm text-gray-500">
            The title that appears in search engine results.
          </p>
        </div>

        <div>
          <label htmlFor="seoDescription" className="block text-sm font-medium text-gray-700">
            SEO Description
          </label>
          <textarea
            id="seoDescription"
            value={seoDescription}
            onChange={(e) => setSeoDescription(e.target.value)}
            rows={3}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
          <p className="mt-1 text-sm text-gray-500">
            A brief description that appears in search engine results.
          </p>
        </div>

        <div>
          <label htmlFor="seoKeywords" className="block text-sm font-medium text-gray-700">
            SEO Keywords
          </label>
          <input
            type="text"
            id="seoKeywords"
            value={seoKeywords}
            onChange={(e) => setSeoKeywords(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
          <p className="mt-1 text-sm text-gray-500">
            Comma-separated keywords relevant to this category.
          </p>
        </div>
      </div>

      {/* Submit Button */}
      <div className="flex justify-end">
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
        >
          {loading ? 'Saving...' : initialData ? 'Update Category' : 'Create Category'}
        </button>
      </div>
    </form>
  );
} 