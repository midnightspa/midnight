import React from 'react';
import Link from 'next/link';
import PostList from './components/PostList';

export default function PostsPage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">Posts</h1>
        <Link
          href="/dashboard/posts/new"
          className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Create New Post
        </Link>
      </div>
      <PostList />
    </div>
  );
} 