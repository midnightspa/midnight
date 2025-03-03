'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  salePrice: number | null;
  thumbnail: string | null;
  type: 'DIGITAL' | 'PHYSICAL';
  published: boolean;
  featured: boolean;
  createdAt: string;
  slug: string;
  category: {
    id: string;
    title: string;
    slug: string;
  };
  digitalAssets?: string[];
  gallery?: string[];
  stock?: number | null;
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      console.log('Fetching products from dashboard API...');
      const response = await fetch('/api/dashboard/products');
      console.log('Response status:', response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Error response:', errorText);
        throw new Error('Failed to fetch products');
      }
      
      const data = await response.json();
      console.log('Products data:', data);
      
      if (Array.isArray(data)) {
        console.log(`Found ${data.length} products`);
        setProducts(data);
      } else {
        console.error('Unexpected data format:', data);
        setProducts([]);
      }
    } catch (err) {
      console.error('Error in fetchProducts:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch products');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (productId: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return;

    try {
      const response = await fetch(`/api/dashboard/products/${productId}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete product');
      
      setProducts(products.filter(product => product.id !== productId));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete product');
    }
  };

  const handlePublishToggle = async (productId: string, currentStatus: boolean) => {
    try {
      const response = await fetch(`/api/dashboard/products/${productId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ published: !currentStatus }),
      });

      if (!response.ok) throw new Error('Failed to update product status');

      setProducts(products.map(product => 
        product.id === productId 
          ? { ...product, published: !product.published }
          : product
      ));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update product status');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative" role="alert">
        <strong className="font-bold">Error: </strong>
        <span className="block sm:inline">{error}</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">Products</h1>
        <Link
          href="/dashboard/products/new"
          className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Add New Product
        </Link>
      </div>

      {products.length === 0 ? (
        <div className="text-center py-12">
          <h3 className="text-lg font-medium text-gray-900">No products yet</h3>
          <p className="mt-1 text-sm text-gray-500">Get started by creating a new product.</p>
          <div className="mt-6">
            <Link
              href="/dashboard/products/new"
              className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Add New Product
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow duration-200"
            >
              {product.thumbnail && (
                <div className="relative h-48 w-full">
                  <Image
                    src={product.thumbnail}
                    alt={product.title}
                    fill
                    className="object-cover"
                  />
                </div>
              )}
              <div className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 line-clamp-1">
                      {product.title}
                    </h3>
                    <div className="flex gap-2 mt-1">
                      <span className="inline-block px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-800">
                        {product.type}
                      </span>
                      {product.category && (
                        <span className="inline-block px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
                          {product.category.title}
                        </span>
                      )}
                      {product.featured && (
                        <span className="inline-block px-2 py-1 text-xs font-medium rounded-full bg-purple-100 text-purple-800">
                          Featured
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handlePublishToggle(product.id, product.published)}
                      className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                        product.published ? 'bg-blue-600' : 'bg-gray-200'
                      }`}
                    >
                      <span className="sr-only">
                        {product.published ? 'Unpublish' : 'Publish'}
                      </span>
                      <span
                        className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                          product.published ? 'translate-x-5' : 'translate-x-0'
                        }`}
                      />
                    </button>
                  </div>
                </div>
                <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                  {product.description}
                </p>
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <div className="space-y-1">
                    <div>
                      <span className="font-medium text-gray-900">
                        ${product.salePrice || product.price}
                      </span>
                      {product.salePrice && (
                        <span className="ml-2 line-through">
                          ${product.price}
                        </span>
                      )}
                    </div>
                    {product.stock !== null && (
                      <div className="text-xs">
                        Stock: {product.stock}
                      </div>
                    )}
                    {product.digitalAssets && product.digitalAssets.length > 0 && (
                      <div className="text-xs text-blue-600">
                        {product.digitalAssets.length} digital assets
                      </div>
                    )}
                  </div>
                  <div className="flex space-x-2">
                    <Link
                      href={`/dashboard/products/edit/${product.id}`}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => handleDelete(product.id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
} 