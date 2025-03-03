'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface Category {
  id: string;
  title: string;
  description: string | null;
  thumbnail: string | null;
  slug: string;
  seoTitle: string | null;
  seoDescription: string | null;
  seoKeywords: string | null;
  type: 'DIGITAL' | 'PHYSICAL';
  createdAt: string;
}

export default function ProductCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/(dashboard)/products/categories');
      if (!response.ok) throw new Error('Failed to fetch categories');
      const data = await response.json();
      setCategories(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch categories');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (categoryId: string) => {
    if (!confirm('Are you sure you want to delete this category?')) return;

    try {
      const response = await fetch(`/api/(dashboard)/products/categories/${categoryId}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete category');
      
      setCategories(categories.filter(category => category.id !== categoryId));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete category');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative" role="alert">
        <strong className="font-bold">Error: </strong>
        <span className="block sm:inline">{error}</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">Product Categories</h1>
        <Link
          href="/dashboard/products/categories/new"
          className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Add New Category
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((category) => (
          <div
            key={category.id}
            className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200 hover:shadow-md transition-shadow duration-200"
          >
            {category.thumbnail && (
              <div className="relative h-48 w-full">
                <Image
                  src={category.thumbnail}
                  alt={category.title}
                  fill
                  className="object-cover"
                />
              </div>
            )}
            <div className="p-4">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    {category.title}
                  </h3>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    {category.type}
                  </span>
                </div>
              </div>
              <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                {category.description || 'No description available'}
              </p>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500">
                  {new Date(category.createdAt).toLocaleDateString()}
                </span>
                <div className="flex space-x-2">
                  <Link
                    href={`/dashboard/products/categories/edit/${category.id}`}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => handleDelete(category.id)}
                    className="text-red-600 hover:text-red-800"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 