'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface VideoFormProps {
  videoId: string;
}

export default function VideoForm({ videoId }: VideoFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [published, setPublished] = useState(false);
  const [slug, setSlug] = useState('');
  const [initialData, setInitialData] = useState<any>(null);

  // Function to generate slug from title
  const generateSlug = (title: string) => {
    return title.toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  };

  // Handle title change and auto-generate slug
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTitle = e.target.value;
    if (!slug || slug === generateSlug(initialData?.title)) {
      // Auto-update slug if it hasn't been manually edited or if it matches the original title's slug
      setSlug(generateSlug(newTitle));
    }
  };

  // Fetch video data
  useEffect(() => {
    const fetchVideo = async () => {
      try {
        const response = await fetch(`/api/videos/${videoId}`);
        if (!response.ok) throw new Error('Failed to fetch video');
        const data = await response.json();
        setInitialData(data);
        setSlug(data.slug || '');
        setPublished(data.published);
      } catch (error) {
        console.error('Error fetching video:', error);
        setError('Failed to fetch video data');
      }
    };

    fetchVideo();
  }, [videoId]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const formElement = e.currentTarget as HTMLFormElement;
      const formData = {
        title: (formElement.elements.namedItem('title') as HTMLInputElement).value,
        slug,
        description: (formElement.elements.namedItem('description') as HTMLTextAreaElement).value,
        youtubeUrl: (formElement.elements.namedItem('youtubeUrl') as HTMLInputElement).value,
        seoTitle: (formElement.elements.namedItem('seoTitle') as HTMLInputElement).value,
        seoDescription: (formElement.elements.namedItem('seoDescription') as HTMLTextAreaElement).value,
        seoKeywords: (formElement.elements.namedItem('seoKeywords') as HTMLInputElement).value,
        published,
      };

      const response = await fetch(`/api/videos/${videoId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to update video');
      }

      router.push('/dashboard/videos');
      router.refresh();
    } catch (error) {
      setError(error instanceof Error ? error.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  if (!initialData) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-4xl">
      {error && (
        <div className="bg-red-50 p-4 rounded-md">
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      <div className="space-y-6">
        {/* Basic Information */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-medium mb-4">Basic Information</h2>
          <div className="space-y-4">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                Title *
              </label>
              <input
                type="text"
                name="title"
                id="title"
                required
                defaultValue={initialData.title}
                onChange={handleTitleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            <div>
              <label htmlFor="slug" className="block text-sm font-medium text-gray-700">
                Slug
              </label>
              <div className="mt-1 flex rounded-md shadow-sm">
                <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 sm:text-sm">
                  /videos/
                </span>
                <input
                  type="text"
                  name="slug"
                  id="slug"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  className="flex-1 block w-full min-w-0 rounded-none rounded-r-md border-gray-300 focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                />
              </div>
              <p className="mt-1 text-sm text-gray-500">
                URL-friendly version of the title. Auto-generated but can be edited.
              </p>
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                Description
              </label>
              <textarea
                name="description"
                id="description"
                rows={3}
                defaultValue={initialData.description}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            <div>
              <label htmlFor="youtubeUrl" className="block text-sm font-medium text-gray-700">
                YouTube URL *
              </label>
              <input
                type="url"
                name="youtubeUrl"
                id="youtubeUrl"
                required
                defaultValue={initialData.youtubeUrl}
                placeholder="https://www.youtube.com/watch?v=..."
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
              <p className="mt-1 text-sm text-gray-500">
                Enter the full YouTube video URL
              </p>
            </div>
          </div>
        </div>

        {/* SEO Information */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-medium mb-4">SEO Information</h2>
          <div className="space-y-4">
            <div>
              <label htmlFor="seoTitle" className="block text-sm font-medium text-gray-700">
                SEO Title
              </label>
              <input
                type="text"
                name="seoTitle"
                id="seoTitle"
                defaultValue={initialData.seoTitle}
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
                defaultValue={initialData.seoDescription}
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
                defaultValue={initialData.seoKeywords}
                placeholder="Separate keywords with commas"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Publishing Options */}
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-medium">Publishing Options</h2>
              <p className="text-sm text-gray-500">Choose whether to publish this video immediately</p>
            </div>
            <div className="flex items-center">
              <button
                type="button"
                onClick={() => setPublished(!published)}
                className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                  published ? 'bg-blue-600' : 'bg-gray-200'
                }`}
              >
                <span
                  className={`inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                    published ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
              <span className="ml-3 text-sm font-medium text-gray-700">
                {published ? 'Published' : 'Draft'}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end space-x-4">
        <button
          type="button"
          onClick={() => router.back()}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Saving...' : 'Save Changes'}
        </button>
      </div>
    </form>
  );
} 