'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Poppins } from 'next/font/google';
import { useCart } from '@/app/contexts/CartContext';
import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';

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
  type: 'DIGITAL' | 'PHYSICAL';
  slug: string;
  category: {
    id: string;
    title: string;
    slug: string;
  };
  reviews?: {
    id: string;
    rating: number;
    comment: string;
    userName: string;
    date: string;
    verified: boolean;
  }[];
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
  const [activeTab, setActiveTab] = useState<'description' | 'reviews'>('description');
  const [showNotification, setShowNotification] = useState(false);

  // Mock reviews data (replace with actual data in production)
  const mockReviews = [
    {
      id: '1',
      rating: 5,
      comment: "Absolutely love this product! The quality is outstanding.",
      userName: "Sarah M.",
      date: "2024-03-15",
      verified: true
    },
    {
      id: '2',
      rating: 4,
      comment: "Great value for money. Would definitely recommend.",
      userName: "John D.",
      date: "2024-03-10",
      verified: true
    }
  ];

  // FOMO notifications
  useEffect(() => {
    const interval = setInterval(() => {
      setShowNotification(true);
      setTimeout(() => setShowNotification(false), 4000);
    }, 10000);

    return () => clearInterval(interval);
  }, []);

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
    console.log('Adding product to cart with type:', product.type);
    addItem({
      id: product.id,
      title: product.title,
      price: product.salePrice || product.price,
      quantity,
      thumbnail: product.thumbnail,
      type: product.type,
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
      {/* FOMO Notification */}
      {showNotification && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
          className="fixed bottom-4 left-4 bg-white p-4 rounded-lg shadow-lg z-50 max-w-sm"
        >
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <p className="text-sm">
              Someone from New York just purchased this item 2 minutes ago
            </p>
          </div>
        </motion.div>
      )}

      <div className="container mx-auto px-4 py-12">
        <div className="flex flex-col lg:flex-row gap-12">
          {/* Product Images */}
          <div className="lg:w-2/3 space-y-6">
            {/* Main Image */}
            <div className="aspect-[4/3] relative rounded-xl overflow-hidden bg-white">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                <Image
                  src={selectedImage || product?.thumbnail || '/placeholder.jpg'}
                  alt={product?.title || ''}
                  fill
                  className="object-contain"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  placeholder="blur"
                  blurDataURL={`data:image/svg+xml;base64,${toBase64(shimmer(700, 475))}`}
                />
              </motion.div>
            </div>

            {/* Thumbnail Gallery */}
            {product?.gallery && product.gallery.length > 0 && (
              <div className="grid grid-cols-6 gap-4">
                <button
                  onClick={() => setSelectedImage(product.thumbnail)}
                  className={`aspect-square relative rounded-lg overflow-hidden transition-all duration-200 ${
                    selectedImage === product.thumbnail ? 'ring-2 ring-blue-600 scale-95' : 'hover:scale-95'
                  }`}
                >
                  <Image
                    src={product.thumbnail || '/placeholder.jpg'}
                    alt={product.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 16vw, 8vw"
                  />
                </button>
                {product.gallery.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(image)}
                    className={`aspect-square relative rounded-lg overflow-hidden transition-all duration-200 ${
                      selectedImage === image ? 'ring-2 ring-blue-600 scale-95' : 'hover:scale-95'
                    }`}
                  >
                    <Image
                      src={image}
                      alt={`${product.title} - Image ${index + 1}`}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 16vw, 8vw"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="lg:w-1/3 space-y-8">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Link
                  href={`/shop/categories/${product?.category.slug}`}
                  className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                >
                  {product?.category.title}
                </Link>
                <span className="text-neutral-300">•</span>
                <div className="flex items-center gap-1">
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <svg
                        key={star}
                        className={`w-4 h-4 ${star <= 4.5 ? 'text-yellow-400' : 'text-neutral-200'}`}
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <span className="text-sm text-neutral-600">(128 reviews)</span>
                </div>
              </div>

              <h1 className="text-3xl font-bold text-neutral-900 mb-4">
                {product?.title}
              </h1>

              <div className="flex items-center gap-4 mb-6">
                {product?.salePrice ? (
                  <>
                    <span className="text-3xl font-bold text-blue-600">
                      ${product.salePrice}
                    </span>
                    <span className="text-xl text-neutral-400 line-through">
                      ${product.price}
                    </span>
                    <span className="px-2 py-1 bg-red-100 text-red-700 text-sm font-medium rounded-full">
                      Save ${(product.price - product.salePrice).toFixed(2)}
                    </span>
                  </>
                ) : (
                  <span className="text-3xl font-bold text-neutral-900">
                    ${product?.price}
                  </span>
                )}
              </div>
            </div>

            {/* Social Proof */}
            <div className="bg-blue-50 rounded-xl p-4 space-y-3">
              <div className="flex items-center gap-3">
                <div className="flex -space-x-2">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="w-8 h-8 rounded-full bg-neutral-200 border-2 border-white" />
                  ))}
                </div>
                <p className="text-sm text-neutral-600">
                  <span className="font-semibold">89 people</span> are viewing this right now
                </p>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                <p className="text-sm text-neutral-600">
                  <span className="font-semibold">23 orders</span> placed in the last 24 hours
                </p>
              </div>
            </div>

            {/* Stock Status and Quantity */}
            {product?.type === 'PHYSICAL' && (
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${(product?.stock || 0) > 0 ? 'bg-green-500' : 'bg-red-500'}`} />
                  <span className="text-sm font-medium">
                    {(product?.stock || 0) > 0 ? (
                      <>
                        <span className="text-green-600">In Stock</span>
                        <span className="text-neutral-600"> - only {product?.stock} left</span>
                      </>
                    ) : (
                      <span className="text-red-600">Out of Stock</span>
                    )}
                  </span>
                </div>

                {(product?.stock || 0) > 0 && (
                  <div className="flex items-center gap-4">
                    <div className="flex items-center">
                      <button
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        className="w-10 h-10 flex items-center justify-center border border-neutral-200 rounded-l-lg hover:bg-neutral-50"
                      >
                        -
                      </button>
                      <input
                        type="number"
                        value={quantity}
                        onChange={(e) => setQuantity(Math.min(product.stock || 1, Math.max(1, parseInt(e.target.value))))}
                        className="w-16 h-10 border-y border-neutral-200 text-center focus:outline-none"
                      />
                      <button
                        onClick={() => setQuantity(Math.min(product.stock || 1, quantity + 1))}
                        className="w-10 h-10 flex items-center justify-center border border-neutral-200 rounded-r-lg hover:bg-neutral-50"
                      >
                        +
                      </button>
                    </div>
                    <span className="text-sm text-neutral-600">
                      {product?.stock} pieces available
                    </span>
                  </div>
                )}
              </div>
            )}

            {/* Add to Cart and Buy Now */}
            <div className="space-y-4">
              <button
                onClick={handleAddToCart}
                disabled={product?.type === 'PHYSICAL' && (product?.stock || 0) <= 0}
                className="w-full px-6 py-4 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors disabled:bg-neutral-200 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
                {product?.type === 'DIGITAL' ? 'Add to Cart (Digital Product)' : 'Add to Cart'}
              </button>
              <button className="w-full px-6 py-4 bg-neutral-900 text-white rounded-xl font-medium hover:bg-neutral-800 transition-colors flex items-center justify-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                {product?.type === 'DIGITAL' ? 'Buy Now (Instant Download)' : 'Buy Now'}
              </button>
            </div>

            {/* Trust Badges */}
            <div className="grid grid-cols-3 gap-4 py-6 border-y border-neutral-200">
              <div className="text-center">
                <svg className="w-6 h-6 mx-auto text-neutral-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-xs text-neutral-600">Fast Delivery</p>
              </div>
              <div className="text-center">
                <svg className="w-6 h-6 mx-auto text-neutral-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                <p className="text-xs text-neutral-600">Secure Payment</p>
              </div>
              <div className="text-center">
                <svg className="w-6 h-6 mx-auto text-neutral-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                <p className="text-xs text-neutral-600">Free Returns</p>
              </div>
            </div>
          </div>
        </div>

        {/* Product Details Tabs */}
        <div className="mt-16">
          <div className="border-b border-neutral-200">
            <div className="container mx-auto">
              <div className="flex gap-8">
                <button
                  onClick={() => setActiveTab('description')}
                  className={`px-4 py-4 font-medium text-sm transition-colors relative ${
                    activeTab === 'description'
                      ? 'text-blue-600'
                      : 'text-neutral-600 hover:text-neutral-900'
                  }`}
                >
                  Description
                  {activeTab === 'description' && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600"
                    />
                  )}
                </button>
                <button
                  onClick={() => setActiveTab('reviews')}
                  className={`px-4 py-4 font-medium text-sm transition-colors relative ${
                    activeTab === 'reviews'
                      ? 'text-blue-600'
                      : 'text-neutral-600 hover:text-neutral-900'
                  }`}
                >
                  Reviews (128)
                  {activeTab === 'reviews' && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600"
                    />
                  )}
                </button>
              </div>
            </div>
          </div>

          <div className="container mx-auto py-8">
            {activeTab === 'description' ? (
              <div className="prose prose-neutral max-w-none">
                <p>{product?.description}</p>
              </div>
            ) : (
              <div className="space-y-8">
                {/* Review Summary */}
                <div className="flex items-start gap-8">
                  <div className="text-center">
                    <div className="text-5xl font-bold text-neutral-900 mb-2">4.8</div>
                    <div className="flex justify-center mb-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <svg
                          key={star}
                          className="w-5 h-5 text-yellow-400"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                    <p className="text-sm text-neutral-600">Based on 128 reviews</p>
                  </div>

                  <div className="flex-1 space-y-2">
                    {[5, 4, 3, 2, 1].map((rating) => (
                      <div key={rating} className="flex items-center gap-4">
                        <div className="text-sm text-neutral-600 w-6">{rating}</div>
                        <div className="flex-1 h-2 bg-neutral-100 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-yellow-400"
                            style={{
                              width: `${rating === 5 ? 70 : rating === 4 ? 20 : 10}%`,
                            }}
                          />
                        </div>
                        <div className="text-sm text-neutral-600 w-12">
                          {rating === 5 ? '70%' : rating === 4 ? '20%' : '10%'}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Review List */}
                <div className="space-y-6">
                  {mockReviews.map((review) => (
                    <div key={review.id} className="border-b border-neutral-200 pb-6">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-full bg-neutral-200" />
                          <div>
                            <div className="flex items-center gap-2">
                              <h4 className="font-medium text-neutral-900">
                                {review.userName}
                              </h4>
                              {review.verified && (
                                <span className="text-xs text-green-600 font-medium px-2 py-0.5 bg-green-50 rounded-full">
                                  Verified Purchase
                                </span>
                              )}
                            </div>
                            <div className="flex items-center gap-2">
                              <div className="flex">
                                {[1, 2, 3, 4, 5].map((star) => (
                                  <svg
                                    key={star}
                                    className={`w-4 h-4 ${
                                      star <= review.rating
                                        ? 'text-yellow-400'
                                        : 'text-neutral-200'
                                    }`}
                                    fill="currentColor"
                                    viewBox="0 0 20 20"
                                  >
                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                  </svg>
                                ))}
                              </div>
                              <span className="text-sm text-neutral-500">
                                {new Date(review.date).toLocaleDateString()}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <p className="text-neutral-600">{review.comment}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 