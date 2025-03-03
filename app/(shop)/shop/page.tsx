'use client';

import React from 'react';
import { Poppins } from 'next/font/google';

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
});

/* Original shop implementation preserved for future use
import Image from 'next/image';
import Link from 'next/link';

interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  salePrice?: number | null;
  thumbnail: string | null;
  type: 'DIGITAL' | 'PHYSICAL';
  slug: string;
  createdAt: string;
  category: {
    id: string;
    title: string;
    slug: string;
  };
}
*/

export default function ShopPage() {
  return (
    <div className={`min-h-screen bg-gradient-to-br from-neutral-50 to-neutral-100 flex items-center justify-center ${poppins.className}`}>
      <div className="text-center px-4">
        <div className="mb-8 relative">
          <div className="absolute inset-0 animate-ping bg-blue-500 rounded-full opacity-20" style={{ animationDuration: '3s' }}></div>
          <div className="relative bg-white shadow-xl rounded-full p-6 inline-block">
            <svg
              className="w-12 h-12 text-blue-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
              />
            </svg>
          </div>
        </div>
        
        <h1 className="text-4xl md:text-5xl font-bold text-neutral-900 mb-4">
          Shop Coming Soon
        </h1>
        
        <p className="text-xl text-neutral-600 mb-8 max-w-2xl mx-auto">
          We're crafting something special for you. Our shop will be launching soon with amazing products and exclusive deals.
        </p>
        
        <div className="inline-flex items-center text-sm text-neutral-500 border border-neutral-200 rounded-full px-4 py-2 bg-white shadow-sm">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse mr-2"></div>
          In Development
        </div>
      </div>
    </div>
  );
}

/* Original implementation preserved for future use
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedType, setSelectedType] = useState<'all' | 'DIGITAL' | 'PHYSICAL'>('all');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000]);
  const [sortBy, setSortBy] = useState<'price-asc' | 'price-desc' | 'newest'>('newest');

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch('/api/products');
      if (!response.ok) throw new Error('Failed to fetch products');
      const data = await response.json();
      setProducts(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch products');
    } finally {
      setLoading(false);
    }
  };

  const filteredProducts = products
    .filter(product => selectedType === 'all' || product.type === selectedType)
    .filter(product => {
      const price = product.salePrice || product.price;
      return price >= priceRange[0] && price <= priceRange[1];
    })
    .sort((a, b) => {
      const priceA = a.salePrice || a.price;
      const priceB = b.salePrice || b.price;
      
      switch (sortBy) {
        case 'price-asc':
          return priceA - priceB;
        case 'price-desc':
          return priceB - priceA;
        case 'newest':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        default:
          return 0;
      }
    });

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-neutral-200 border-t-neutral-900 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-semibold text-red-600 mb-4">Error</h1>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-neutral-50 ${poppins.className}`}>
      {/* Header *//*}
      <header className="bg-white border-b border-neutral-200">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold text-neutral-900">Shop</h1>
          <p className="mt-2 text-neutral-600">
            Discover our collection of digital and physical products
          </p>
        </div>
      </header>

      {/* Filters and Products *//*}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-12 gap-8">
          {/* Filters Sidebar *//*}
          <aside className="col-span-12 lg:col-span-3">
            <div className="bg-white rounded-xl shadow-sm p-6 space-y-6">
              {/* Product Type Filter *//*}
              <div>
                <h3 className="text-lg font-semibold mb-4">Product Type</h3>
                <div className="space-y-2">
                  {['all', 'DIGITAL', 'PHYSICAL'].map((type) => (
                    <label key={type} className="flex items-center">
                      <input
                        type="radio"
                        name="type"
                        checked={selectedType === type}
                        onChange={() => setSelectedType(type as typeof selectedType)}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                      />
                      <span className="ml-2 text-gray-700 capitalize">
                        {type === 'all' ? 'All Products' : `${type.toLowerCase()} Products`}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Price Range Filter *//*}
              <div>
                <h3 className="text-lg font-semibold mb-4">Price Range</h3>
                <div className="space-y-4">
                  <div className="flex items-center space-x-4">
                    <input
                      type="number"
                      value={priceRange[0]}
                      onChange={(e) => setPriceRange([Number(e.target.value), priceRange[1]])}
                      className="w-24 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                    <span>to</span>
                    <input
                      type="number"
                      value={priceRange[1]}
                      onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
                      className="w-24 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>

              {/* Sort Options *//*}
              <div>
                <h3 className="text-lg font-semibold mb-4">Sort By</h3>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                >
                  <option value="newest">Newest</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                </select>
              </div>
            </div>
          </aside>

          {/* Products Grid *//*}
          <div className="col-span-12 lg:col-span-9">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((product) => (
                <Link
                  key={product.id}
                  href={`/shop/${product.slug}`}
                  className="group block"
                >
                  <div className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300">
                    <div className="relative aspect-square">
                      <Image
                        src={product.thumbnail || '/placeholder.jpg'}
                        alt={product.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      {product.type === 'DIGITAL' && (
                        <div className="absolute top-4 left-4">
                          <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                            Digital
                          </span>
                        </div>
                      )}
                      {product.salePrice && (
                        <div className="absolute top-4 right-4">
                          <span className="bg-red-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                            Sale
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="p-6">
                      <h2 className="text-lg font-semibold text-neutral-900 mb-2 group-hover:text-blue-600 transition-colors">
                        {product.title}
                      </h2>
                      <p className="text-neutral-600 text-sm mb-4 line-clamp-2">
                        {product.description}
                      </p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          {product.salePrice ? (
                            <>
                              <span className="text-lg font-semibold text-neutral-900">
                                ${product.salePrice}
                              </span>
                              <span className="text-sm text-neutral-500 line-through">
                                ${product.price}
                              </span>
                            </>
                          ) : (
                            <span className="text-lg font-semibold text-neutral-900">
                              ${product.price}
                            </span>
                          )}
                        </div>
                        <span className="text-sm text-neutral-500">
                          {product.category.title}
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {filteredProducts.length === 0 && (
              <div className="text-center py-12">
                <h3 className="text-lg font-medium text-neutral-900">No products found</h3>
                <p className="mt-2 text-neutral-600">
                  Try adjusting your filters to find what you're looking for
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
*/ 