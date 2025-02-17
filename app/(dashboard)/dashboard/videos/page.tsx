import React from 'react';
import Link from 'next/link';
import VideoList from './components/VideoList';

export default function VideosPage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">Videos</h1>
        <Link
          href="/dashboard/videos/new"
          className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Add New Video
        </Link>
      </div>
      <VideoList />
    </div>
  );
} 