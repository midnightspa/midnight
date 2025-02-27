import React from 'react';
import VideoForm from './components/VideoForm';

export default async function EditVideoPage({ params }: { params: { id: string } }) {
  const resolvedParams = await params;
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Edit Video</h1>
      <VideoForm videoId={resolvedParams.id} />
    </div>
  );
} 