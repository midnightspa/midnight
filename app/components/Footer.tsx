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
     <section className="py-20 bg-neutral-50">
     <div className="container mx-auto px-4 max-w-4xl text-center">
       <span className="text-sm font-medium text-neutral-500 uppercase tracking-wider">Newsletter</span>
       <h2 className="text-3xl font-semibold text-neutral-900 mt-1 mb-4">Stay Updated</h2>
       <p className="text-neutral-600 mb-8 text-lg">
         Subscribe to our newsletter to receive the latest updates and exclusive content.
       </p>
       <form onSubmit={handleSubmit} className="flex flex-col gap-4 max-w-md mx-auto">
         <div className="flex gap-4">
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
             className="px-6 py-3 bg-neutral-900 text-white rounded-lg hover:bg-neutral-800 transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
           >
             {status === 'loading' ? 'Subscribing...' : 'Subscribe'}
           </button>
         </div>
         {message && (
           <p className={`text-sm ${status === 'success' ? 'text-green-600' : 'text-red-600'}`}>
             {message}
           </p>
         )}
         <p className="mt-4 text-sm text-neutral-500">
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
                <a href="#" className="text-neutral-300 hover:text-white transition">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </a>
                <a href="#" className="text-neutral-300 hover:text-white transition">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                  </svg>
                </a>
                <a href="#" className="text-neutral-300 hover:text-white transition">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0C8.74 0 8.333.015 7.053.072 5.775.132 4.905.333 4.14.63c-.789.306-1.459.717-2.126 1.384S.935 3.35.63 4.14C.333 4.905.131 5.775.072 7.053.012 8.333 0 8.74 0 12s.015 3.667.072 4.947c.06 1.277.261 2.148.558 2.913.306.788.717 1.459 1.384 2.126.667.666 1.336 1.079 2.126 1.384.766.296 1.636.499 2.913.558C8.333 23.988 8.74 24 12 24s3.667-.015 4.947-.072c1.277-.06 2.148-.262 2.913-.558.788-.306 1.459-.718 2.126-1.384.666-.667 1.079-1.335 1.384-2.126.296-.765.499-1.636.558-2.913.06-1.28.072-1.687.072-4.947s-.015-3.667-.072-4.947c-.06-1.277-.262-2.149-.558-2.913-.306-.789-.718-1.459-1.384-2.126C21.319 1.347 20.651.935 19.86.63c-.765-.297-1.636-.499-2.913-.558C15.667.012 15.26 0 12 0zm0 2.16c3.203 0 3.585.016 4.85.071 1.17.055 1.805.249 2.227.415.562.217.96.477 1.382.896.419.42.679.819.896 1.381.164.422.36 1.057.413 2.227.057 1.266.07 1.646.07 4.85s-.015 3.585-.074 4.85c-.061 1.17-.256 1.805-.421 2.227-.224.562-.479.96-.899 1.382-.419.419-.824.679-1.38.896-.42.164-1.065.36-2.235.413-1.274.057-1.649.07-4.859.07-3.211 0-3.586-.015-4.859-.074-1.171-.061-1.816-.256-2.236-.421-.569-.224-.96-.479-1.379-.899-.421-.419-.69-.824-.9-1.38-.165-.42-.359-1.065-.42-2.235-.045-1.26-.061-1.649-.061-4.844 0-3.196.016-3.586.061-4.861.061-1.17.255-1.814.42-2.234.21-.57.479-.96.9-1.381.419-.419.81-.689 1.379-.898.42-.166 1.051-.361 2.221-.421 1.275-.045 1.65-.06 4.859-.06l.045.03zm0 3.678c-3.405 0-6.162 2.76-6.162 6.162 0 3.405 2.76 6.162 6.162 6.162 3.405 0 6.162-2.76 6.162-6.162 0-3.405-2.76-6.162-6.162-6.162zM12 16c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zm7.846-10.405c0 .795-.646 1.44-1.44 1.44-.795 0-1.44-.646-1.44-1.44 0-.794.646-1.439 1.44-1.439.793-.001 1.44.645 1.44 1.439z"/>
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