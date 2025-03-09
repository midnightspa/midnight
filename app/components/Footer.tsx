'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Poppins } from 'next/font/google';

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
});

interface Video {
  id: string;
  title: string;
  slug: string;
  thumbnailUrl: string;
}

interface Post {
  id: string;
  title: string;
  slug: string;
  thumbnailUrl: string;
}

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

export default function Footer() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [latestVideos, setLatestVideos] = useState<Video[]>([]);
  const [latestPosts, setLatestPosts] = useState<Post[]>([]);
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  useEffect(() => {
    // Fetch categories with subcategories
    fetch('/api/categories?includeSubcategories=true')
      .then(res => res.json())
      .then(data => setCategories(data));

    // Fetch latest videos
    fetch('/api/videos?limit=3')
      .then(res => res.json())
      .then(data => setLatestVideos(data));

    // Fetch latest posts
    fetch('/api/posts?limit=3')
      .then(res => res.json())
      .then(data => setLatestPosts(data));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    setMessage('');

    try {
      const response = await fetch('/api/newsletter/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to subscribe');
      }

      setStatus('success');
      setMessage('Successfully subscribed to newsletter!');
      setEmail('');
    } catch (error) {
      setStatus('error');
      setMessage(error instanceof Error ? error.message : 'Failed to subscribe');
    }
  };

  return (
    <>
     {/* Newsletter Section */}
     <section className="py-12 md:py-20 bg-neutral-50">
     <div className="container mx-auto px-4 max-w-4xl text-center">
       <span className="text-sm font-medium text-neutral-500 uppercase tracking-wider">Newsletter</span>
       <h2 className="text-3xl font-semibold text-neutral-900 mt-1 mb-4">Stay Updated</h2>
       <p className="text-neutral-600 mb-8 text-lg">
         Subscribe to our newsletter to receive the latest updates and exclusive content.
       </p>
       <form onSubmit={handleSubmit} className="flex flex-col gap-4 max-w-md mx-auto">
         <div className="flex flex-col sm:flex-row gap-4">
           <input
             type="email"
             value={email}
             onChange={(e) => setEmail(e.target.value)}
             placeholder="Enter your email"
             className="flex-1 px-4 py-3 rounded-lg border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-neutral-900"
             required
           />
           <button
             type="submit"
             disabled={status === 'loading'}
             className="px-6 py-3 bg-neutral-900 text-white rounded-lg hover:bg-neutral-800 transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
           >
             {status === 'loading' ? 'Subscribing...' : 'Subscribe'}
           </button>
         </div>
         {message && (
           <p className={`text-sm ${status === 'success' ? 'text-green-600' : 'text-red-600'}`}>
             {message}
           </p>
         )}
         <p className="mt-2 text-sm text-neutral-500 px-4">
           We respect your privacy. Unsubscribe at any time.
         </p>
       </form>
     </div>
   </section>
    <footer className={`${poppins.className} bg-neutral-900 text-white pt-16 pb-8`}>
      <div className="container mx-auto px-4">
        {/* Categories Grid - 4 Columns */}
        <h3 className="text-xl font-semibold mb-8">Categories</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          {[0, 1, 2, 3].map((columnIndex) => (
            <div key={columnIndex}>
              <ul className="space-y-4">
                {categories
                  .slice(columnIndex * Math.ceil(categories.length / 4), (columnIndex + 1) * Math.ceil(categories.length / 4))
                  .map(category => (
                    <li key={category.id} className="mb-4">
                      <Link href={`/categories/${category.slug}`} className="text-neutral-300 hover:text-white transition font-medium">
                        {category.title}
                      </Link>
                      {category.subcategories.length > 0 && (
                        <ul className="ml-4 mt-2 space-y-1">
                          {category.subcategories.map(subcategory => (
                            <li key={subcategory.id}>
                              <Link href={`/subcategories/${subcategory.slug}`} className="text-neutral-400 hover:text-white text-sm transition">
                                {subcategory.title}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      )}
                    </li>
                  ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Content Sections - 4 Columns */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12 border-t border-neutral-800 pt-12">
          {/* Latest Videos Section */}
          <div>
            <h3 className="text-xl font-semibold mb-6">Latest Videos</h3>
            <ul className="space-y-4">
              {latestVideos.map(video => (
                <li key={video.id} className="flex items-center gap-3">
                  {video.thumbnailUrl && (
                    <Image
                      src={video.thumbnailUrl}
                      alt={video.title}
                      width={60}
                      height={40}
                      className="rounded"
                    />
                  )}
                  <Link href={`/videos/${video.slug}`} className="text-neutral-300 hover:text-white transition line-clamp-2">
                    {video.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Latest Posts Section */}
          <div>
            <h3 className="text-xl font-semibold mb-6">Latest Posts</h3>
            <ul className="space-y-4">
              {latestPosts.map(post => (
                <li key={post.id} className="flex items-center gap-3">
                  {post.thumbnailUrl && (
                    <Image
                      src={post.thumbnailUrl}
                      alt={post.title}
                      width={60}
                      height={40}
                      className="rounded"
                    />
                  )}
                  <Link href={`/posts/${post.slug}`} className="text-neutral-300 hover:text-white transition line-clamp-2">
                    {post.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xl font-semibold mb-6">Quick Links</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/archive" className="text-neutral-300 hover:text-white transition">
                  Archive
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-neutral-300 hover:text-white transition">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-neutral-300 hover:text-white transition">
                  Terms & Conditions
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-xl font-semibold mb-6">Contact Us</h3>
            <ul className="space-y-3">
              <li className="text-neutral-300">
                <a href="mailto:contact@themidnightspa.com" className="hover:text-white transition">
                  contact@themidnightspa.com
                </a>
              </li>
              <li className="text-neutral-300">
                Follow us on social media:
              </li>
              <li className="flex gap-4">
                <a 
                  href="https://facebook.com/midnightspa" 
                  className="text-neutral-300 hover:text-white transition"
                  aria-label="Follow us on Facebook"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </a>
                <a 
                  href="https://instagram.com/midnightspa" 
                  className="text-neutral-300 hover:text-white transition"
                  aria-label="Follow us on Instagram"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                </a>
                <a 
                  href="https://youtube.com/@midnightspa" 
                  className="text-neutral-300 hover:text-white transition"
                  aria-label="Subscribe to our YouTube channel"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                  </svg>
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright Section */}
        <div className="border-t border-neutral-800 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-neutral-400 text-sm">
              © {new Date().getFullYear()} Midnight Spa. All rights reserved.
            </p>
            <div className="flex items-center gap-6">
              <Link href="/archive" className="text-neutral-400 hover:text-white text-sm transition">
                Archive
              </Link>
              <Link href="/privacy" className="text-neutral-400 hover:text-white text-sm transition">
                Privacy
              </Link>
              <Link href="/terms" className="text-neutral-400 hover:text-white text-sm transition">
                Terms
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
    </>
  );
} 