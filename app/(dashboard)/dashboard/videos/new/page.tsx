import React from 'react';
import VideoForm from './components/VideoForm';

export default function NewVideoPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Add New Video</h1>
      <VideoForm />
    </div>
  );
} 