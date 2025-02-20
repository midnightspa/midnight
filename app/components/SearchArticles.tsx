'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useDebounce } from '@/hooks/useDebounce';

interface Post {
  id: string;
  title: string;
  excerpt: string;
  thumbnail: string | null;
  slug: string;
  category?: {
    title: string;
  };
}

export default function SearchArticles() {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const debouncedSearch = useDebounce(searchQuery, 300);

  useEffect(() => {
    const fetchSearchResults = async () => {
      if (!debouncedSearch.trim()) {
        setSearchResults([]);
        return;
      }

      setIsLoading(true);
      try {
        const response = await fetch(`/api/posts/search?q=${encodeURIComponent(debouncedSearch)}`);
        if (!response.ok) throw new Error('Search failed');
        const data = await response.json();
        setSearchResults(data);
      } catch (error) {
        console.error('Search error:', error);
        setSearchResults([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSearchResults();
  }, [debouncedSearch]);

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 border border-neutral-100">
      <h3 className="text-lg font-semibold text-neutral-900 mb-4">Search Articles</h3>
      <div className="relative">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search articles..."
          className="w-full px-4 py-2 rounded-lg border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-neutral-900"
        />
        <svg
          className="w-5 h-5 absolute right-3 top-1/2 transform -translate-y-1/2 text-neutral-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>

        {/* Search Results Dropdown */}
        {(searchResults.length > 0 || isLoading) && searchQuery && (
          <div className="absolute z-50 left-0 right-0 mt-2 bg-white rounded-lg shadow-lg border border-neutral-200 max-h-96 overflow-y-auto">
            {isLoading ? (
              <div className="p-4 text-center">
                <div className="w-6 h-6 border-2 border-neutral-300 border-t-neutral-900 rounded-full animate-spin mx-auto"></div>
              </div>
            ) : (
              <div className="divide-y divide-neutral-100">
                {searchResults.map((post) => (
                  <Link
                    key={post.id}
                    href={`/posts/${post.slug}`}
                    className="block p-4 hover:bg-neutral-50 transition-colors"
                  >
                    <div className="flex gap-4">
                      {post.thumbnail && (
                        <div className="relative w-16 h-16 flex-shrink-0">
                          <Image
                            src={post.thumbnail}
                            alt={post.title}
                            fill
                            className="object-cover rounded-lg"
                          />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-medium text-neutral-900 truncate">
                          {post.title}
                        </h4>
                        {post.category && (
                          <span className="text-xs text-neutral-500">
                            {post.category.title}
                          </span>
                        )}
                        <p className="text-xs text-neutral-600 line-clamp-2 mt-1">
                          {post.excerpt}
                        </p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
} 