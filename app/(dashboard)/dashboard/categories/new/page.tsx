import React from 'react';
import CategoryForm from '../components/CategoryForm';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/auth.config';
import { redirect } from 'next/navigation';

export default async function NewCategoryPage() {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    redirect('/auth/signin');
  }

  return (
    <div className="py-8 px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-2xl font-semibold text-gray-900">Create New Category</h1>
        <p className="mt-2 text-sm text-gray-600">
          Create a new category or subcategory for organizing your content.
        </p>
        <div className="mt-6">
          <CategoryForm />
        </div>
      </div>
    </div>
  );
} 