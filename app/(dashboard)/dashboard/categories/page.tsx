import React from 'react';
import prisma from '@/lib/prisma';
import CategoryList from './components/CategoryList';
import CreateCategoryButton from './components/CreateCategoryButton';

export default async function CategoriesPage() {
  const categories = await prisma.postCategory.findMany({
    include: {
      subcategories: true,
    },
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">Categories</h1>
        <CreateCategoryButton />
      </div>

      <CategoryList categories={categories} />
    </div>
  );
} 