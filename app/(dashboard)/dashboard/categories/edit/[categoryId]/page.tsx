import React from 'react';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/auth.config';
import prisma from '@/lib/prisma';
import { redirect } from 'next/navigation';
import CategoryForm from '../../components/CategoryForm';

interface PageProps {
  params: {
    categoryId: string;
  };
  searchParams: { [key: string]: string | string[] | undefined };
}

export default async function EditCategoryPage({ params }: { params: { categoryId: string } }) {
  const resolvedParams = await params;
  const categoryId = resolvedParams.categoryId;

  const session = await getServerSession(authOptions);
  
  if (!session) {
    redirect('/auth/signin');
  }

  // Try to find as category first
  let item = await prisma.postCategory.findUnique({
    where: { id: categoryId },
  });

  // If not found as category, try to find as subcategory
  if (!item) {
    item = await prisma.postSubCategory.findUnique({
      where: { id: categoryId },
    });
  }

  if (!item) {
    redirect('/dashboard/categories');
  }

  return (
    <div className="py-8 px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-2xl font-semibold text-gray-900">Edit Category</h1>
        <p className="mt-2 text-sm text-gray-600">
          Update your category or subcategory details.
        </p>
        <div className="mt-6">
          <CategoryForm initialData={item} />
        </div>
      </div>
    </div>
  );
} 