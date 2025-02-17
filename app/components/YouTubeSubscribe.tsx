'use client';

import React, { useEffect } from 'react';

interface YouTubeSubscribeProps {
  channelId: string;
  layout?: 'default' | 'full';
  count?: 'default' | 'hidden';
}

export default function YouTubeSubscribe({ 
  channelId,
  layout = 'default',
  count = 'hidden'
}: YouTubeSubscribeProps) {
  useEffect(() => {
    // Load YouTube iframe API
    const script = document.createElement('script');
    script.src = 'https://apis.google.com/js/platform.js';
    script.async = true;
    document.body.appendChild(script);

    return () => {
      // Cleanup script when component unmounts
      document.body.removeChild(script);
    };
  }, []);

  return (
    <div className="g-ytsubscribe" 
      data-channelid={channelId}
      data-layout={layout}
      data-count={count}
    />
  );
} 