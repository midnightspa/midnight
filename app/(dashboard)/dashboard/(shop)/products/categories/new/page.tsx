import React from 'react';
import CategoryForm from '../components/CategoryForm';

export default function NewProductCategoryPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Add New Product Category</h1>
      <CategoryForm />
    </div>
  );
} 