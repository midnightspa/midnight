'use client';

import React, { useEffect } from 'react';

declare global {
  interface Window {
    gapi: any;
  }
}

interface YouTubeSubscribeProps {
  channelId: string;
  layout?: 'default' | 'full';
  count?: 'default' | 'hidden';
}

const YouTubeSubscribe: React.FC<YouTubeSubscribeProps> = ({
  channelId,
  layout = 'default',
  count = 'default',
}) => {
  useEffect(() => {
    // Load the YouTube platform script
    const script = document.createElement('script');
    script.src = 'https://apis.google.com/js/platform.js';
    script.async = true;
    document.body.appendChild(script);

    return () => {
      // Cleanup: remove the script when component unmounts
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
};

export default YouTubeSubscribe; 