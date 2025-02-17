'use client';

import React from 'react';
import Link from 'next/link';

export default function NewProductPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Add New Product</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Digital Product Card */}
        <Link
          href="/dashboard/products/new/digital"
          className="group block"
        >
          <div className="bg-white rounded-xl p-6 border-2 border-transparent hover:border-blue-500 transition-all duration-300 shadow-sm hover:shadow-md">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
                </svg>
              </div>
              <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center group-hover:bg-blue-100 transition-colors">
                <svg className="w-5 h-5 text-blue-600 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Digital Product</h2>
            <p className="text-gray-600">
              Create a digital product like eBooks, PDFs, spreadsheets, or digital assets.
            </p>
          </div>
        </Link>

        {/* Physical Product Card */}
        <Link
          href="/dashboard/products/new/physical"
          className="group block"
        >
          <div className="bg-white rounded-xl p-6 border-2 border-transparent hover:border-green-500 transition-all duration-300 shadow-sm hover:shadow-md">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>
              <div className="w-8 h-8 rounded-full bg-green-50 flex items-center justify-center group-hover:bg-green-100 transition-colors">
                <svg className="w-5 h-5 text-green-600 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Physical Product</h2>
            <p className="text-gray-600">
              Create a physical product with inventory management and shipping details.
            </p>
          </div>
        </Link>
      </div>
    </div>
  );
} 