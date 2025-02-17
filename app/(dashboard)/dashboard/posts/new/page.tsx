import React from 'react';
import PostForm from './components/PostForm';

export const dynamic = 'force-dynamic';

export default function NewPostPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Create New Post</h1>
      <PostForm />
    </div>
  );
} 