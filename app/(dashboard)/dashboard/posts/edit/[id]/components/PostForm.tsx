'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import Editor from '@/app/components/Editor';

interface Category {
  id: string;
  title: string;
  slug: string;
}

interface SubCategory {
  id: string;
  title: string;
  slug: string;
}

interface Author {
  id: string;
  name: string;
  email: string;
}

interface InitialData {
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  categoryId: string;
  subcategoryId: string;
  tags: string[];
  seoTitle: string;
  seoDescription: string;
  seoKeywords: string;
  published: boolean;
  thumbnail: string;
  category: Category | null;
  subcategory: SubCategory | null;
  author: Author;
}

interface PostFormProps {
  postId: string;
  initialData?: InitialData;
}

export default function PostForm({ postId, initialData }: PostFormProps) {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [subcategories, setSubcategories] = useState<SubCategory[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>(initialData?.categoryId || '');
  const [selectedSubcategory, setSelectedSubcategory] = useState<string>(initialData?.subcategoryId || '');
  const [content, setContent] = useState(initialData?.content || '');
  const [tags, setTags] = useState<string[]>(initialData?.tags || []);
  const [tagInput, setTagInput] = useState('');
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(initialData?.thumbnail || null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!initialData) {
      fetchPost();
    }
    fetchCategories();
  }, [postId, initialData]);

  useEffect(() => {
    if (selectedCategory) {
      fetchSubcategories();
    }
  }, [selectedCategory]);

  // Load initial subcategories if we have a selected category
  useEffect(() => {
    if (initialData?.categoryId) {
      fetchSubcategories();
    }
  }, []);

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const title = e.target.value;
    const slugInput = document.querySelector<HTMLInputElement>('input[name="slug"]');
    if (slugInput) {
      slugInput.value = generateSlug(title);
    }
  };

  const fetchPost = async () => {
    try {
      const response = await fetch(`/api/posts/${postId}`);
      if (!response.ok) throw new Error('Failed to fetch post');
      
      const post = await response.json();
      
      // Populate form fields
      const form = document.querySelector('form');
      if (form) {
        Object.entries(post).forEach(([key, value]) => {
          const element = form.elements.namedItem(key) as HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement;
          if (element && value !== null) {
            if (key === 'categoryId') {
              setSelectedCategory(value as string);
            } else if (key === 'tags') {
              setTags(value as string[]);
            } else if (key === 'content') {
              setContent(value as string);
            } else if (key === 'thumbnail') {
              setThumbnailPreview(value as string);
            } else {
              element.value = value as string;
            }
          }
        });
      }
    } catch (error) {
      console.error('Error fetching post:', error);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/categories');
      const data = await response.json();
      setCategories(data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const fetchSubcategories = async () => {
    if (!selectedCategory) return;
    
    try {
      const response = await fetch(`/api/subcategories?categoryId=${selectedCategory}`);
      const data = await response.json();
      setSubcategories(data);
    } catch (error) {
      console.error('Error fetching subcategories:', error);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setThumbnailPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleTagAdd = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault();
      if (!tags.includes(tagInput.trim())) {
        setTags([...tags, tagInput.trim()]);
      }
      setTagInput('');
    }
  };

  const handleTagRemove = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newCategoryId = e.target.value;
    setSelectedCategory(newCategoryId);
    setSelectedSubcategory(''); // Reset subcategory when category changes
  };

  const handleSubcategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedSubcategory(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const formElement = e.currentTarget;
      const formData = new FormData(formElement);
      
      // Create a data object from the form data
      const data = {
        title: formData.get('title'),
        slug: formData.get('slug'),
        excerpt: formData.get('excerpt'),
        content: content,
        categoryId: selectedCategory,
        subcategoryId: selectedSubcategory || null,
        tags: tags,
        seoTitle: formData.get('seoTitle'),
        seoDescription: formData.get('seoDescription'),
        seoKeywords: formData.get('seoKeywords'),
        published: formElement.querySelector<HTMLInputElement>('input[name="published"]')?.checked || false,
        thumbnail: thumbnailPreview
      };

      const response = await fetch(`/api/posts/${postId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update post');
      }

      router.push('/dashboard/posts');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      console.error('Error updating post:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-red-50 p-4 rounded-md">
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      <div className="space-y-6">
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
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
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
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          />
        </div>

        <div>
          <label htmlFor="excerpt" className="block text-sm font-medium text-gray-700">
            Excerpt
          </label>
          <textarea
            name="excerpt"
            id="excerpt"
            rows={3}
            defaultValue={initialData?.excerpt}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          />
        </div>

        <div>
          <label htmlFor="content" className="block text-sm font-medium text-gray-700">
            Content
          </label>
          <Editor
            value={content}
            onChange={setContent}
            placeholder="Write your post content here..."
          />
        </div>

        <div>
          <label htmlFor="categoryId" className="block text-sm font-medium text-gray-700">
            Category
          </label>
          <select
            name="categoryId"
            id="categoryId"
            required
            value={selectedCategory}
            onChange={handleCategoryChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          >
            <option value="">Select a category</option>
            {categories.map(category => (
              <option key={category.id} value={category.id}>
                {category.title}
              </option>
            ))}
          </select>
        </div>

        {selectedCategory && (
          <div>
            <label htmlFor="subcategoryId" className="block text-sm font-medium text-gray-700">
              Subcategory
            </label>
            <select
              name="subcategoryId"
              id="subcategoryId"
              value={selectedSubcategory}
              onChange={handleSubcategoryChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            >
              <option value="">Select a subcategory</option>
              {subcategories.map(subcategory => (
                <option key={subcategory.id} value={subcategory.id}>
                  {subcategory.title}
                </option>
              ))}
            </select>
          </div>
        )}

        <div>
          <label htmlFor="tags" className="block text-sm font-medium text-gray-700">
            Tags
          </label>
          <div className="mt-1">
            <input
              type="text"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={handleTagAdd}
              placeholder="Press Enter to add tags"
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
            <div className="mt-2 flex flex-wrap gap-2">
              {tags.map((tag, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                >
                  {tag}
                  <button
                    type="button"
                    onClick={() => handleTagRemove(tag)}
                    className="ml-1 inline-flex items-center p-0.5 rounded-full text-blue-400 hover:bg-blue-200 hover:text-blue-500 focus:outline-none"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>
        </div>

        <div>
          <label htmlFor="thumbnail" className="block text-sm font-medium text-gray-700">
            Thumbnail
          </label>
          <input
            type="file"
            name="thumbnail"
            id="thumbnail"
            accept="image/*"
            onChange={handleImageChange}
            className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          />
          {thumbnailPreview && (
            <div className="mt-2">
              <img
                src={thumbnailPreview}
                alt="Thumbnail preview"
                className="h-32 w-32 object-cover rounded-lg"
              />
            </div>
          )}
        </div>

        <div>
          <label htmlFor="seoTitle" className="block text-sm font-medium text-gray-700">
            SEO Title
          </label>
          <input
            type="text"
            name="seoTitle"
            id="seoTitle"
            defaultValue={initialData?.seoTitle}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          />
        </div>

        <div>
          <label htmlFor="seoDescription" className="block text-sm font-medium text-gray-700">
            SEO Description
          </label>
          <textarea
            name="seoDescription"
            id="seoDescription"
            rows={2}
            defaultValue={initialData?.seoDescription}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
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
            defaultValue={initialData?.seoKeywords}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          />
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            name="published"
            id="published"
            defaultChecked={initialData?.published}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label htmlFor="published" className="ml-2 block text-sm text-gray-900">
            Published
          </label>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
          >
            {loading ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>
    </form>
  );
} 