import React from 'react';
import VideoForm from './components/VideoForm';

export default function EditVideoPage({ params }: { params: { id: string } }) {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Edit Video</h1>
      <VideoForm videoId={params.id} />
    </div>
  );
} 