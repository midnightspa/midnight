'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Dialog, Transition, Disclosure } from '@headlessui/react';
import { Poppins } from 'next/font/google';
import { Fragment } from 'react';
import CartIcon from './CartIcon';
import {
  useMotionValueEvent,
  AnimatePresence,
  useScroll,
  motion,
} from 'framer-motion';
import useMeasure from 'react-use-measure';
import { FiMenu, FiArrowRight, FiX, FiChevronDown, FiSearch } from 'react-icons/fi';
import SearchDialog from './SearchDialog';

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
});

interface Category {
  id: string;
  title: string;
  slug: string;
  subcategories: {
    id: string;
    title: string;
    slug: string;
  }[];
}

interface SearchResult {
  id: string;
  title: string;
  type: 'post' | 'category' | 'subcategory' | 'video';
  slug: string;
}

export default function Header() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isBlogMenuOpen, setIsBlogMenuOpen] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (latest: number) => {
    setScrolled(latest > 250 ? true : false);
  });

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/categories');
      const data = await response.json();
      setCategories(data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const handleSearch = async (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    try {
      const response = await fetch(`/api/search?query=${encodeURIComponent(query)}`);
      if (!response.ok) throw new Error('Search failed');
      const data = await response.json();
      setSearchResults(data);
    } catch (error) {
      console.error('Error searching:', error);
      setSearchResults([]);
    }
  };

  return (
    <>
      {/* Desktop Header */}
      <header
        className={`${poppins.className} fixed top-0 z-50 w-full px-6 text-neutral-900
        transition-all duration-300 ease-out lg:px-12
        ${
          scrolled
            ? "bg-white py-3 shadow-xl"
            : "bg-white/80 backdrop-blur-md py-6 shadow-sm"
        }`}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex-shrink-0">
            <Image
              src="/images/logo.svg"
              alt="Midnight Spa"
              width={180}
              height={48}
              className="h-8 md:h-12 w-auto transition-all"
              priority
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden gap-6 lg:flex items-center">
            <Link
              href="/"
              className="text-neutral-900 hover:text-neutral-600 font-medium transition-colors"
            >
              Home
            </Link>
            
            {/* Blog Mega Menu */}
            <div
              className="relative"
              onMouseEnter={() => setIsBlogMenuOpen(true)}
              onMouseLeave={() => setIsBlogMenuOpen(false)}
            >
              <button
                className="text-neutral-900 hover:text-neutral-600 font-medium transition-colors flex items-center gap-1"
              >
                Blog
                <motion.div
                  animate={{ rotate: isBlogMenuOpen ? "180deg" : "0deg" }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                >
                  <FiChevronDown />
                </motion.div>
              </button>

              <AnimatePresence>
                {isBlogMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 15 }}
                    transition={{ duration: 0.3, ease: "easeOut" }}
                    className="absolute top-full left-1/2 -translate-x-1/2 w-[800px] bg-white shadow-xl rounded-xl mt-2"
                  >
                    <div className="p-6">
                      <div className="flex gap-8">
                        {categories.map((category) => (
                          <div key={category.id} className="flex-1">
                            <Link
                              href={`/categories/${category.slug}`}
                              className="inline-flex items-center gap-2 font-semibold text-neutral-900 hover:text-neutral-600 mb-4"
                            >
                              <span>{category.title}</span>
                              <FiArrowRight className="w-4 h-4" />
                            </Link>
                            <ul className="space-y-2 border-l border-neutral-200 pl-4">
                              {category.subcategories.map((subcategory) => (
                                <li key={subcategory.id}>
                                  <Link
                                    href={`/categories/${category.slug}/${subcategory.slug}`}
                                    className="text-sm text-neutral-600 hover:text-neutral-900 block transition-colors"
                                  >
                                    {subcategory.title}
                                  </Link>
                                </li>
                              ))}
                            </ul>
                          </div>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <Link
              href="/videos"
              className="text-neutral-900 hover:text-neutral-600 font-medium transition-colors"
            >
              Videos
            </Link>

            <Link
              href="/shop"
              className="text-neutral-900 hover:text-neutral-600 font-medium transition-colors"
            >
              Shop
            </Link>
          </div>

          <div className="flex items-center gap-3">
            {/* Search Icon */}
            <button
              onClick={() => setIsSearchOpen(true)}
              className="p-2 hover:bg-neutral-100 rounded-full transition-colors"
            >
              <FiSearch className="w-5 h-5 text-neutral-900" />
            </button>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="lg:hidden p-2 hover:bg-neutral-100 rounded-full transition-colors"
            >
              <FiMenu className="w-6 h-6 text-neutral-900" />
            </button>

            <CartIcon />
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", bounce: 0, duration: 0.4 }}
            className="fixed inset-0 z-[100] bg-white lg:hidden"
          >
            <div className="flex flex-col h-full">
              <div className="flex items-center justify-between p-6 border-b border-neutral-200">
                <Link href="/" className="flex-shrink-0" onClick={() => setIsMobileMenuOpen(false)}>
                  <Image
                    src="/images/logo.svg"
                    alt="Midnight Spa"
                    width={180}
                    height={48}
                    className="h-8 w-auto"
                    priority
                  />
                </Link>
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-2 hover:bg-neutral-100 rounded-full transition-colors"
                >
                  <FiX className="w-6 h-6 text-neutral-900" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto">
                <nav className="p-6 space-y-6">
                  <Link
                    href="/"
                    className="block text-2xl font-medium text-neutral-900 hover:text-neutral-600"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Home
                  </Link>

                  <Disclosure>
                    {({ open }) => (
                      <div>
                        <Disclosure.Button className="flex w-full items-center justify-between text-2xl font-medium text-neutral-900 hover:text-neutral-600">
                          <span>Blog</span>
                          <motion.div
                            animate={{ rotate: open ? "180deg" : "0deg" }}
                            transition={{ duration: 0.2 }}
                          >
                            <FiChevronDown />
                          </motion.div>
                        </Disclosure.Button>

                        <Disclosure.Panel className="mt-4 space-y-4">
                          {categories.map((category) => (
                            <div key={category.id} className="space-y-2">
                              <Link
                                href={`/categories/${category.slug}`}
                                className="block text-xl font-medium text-neutral-900 hover:text-neutral-600"
                                onClick={() => setIsMobileMenuOpen(false)}
                              >
                                {category.title}
                              </Link>
                              <div className="pl-4 space-y-2">
                                {category.subcategories.map((subcategory) => (
                                  <Link
                                    key={subcategory.id}
                                    href={`/categories/${category.slug}/${subcategory.slug}`}
                                    className="block text-neutral-600 hover:text-neutral-900"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                  >
                                    {subcategory.title}
                                  </Link>
                                ))}
                              </div>
                            </div>
                          ))}
                        </Disclosure.Panel>
                      </div>
                    )}
                  </Disclosure>

                  <Link
                    href="/videos"
                    className="block text-2xl font-medium text-neutral-900 hover:text-neutral-600"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Videos
                  </Link>

                  <Link
                    href="/shop"
                    className="block text-2xl font-medium text-neutral-900 hover:text-neutral-600"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Shop
                  </Link>
                </nav>
              </div>

              <div className="p-6 border-t border-neutral-200">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search..."
                    className="w-full px-4 py-2 pl-10 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-900"
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      handleSearch(e.target.value);
                    }}
                  />
                  <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
                </div>
                {searchResults.length > 0 && (
                  <div className="absolute bottom-full left-6 right-6 mb-2 bg-white rounded-lg shadow-xl max-h-60 overflow-y-auto">
                    {searchResults.map((result) => (
                      <Link
                        key={result.id}
                        href={`/${result.type}s/${result.slug}`}
                        className="block px-4 py-2 text-neutral-900 hover:bg-neutral-50"
                        onClick={() => {
                          setSearchQuery('');
                          setSearchResults([]);
                          setIsMobileMenuOpen(false);
                        }}
                      >
                        {result.title}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <SearchDialog 
        isOpen={isSearchOpen} 
        onClose={() => setIsSearchOpen(false)} 
      />
    </>
  );
} 