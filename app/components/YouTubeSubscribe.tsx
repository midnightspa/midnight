'use client';

import React from 'react';
import { FiYoutube } from 'react-icons/fi';

export default function YouTubeSubscribe() {
  return (
    <div className="flex flex-col items-center gap-3">
      <h2 className="text-sm font-semibold text-neutral-900 flex items-center gap-2">
        <FiYoutube className="w-5 h-5 text-red-600" aria-hidden="true" />
        Subscribe to Our Channel
      </h2>
      <a
        href="https://www.youtube.com/@midnightspa?sub_confirmation=1"
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors text-sm font-medium"
      >
        <FiYoutube className="w-5 h-5" aria-hidden="true" />
        Subscribe Now
      </a>
    </div>
  );
} 