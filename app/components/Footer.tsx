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
  youtubeUrl: string;
}

interface Post {
  id: string;
  title: string;
  slug: string;
  thumbnail: string | null;
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
  const [videos, setVideos] = useState<Video[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [videosRes, postsRes, categoriesRes] = await Promise.all([
          fetch('/api/videos'),
          fetch('/api/posts'),
          fetch('/api/categories')
        ]);

        if (!videosRes.ok || !postsRes.ok || !categoriesRes.ok) {
          throw new Error('Failed to fetch data');
        }

        const [videosData, postsData, categoriesData] = await Promise.all([
          videosRes.json(),
          postsRes.json(),
          categoriesRes.json()
        ]);

        setVideos(videosData.slice(0, 3));
        setPosts(postsData.slice(0, 3));
        setCategories(categoriesData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const getYouTubeThumbnail = (url: string) => {
    const videoId = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([^&?]+)/)?.[1];
    return videoId ? `https://img.youtube.com/vi/${videoId}/mqdefault.jpg` : '/placeholder.jpg';
  };

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
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Logo and Description */}
          <div>
            <Link href="/" className="block mb-6">
              <Image
                src="/images/logo.svg"
                alt="Midnight Spa"
                width={180}
                height={48}
                className="h-8 md:h-12 w-auto brightness-0 invert transition-all"
                priority
              />
            </Link>
            <p className="text-neutral-400 leading-relaxed">
              Your ultimate destination for relaxation and wellness. Discover expert tips, techniques, and insights for a balanced lifestyle.
            </p>
          </div>

          {/* Categories Menu */}
          <div>
            <h3 className="text-lg font-semibold mb-6">Categories</h3>
            <ul className="space-y-3">
              {categories.map((category) => (
                <li key={category.id}>
                  <Link
                    href={`/categories/${category.slug}`}
                    className="text-neutral-400 hover:text-white transition-colors"
                  >
                    {category.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Latest Videos */}
          <div>
            <h3 className="text-lg font-semibold mb-6">Latest Videos</h3>
            <div className="space-y-4">
              {videos.map((video) => (
                <Link
                  key={video.id}
                  href={`/videos/${video.slug}`}
                  className="group flex items-center gap-3"
                >
                  <div className="relative w-16 h-16 flex-shrink-0 rounded-lg overflow-hidden">
                    <Image
                      src={getYouTubeThumbnail(video.youtubeUrl)}
                      alt={video.title}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                  </div>
                  <h4 className="text-neutral-400 group-hover:text-white transition-colors line-clamp-2 flex-1">
                    {video.title}
                  </h4>
                </Link>
              ))}
            </div>
          </div>

          {/* Latest Posts */}
          <div>
            <h3 className="text-lg font-semibold mb-6">Latest Posts</h3>
            <div className="space-y-4">
              {posts.map((post) => (
                <Link
                  key={post.id}
                  href={`/posts/${post.slug}`}
                  className="group flex items-center gap-3"
                >
                  <div className="relative w-16 h-16 flex-shrink-0 rounded-lg overflow-hidden">
                    <Image
                      src={post.thumbnail || '/placeholder.jpg'}
                      alt={post.title}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                  </div>
                  <h4 className="text-neutral-400 group-hover:text-white transition-colors line-clamp-2 flex-1">
                    {post.title}
                  </h4>
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="pt-8 border-t border-neutral-800">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-neutral-400 text-sm text-center md:text-left">
              © {new Date().getFullYear()} Midnight Spa. All rights reserved.
            </p>
            <div className="flex items-center gap-6">
              <Link href="/privacy" className="text-sm text-neutral-400 hover:text-white transition-colors">
                Privacy Policy
              </Link>
              <Link href="/terms" className="text-sm text-neutral-400 hover:text-white transition-colors">
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
    </>
  );
} 