'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Poppins } from 'next/font/google';
import { useCart } from '@/app/contexts/CartContext';
import { useParams } from 'next/navigation';

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
});

interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  salePrice: number | null;
  thumbnail: string | null;
  gallery: string[];
  stock: number | null;
  slug: string;
  category: {
    id: string;
    title: string;
    slug: string;
  };
}

const shimmer = (w: number, h: number) => `
<svg width="${w}" height="${h}" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
  <defs>
    <linearGradient id="g">
      <stop stop-color="#f6f7f8" offset="20%" />
      <stop stop-color="#edeef1" offset="50%" />
      <stop stop-color="#f6f7f8" offset="70%" />
    </linearGradient>
  </defs>
  <rect width="${w}" height="${h}" fill="#f6f7f8" />
  <rect id="r" width="${w}" height="${h}" fill="url(#g)" />
  <animate xlink:href="#r" attributeName="x" from="-${w}" to="${w}" dur="1s" repeatCount="indefinite"  />
</svg>`;

const toBase64 = (str: string) =>
  typeof window === 'undefined'
    ? Buffer.from(str).toString('base64')
    : window.btoa(str);

export default function ProductPage() {
  const params = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const { addItem } = useCart();
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const resolvedParams = await params;
        const response = await fetch(`/api/shop/products/${resolvedParams.slug}`);
        if (!response.ok) throw new Error('Product not found');
        const data = await response.json();
        setProduct(data);
        setSelectedImage(data.thumbnail);
      } catch (error) {
        console.error('Error fetching product:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [params]);

  const handleAddToCart = () => {
    if (!product) return;
    addItem({
      id: product.id,
      title: product.title,
      price: product.salePrice || product.price,
      quantity,
      thumbnail: product.thumbnail,
      type: 'PHYSICAL',
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-neutral-900"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-semibold text-neutral-900 mb-4">Product not found</h1>
          <Link href="/shop" className="text-blue-600 hover:text-blue-700">
            Return to Shop
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-neutral-50 ${poppins.className}`}>
      <div className="container mx-auto px-4 py-12">
        <div className="flex flex-col lg:flex-row gap-12">
          {/* Product Images */}
          <div className="lg:w-2/3 space-y-6">
            {/* Main Image */}
            <div className="aspect-[4/3] relative rounded-xl overflow-hidden bg-white">
              <Image
                src={selectedImage || product.thumbnail || '/placeholder.jpg'}
                alt={product.title}
                fill
                className="object-contain"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                placeholder="blur"
                blurDataURL={`data:image/svg+xml;base64,${toBase64(shimmer(700, 475))}`}
              />
            </div>

            {/* Thumbnail Gallery */}
            {product.gallery.length > 0 && (
              <div className="grid grid-cols-4 gap-4">
                <button
                  onClick={() => setSelectedImage(product.thumbnail)}
                  className={`aspect-square relative rounded-lg overflow-hidden ${
                    selectedImage === product.thumbnail ? 'ring-2 ring-neutral-900' : ''
                  }`}
                >
                  <Image
                    src={product.thumbnail || '/placeholder.jpg'}
                    alt={product.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 25vw, 20vw"
                  />
                </button>
                {product.gallery.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(image)}
                    className={`aspect-square relative rounded-lg overflow-hidden ${
                      selectedImage === image ? 'ring-2 ring-neutral-900' : ''
                    }`}
                  >
                    <Image
                      src={image}
                      alt={`${product.title} - Image ${index + 1}`}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 25vw, 20vw"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="lg:w-1/3 space-y-8">
            <div>
              <Link
                href={`/shop/categories/${product.category.slug}`}
                className="text-sm text-neutral-600 hover:text-neutral-900"
              >
                {product.category.title}
              </Link>
              <h1 className="text-3xl font-semibold text-neutral-900 mt-2">
                {product.title}
              </h1>
              <div className="mt-4 space-y-1">
                {product.salePrice ? (
                  <>
                    <span className="text-2xl font-semibold text-neutral-900">
                      ${product.salePrice}
                    </span>
                    <span className="text-lg text-neutral-500 line-through block">
                      ${product.price}
                    </span>
                  </>
                ) : (
                  <span className="text-2xl font-semibold text-neutral-900">
                    ${product.price}
                  </span>
                )}
              </div>
            </div>

            <div className="prose prose-neutral">
              <p>{product.description}</p>
            </div>

            {/* Stock Status */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <span className="text-sm font-medium text-neutral-700">
                  Stock:
                </span>
                <span className={`text-sm ${
                  (product.stock || 0) > 0 ? 'text-green-600' : 'text-red-600'
                }`}>
                  {(product.stock || 0) > 0 ? 'In Stock' : 'Out of Stock'}
                </span>
              </div>
              {(product.stock || 0) > 0 && (
                <div className="flex items-center gap-4 mb-6">
                  <label htmlFor="quantity" className="text-sm font-medium text-neutral-700">
                    Quantity:
                  </label>
                  <input
                    type="number"
                    id="quantity"
                    min="1"
                    max={product.stock || 1}
                    value={quantity}
                    onChange={(e) => setQuantity(parseInt(e.target.value))}
                    className="w-20 px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-900"
                  />
                </div>
              )}
            </div>

            {/* Add to Cart Button */}
            <div className="flex flex-col gap-4">
              <button
                onClick={handleAddToCart}
                disabled={(product.stock || 0) <= 0}
                className="w-full px-6 py-3 bg-neutral-900 text-white rounded-xl hover:bg-neutral-800 transition-colors disabled:bg-neutral-300 disabled:cursor-not-allowed"
              >
                Add to Cart
              </button>
              <button className="w-full px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors">
                Buy Now
              </button>
            </div>

            {/* Social Proof */}
            <div className="border-t border-neutral-200 pt-8">
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-2xl font-semibold text-neutral-900">4.9/5</div>
                  <div className="text-sm text-neutral-600">Customer Rating</div>
                </div>
                <div>
                  <div className="text-2xl font-semibold text-neutral-900">1.2k+</div>
                  <div className="text-sm text-neutral-600">Happy Customers</div>
                </div>
                <div>
                  <div className="text-2xl font-semibold text-neutral-900">24/7</div>
                  <div className="text-sm text-neutral-600">Support</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 