import React from 'react';
import PostForm from './components/PostForm';

export const dynamic = 'force-dynamic';

export default function EditPostPage({ params }: { params: { id: string } }) {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Edit Post</h1>
      <PostForm postId={params.id} />
    </div>
  );
} 