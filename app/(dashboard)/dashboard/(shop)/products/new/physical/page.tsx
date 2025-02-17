import React from 'react';
import PhysicalProductForm from '../components/PhysicalProductForm';

export default function NewPhysicalProductPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Add Physical Product</h1>
      <PhysicalProductForm />
    </div>
  );
} 