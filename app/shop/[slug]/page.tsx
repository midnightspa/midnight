'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Poppins } from 'next/font/google';
import { useCart } from '../../contexts/CartContext';

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
});

interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  salePrice?: number | null;
  thumbnail: string | null;
  gallery: string[];
  type: 'DIGITAL' | 'PHYSICAL';
  stock: number | null;
  digitalAssets: string[];
  slug: string;
  category: {
    id: string;
    title: string;
    slug: string;
  };
  bundles: {
    id: string;
    title: string;
    slug: string;
  }[];
}

export default function ProductPage({ params }: { params: { slug: string } }) {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const { addItem } = useCart();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`/api/products/slug/${params.slug}`);
        if (!response.ok) {
          if (response.status === 404) {
            throw new Error('Product not found');
          }
          throw new Error('Failed to fetch product');
        }
        const data = await response.json();
        setProduct(data);
        setSelectedImage(data.thumbnail);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch product');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [params.slug]);

  const handleQuantityChange = (value: number) => {
    if (product?.type === 'PHYSICAL') {
      const newQuantity = Math.max(1, Math.min(value, product.stock || 1));
      setQuantity(newQuantity);
    }
  };

  const handleAddToCart = () => {
    if (!product) return;

    addItem({
      id: product.id,
      title: product.title,
      price: product.price,
      salePrice: product.salePrice,
      quantity,
      type: product.type,
      thumbnail: product.thumbnail,
    });

    // Optional: Show a success message or notification
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-neutral-200 border-t-neutral-900 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-semibold text-red-600 mb-4">Error</h1>
          <p className="text-gray-600 mb-4">{error || 'Product not found'}</p>
          <Link href="/shop" className="text-blue-600 hover:underline">
            Return to shop
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-neutral-50 ${poppins.className}`}>
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <nav className="mb-8">
          <ol className="flex items-center space-x-2 text-sm">
            <li>
              <Link href="/shop" className="text-neutral-600 hover:text-neutral-900">
                Shop
              </Link>
            </li>
            <li className="text-neutral-400">/</li>
            <li>
              <Link
                href={`/categories/${product.category.slug}`}
                className="text-neutral-600 hover:text-neutral-900"
              >
                {product.category.title}
              </Link>
            </li>
            <li className="text-neutral-400">/</li>
            <li className="text-neutral-900 font-medium">{product.title}</li>
          </ol>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="aspect-square relative rounded-xl overflow-hidden bg-white">
              <Image
                src={selectedImage || product.thumbnail || '/placeholder.jpg'}
                alt={product.title}
                fill
                className="object-contain"
              />
            </div>
            {product.gallery.length > 0 && (
              <div className="grid grid-cols-4 gap-4">
                <button
                  onClick={() => setSelectedImage(product.thumbnail)}
                  className={`aspect-square relative rounded-lg overflow-hidden bg-white ${
                    selectedImage === product.thumbnail ? 'ring-2 ring-blue-500' : ''
                  }`}
                >
                  <Image
                    src={product.thumbnail || '/placeholder.jpg'}
                    alt={product.title}
                    fill
                    className="object-cover"
                  />
                </button>
                {product.gallery.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(image)}
                    className={`aspect-square relative rounded-lg overflow-hidden bg-white ${
                      selectedImage === image ? 'ring-2 ring-blue-500' : ''
                    }`}
                  >
                    <Image
                      src={image}
                      alt={`${product.title} - Image ${index + 1}`}
                      fill
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div>
            <div className="bg-white rounded-xl p-8">
              <h1 className="text-3xl font-bold text-neutral-900 mb-4">
                {product.title}
              </h1>

              <div className="flex items-baseline gap-4 mb-6">
                {product.salePrice ? (
                  <>
                    <span className="text-3xl font-bold text-neutral-900">
                      ${product.salePrice}
                    </span>
                    <span className="text-xl text-neutral-500 line-through">
                      ${product.price}
                    </span>
                  </>
                ) : (
                  <span className="text-3xl font-bold text-neutral-900">
                    ${product.price}
                  </span>
                )}
              </div>

              <div className="prose prose-neutral mb-8">
                <p>{product.description}</p>
              </div>

              {product.type === 'PHYSICAL' && (
                <div className="mb-8">
                  <p className="text-sm text-neutral-600 mb-2">
                    Stock: {product.stock} available
                  </p>
                  <div className="flex items-center gap-4">
                    <label htmlFor="quantity" className="text-sm font-medium text-neutral-900">
                      Quantity
                    </label>
                    <div className="flex items-center">
                      <button
                        onClick={() => handleQuantityChange(quantity - 1)}
                        className="w-8 h-8 flex items-center justify-center border border-neutral-300 rounded-l-md hover:bg-neutral-50"
                      >
                        -
                      </button>
                      <input
                        type="number"
                        id="quantity"
                        value={quantity}
                        onChange={(e) => handleQuantityChange(Number(e.target.value))}
                        className="w-16 h-8 border-y border-neutral-300 text-center"
                      />
                      <button
                        onClick={() => handleQuantityChange(quantity + 1)}
                        className="w-8 h-8 flex items-center justify-center border border-neutral-300 rounded-r-md hover:bg-neutral-50"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
              )}

              <button
                onClick={handleAddToCart}
                className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-700 transition-colors"
              >
                Add to Cart
              </button>

              {/* Product Type Badge */}
              <div className="mt-8 flex items-center gap-2">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  product.type === 'DIGITAL'
                    ? 'bg-blue-100 text-blue-800'
                    : 'bg-green-100 text-green-800'
                }`}>
                  {product.type.charAt(0) + product.type.slice(1).toLowerCase()} Product
                </span>
              </div>

              {/* Digital Product Info */}
              {product.type === 'DIGITAL' && product.digitalAssets.length > 0 && (
                <div className="mt-8">
                  <h3 className="text-lg font-semibold mb-4">Included Files</h3>
                  <ul className="space-y-2">
                    {product.digitalAssets.map((asset, index) => (
                      <li key={index} className="flex items-center gap-2 text-sm text-neutral-600">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        <span>{asset.split('/').pop()}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Bundles */}
              {product.bundles.length > 0 && (
                <div className="mt-8">
                  <h3 className="text-lg font-semibold mb-4">Available in Bundles</h3>
                  <div className="space-y-4">
                    {product.bundles.map((bundle) => (
                      <Link
                        key={bundle.id}
                        href={`/shop/bundles/${bundle.slug}`}
                        className="block bg-neutral-50 p-4 rounded-lg hover:bg-neutral-100 transition-colors"
                      >
                        <h4 className="font-medium text-neutral-900">{bundle.title}</h4>
                        <p className="text-sm text-neutral-600 mt-1">
                          View bundle details →
                        </p>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 