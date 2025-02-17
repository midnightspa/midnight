'use client';

import React, { useState, useEffect } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

interface SearchResult {
  id: string;
  title: string;
  type: 'post' | 'video' | 'product';
  slug: string;
  description?: string;
  thumbnail?: string | null;
}

export default function SearchDialog({ 
  isOpen, 
  onClose 
}: { 
  isOpen: boolean; 
  onClose: () => void;
}) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const searchTimeout = setTimeout(async () => {
      if (query.length < 2) {
        setResults([]);
        return;
      }

      setLoading(true);
      try {
        const response = await fetch(`/api/search?query=${encodeURIComponent(query)}`);
        const data = await response.json();
        
        if (!response.ok) {
          console.error('Search error:', data.error);
          setResults([]);
          return;
        }
        
        // Combine and format results
        const formattedResults: SearchResult[] = [
          ...data.posts.map((post: any) => ({
            ...post,
            type: 'post' as const,
          })),
          ...data.videos.map((video: any) => ({
            ...video,
            type: 'video' as const,
          })),
          ...data.products.map((product: any) => ({
            ...product,
            type: 'product' as const,
          })),
        ];

        setResults(formattedResults);
      } catch (error) {
        console.error('Search error:', error);
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, 300); // Debounce search

    return () => clearTimeout(searchTimeout);
  }, [query]);

  const handleResultClick = (result: SearchResult) => {
    onClose();
    const path = `/${result.type}s/${result.slug}`;
    router.push(path);
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-25" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-[8rem] items-start justify-center p-4 pt-[10vh]">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-2xl transform overflow-hidden rounded-2xl bg-white p-6 shadow-xl transition-all">
                <div className="relative">
                  <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search for posts, videos, products..."
                    className="w-full px-4 py-3 text-lg border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500"
                    autoFocus
                  />
                  {loading && (
                    <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-500"></div>
                    </div>
                  )}
                </div>

                {results.length > 0 && (
                  <div className="mt-4 max-h-[60vh] overflow-y-auto">
                    <div className="space-y-4">
                      {results.map((result) => (
                        <button
                          key={`${result.type}-${result.id}`}
                          onClick={() => handleResultClick(result)}
                          className="w-full text-left p-4 rounded-lg hover:bg-gray-50 transition-colors flex items-start gap-4"
                        >
                          {result.thumbnail && (
                            <div className="relative w-16 h-16 flex-shrink-0">
                              <Image
                                src={result.thumbnail}
                                alt={result.title}
                                fill
                                className="object-cover rounded-lg"
                              />
                            </div>
                          )}
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-medium px-2 py-1 rounded-full bg-gray-100 text-gray-600 capitalize">
                                {result.type}
                              </span>
                            </div>
                            <h3 className="font-medium text-gray-900 mt-1">
                              {result.title}
                            </h3>
                            {result.description && (
                              <p className="text-sm text-gray-600 line-clamp-2 mt-1">
                                {result.description}
                              </p>
                            )}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {query.length >= 2 && results.length === 0 && !loading && (
                  <div className="mt-4 text-center text-gray-500">
                    No results found for "{query}"
                  </div>
                )}
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
} 