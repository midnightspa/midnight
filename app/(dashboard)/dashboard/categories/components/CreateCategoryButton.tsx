'use client';

import React from 'react';
import Link from 'next/link';

export default function CreateCategoryButton() {
  return (
    <Link
      href="/dashboard/categories/new"
      className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
    >
      Create Category
    </Link>
  );
} 