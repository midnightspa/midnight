'use client';

import React from 'react';

interface Category {
  id: string;
  title: string;
  slug: string;
}

interface BasicInformationProps {
  categories: Category[];
  onTitleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function BasicInformation({ categories, onTitleChange }: BasicInformationProps) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm space-y-4">
      <h2 className="text-lg font-medium text-gray-900">Basic Information</h2>
      
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700">
          Title
        </label>
        <input
          type="text"
          name="title"
          id="title"
          required
          onChange={onTitleChange}
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
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
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
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        >
          <option value="">Select a category</option>
          {categories.map(category => (
            <option key={category.id} value={category.id}>
              {category.title}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
} 