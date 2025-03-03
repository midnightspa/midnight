'use client';

import DigitalProductForm from './DigitalProductForm';

interface NewProductClientProps {
  categories: {
    id: string;
    title: string;
  }[];
}

export default function NewProductClient({ categories }: NewProductClientProps) {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold text-neutral-900 mb-8">Create New Digital Product</h1>
        <div className="bg-white rounded-xl shadow-sm p-6">
          <DigitalProductForm categories={categories} />
        </div>
      </div>
    </div>
  );
} 