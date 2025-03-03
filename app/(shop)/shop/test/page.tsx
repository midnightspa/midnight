'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Poppins } from 'next/font/google';
import { useCart } from '@/app/contexts/CartContext';
import { motion } from 'framer-motion';
import { FiShoppingBag, FiHeart, FiEye, FiFilter, FiChevronDown, FiX } from 'react-icons/fi';

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
  stock: number | null;
  published: boolean;
  featured: boolean;
  slug: string;
  category: {
    id: string;
    title: string;
    slug: string;
  };
}

interface Category {
  id: string;
  title: string;
  slug: string;
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

export default function ShopPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000]);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const { addItem } = useCart();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const params = new URLSearchParams();
        if (selectedCategory) params.append('category', selectedCategory);
        params.append('minPrice', priceRange[0].toString());
        params.append('maxPrice', priceRange[1].toString());

        const url = `/api/shop/products?${params.toString()}`;
        console.log('Fetching products from URL:', url);
        
        const response = await fetch(url);
        console.log('Response status:', response.status);
        
        if (!response.ok) {
          const errorText = await response.text();
          console.error('Error response:', errorText);
          throw new Error('Failed to fetch products');
        }
        
        const data = await response.json();
        console.log('Products response data:', data);
        
        if (Array.isArray(data)) {
          console.log(`Found ${data.length} products`);
          setProducts(data);
        } else {
          console.error('Unexpected data format:', data);
          setProducts([]);
        }
      } catch (error) {
        console.error('Error fetching products:', error);
        setProducts([]);
      }
    };

    const fetchCategories = async () => {
      try {
        console.log('Fetching categories...');
        const response = await fetch('/api/shop/products/categories');
        if (!response.ok) throw new Error('Failed to fetch categories');
        const data = await response.json();
        console.log('Categories response:', data);
        setCategories(data);
      } catch (error) {
        console.error('Error fetching categories:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
    fetchCategories();
  }, [selectedCategory, priceRange]);

  const handleAddToCart = (product: Product, e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    if (!product) return;
    addItem({
      id: product.id,
      title: product.title,
      price: product.salePrice || product.price,
      quantity: 1,
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

  return (
    <div className={`min-h-screen bg-neutral-50 ${poppins.className}`}>
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
        <div className="container mx-auto px-4 py-16 md:py-24">
          <div className="max-w-2xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Discover Our Products</h1>
            <p className="text-lg md:text-xl opacity-90 mb-8">
              Explore our curated collection of premium products designed for your lifestyle.
            </p>
            <div className="flex flex-wrap gap-4">
              <button 
                onClick={() => setSelectedCategory(null)}
                className="px-6 py-3 bg-white text-blue-700 rounded-full font-medium hover:bg-opacity-90 transition-colors"
              >
                Shop All
              </button>
              {categories.slice(0, 3).map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.slug)}
                  className="px-6 py-3 bg-blue-800 bg-opacity-30 rounded-full font-medium hover:bg-opacity-50 transition-colors"
                >
                  {category.title}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        {/* Mobile Filter Button */}
        <div className="lg:hidden mb-6">
          <button
            onClick={() => setMobileFiltersOpen(true)}
            className="w-full flex items-center justify-center gap-2 bg-white rounded-xl p-4 shadow-sm"
          >
            <FiFilter className="w-5 h-5" />
            <span className="font-medium">Filters</span>
          </button>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Mobile Filters Overlay */}
          {mobileFiltersOpen && (
            <div className="fixed inset-0 bg-black bg-opacity-50 z-50 lg:hidden">
              <div className="absolute right-0 top-0 h-full w-80 bg-white p-6 overflow-y-auto">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold">Filters</h2>
                  <button 
                    onClick={() => setMobileFiltersOpen(false)}
                    className="p-2 hover:bg-neutral-100 rounded-full"
                  >
                    <FiX className="w-5 h-5" />
                  </button>
                </div>
                
                {/* Categories */}
                <div className="mb-8">
                  <h3 className="text-lg font-semibold mb-4">Categories</h3>
                  <div className="space-y-2">
                    <button
                      onClick={() => {
                        setSelectedCategory(null);
                        setMobileFiltersOpen(false);
                      }}
                      className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                        !selectedCategory
                          ? 'bg-blue-600 text-white'
                          : 'hover:bg-neutral-100'
                      }`}
                    >
                      All Categories
                    </button>
                    {categories.map((category) => (
                      <button
                        key={category.id}
                        onClick={() => {
                          setSelectedCategory(category.slug);
                          setMobileFiltersOpen(false);
                        }}
                        className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                          selectedCategory === category.slug
                            ? 'bg-blue-600 text-white'
                            : 'hover:bg-neutral-100'
                        }`}
                      >
                        {category.title}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Price Range Filter */}
                <div>
                  <h3 className="text-lg font-semibold mb-4">Price Range</h3>
                  <div className="space-y-4">
                    <input
                      type="range"
                      min="0"
                      max="1000"
                      step="10"
                      value={priceRange[1]}
                      onChange={(e) =>
                        setPriceRange([priceRange[0], parseInt(e.target.value)])
                      }
                      className="w-full accent-blue-600"
                    />
                    <div className="flex items-center justify-between">
                      <span className="font-medium">${priceRange[0]}</span>
                      <span className="font-medium">${priceRange[1]}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Desktop Sidebar */}
          <div className="hidden lg:block lg:w-1/4 space-y-8">
            {/* Categories */}
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h2 className="text-lg font-semibold mb-4">Categories</h2>
              <div className="space-y-2">
                <button
                  onClick={() => setSelectedCategory(null)}
                  className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                    !selectedCategory
                      ? 'bg-blue-600 text-white'
                      : 'hover:bg-neutral-100'
                  }`}
                >
                  All Categories
                </button>
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.slug)}
                    className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                      selectedCategory === category.slug
                        ? 'bg-blue-600 text-white'
                        : 'hover:bg-neutral-100'
                    }`}
                  >
                    {category.title}
                  </button>
                ))}
              </div>
            </div>

            {/* Price Range Filter */}
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h2 className="text-lg font-semibold mb-4">Price Range</h2>
              <div className="space-y-4">
                <input
                  type="range"
                  min="0"
                  max="1000"
                  step="10"
                  value={priceRange[1]}
                  onChange={(e) =>
                    setPriceRange([priceRange[0], parseInt(e.target.value)])
                  }
                  className="w-full accent-blue-600"
                />
                <div className="flex items-center justify-between">
                  <span className="font-medium">${priceRange[0]}</span>
                  <span className="font-medium">${priceRange[1]}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Product Grid */}
          <div className="lg:w-3/4">
            {products.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((product) => (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="group relative"
                  >
                    <div className="bg-white rounded-xl overflow-hidden shadow-sm group-hover:shadow-xl transition-all duration-300">
                      <div className="relative aspect-square overflow-hidden">
                        <Link href={`/shop/${product.slug}`} className="block h-full w-full">
                          <Image
                            src={product.thumbnail || '/placeholder.jpg'}
                            alt={product.title}
                            fill
                            className="object-cover transition-transform duration-700 group-hover:scale-110"
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            placeholder="blur"
                            blurDataURL={`data:image/svg+xml;base64,${toBase64(shimmer(700, 475))}`}
                          />
                        </Link>
                        
                        {/* Quick action buttons - positioned within the image container */}
                        <div className="absolute inset-0 bg-black bg-opacity-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-2 z-10">
                          <button 
                            onClick={(e) => handleAddToCart(product, e)}
                            className="w-10 h-10 rounded-full bg-white text-blue-600 flex items-center justify-center shadow-md hover:bg-blue-600 hover:text-white transition-colors"
                            aria-label="Add to cart"
                          >
                            <FiShoppingBag className="w-5 h-5" />
                          </button>
                          <button 
                            onClick={() => window.location.href = `/shop/${product.slug}`}
                            className="w-10 h-10 rounded-full bg-white text-blue-600 flex items-center justify-center shadow-md hover:bg-blue-600 hover:text-white transition-colors"
                            aria-label="View details"
                          >
                            <FiEye className="w-5 h-5" />
                          </button>
                        </div>
                        
                        {/* Product badges */}
                        <div className="absolute top-4 left-4 flex flex-col gap-2">
                          {product.featured && (
                            <span className="px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                              Featured
                            </span>
                          )}
                          {product.salePrice && (
                            <span className="px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                              Sale
                            </span>
                          )}
                        </div>
                      </div>
                      
                      <div className="p-5">
                        <div className="mb-2 text-xs text-blue-600 font-medium">
                          {product.category.title}
                        </div>
                        <Link href={`/shop/${product.slug}`} className="block">
                          <h3 className="text-lg font-semibold text-neutral-900 mb-2 line-clamp-1 group-hover:text-blue-600 transition-colors">
                            {product.title}
                          </h3>
                          <p className="text-neutral-600 text-sm mb-4 line-clamp-2">
                            {product.description}
                          </p>
                        </Link>
                        
                        <div className="flex items-center justify-between">
                          <div className="space-y-1">
                            {product.salePrice ? (
                              <div className="flex items-center gap-2">
                                <span className="text-lg font-semibold text-blue-600">
                                  ${product.salePrice}
                                </span>
                                <span className="text-sm text-neutral-500 line-through">
                                  ${product.price}
                                </span>
                              </div>
                            ) : (
                              <span className="text-lg font-semibold text-neutral-900">
                                ${product.price}
                              </span>
                            )}
                          </div>
                          <button
                            onClick={() => handleAddToCart(product)}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                          >
                            <FiShoppingBag className="w-4 h-4" />
                            <span className="hidden sm:inline">Add</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-16 bg-white rounded-xl shadow-sm">
                <FiShoppingBag className="w-16 h-16 mx-auto text-neutral-300 mb-4" />
                <h3 className="text-xl font-semibold text-neutral-900 mb-2">
                  No products found
                </h3>
                <p className="text-neutral-600 max-w-md mx-auto">
                  We couldn't find any products matching your criteria. Try adjusting your filters or check back later.
                </p>
                <button
                  onClick={() => {
                    setSelectedCategory(null);
                    setPriceRange([0, 1000]);
                  }}
                  className="mt-6 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Reset Filters
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}