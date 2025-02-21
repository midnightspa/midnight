'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

export default function WatchMoreButton() {
  // Use client-side only rendering to avoid hydration issues
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Don't render anything until client-side
  if (!isMounted) {
    return (
      <div className="flex justify-center mt-12">
        <Link href="/videos">
          <button className="relative px-8 py-4 bg-white text-neutral-900 font-semibold rounded-lg border-2 border-neutral-900">
            Watch More Videos
          </button>
        </Link>
      </div>
    );
  }

  return (
    <motion.div 
      className="flex justify-center mt-12"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
    >
      <Link href="/videos" className="group relative">
        <motion.div
          className="absolute -inset-0.5 rounded-lg bg-gradient-to-r from-neutral-600 to-neutral-800 opacity-60 blur-[6px] group-hover:opacity-90 transition duration-1000 group-hover:duration-200"
          animate={{ scale: [1, 1.02, 1] }}
          transition={{ repeat: Infinity, duration: 2 }}
        />
        <motion.button
          className="relative px-8 py-4 bg-white text-neutral-900 font-semibold rounded-lg border-2 border-neutral-900 transition-all duration-300 hover:-translate-y-1"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          Watch More Videos
          <span className="absolute inset-x-0 bottom-0 h-0.5 bg-gradient-to-r from-neutral-600 to-neutral-800 transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
        </motion.button>
      </Link>
    </motion.div>
  );
} 