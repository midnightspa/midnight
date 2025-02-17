'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import type { PostCategory, PostSubCategory } from '@prisma/client';

type CategoryWithSubcategories = PostCategory & {
  subcategories: PostSubCategory[];
};

interface CategoryListProps {
  categories: CategoryWithSubcategories[];
}

export default function CategoryList({ categories: initialCategories }: CategoryListProps) {
  const [categories, setCategories] = useState(initialCategories);
  const [loading, setLoading] = useState<string | null>(null);

  const handleDelete = async (categoryId: string) => {
    if (!confirm('Are you sure you want to delete this category? This action cannot be undone.')) {
      return;
    }

    setLoading(categoryId);

    try {
      const response = await fetch(`/api/categories/${categoryId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete category');
      }

      setCategories(categories.filter(category => category.id !== categoryId));
    } catch (error) {
      console.error('Error deleting category:', error);
      alert('Failed to delete category. Please try again.');
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {categories.map((category) => (
        <div
          key={category.id}
          className="bg-white rounded-lg shadow-md overflow-hidden"
        >
          {category.thumbnail && (
            <div className="relative h-48">
              <Image
                src={category.thumbnail}
                alt={category.title}
                fill
                className="object-cover"
              />
            </div>
          )}
          <div className="p-4">
            <h3 className="text-lg font-semibold mb-2">{category.title}</h3>
            {category.description && (
              <p className="text-gray-600 mb-4 line-clamp-2">
                {category.description}
              </p>
            )}
            <div className="space-y-2">
              <h4 className="font-medium text-sm text-gray-500">
                Subcategories ({category.subcategories.length})
              </h4>
              <div className="flex flex-wrap gap-2">
                {category.subcategories.map((subcategory) => (
                  <Link
                    key={subcategory.id}
                    href={`/categories/${category.slug}/${subcategory.slug}`}
                    className="text-sm bg-gray-100 text-gray-700 px-2 py-1 rounded-full hover:bg-gray-200 transition-colors"
                  >
                    {subcategory.title}
                  </Link>
                ))}
              </div>
            </div>
            <div className="mt-4 flex justify-end space-x-2">
              <Link
                href={`/dashboard/categories/edit/${category.id}`}
                className="text-sm text-blue-600 hover:text-blue-800 font-medium"
              >
                Edit
              </Link>
              <button
                onClick={() => handleDelete(category.id)}
                disabled={loading === category.id}
                className="text-sm text-red-600 hover:text-red-800 font-medium disabled:opacity-50"
              >
                {loading === category.id ? 'Deleting...' : 'Delete'}
              </button>
              <Link
                href={`/dashboard/categories/${category.id}/subcategories/new`}
                className="text-sm text-green-600 hover:text-green-800 font-medium"
              >
                Add Subcategory
              </Link>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
} 