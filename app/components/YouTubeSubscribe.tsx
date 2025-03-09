'use client';

import React from 'react';

export default function YouTubeSubscribe() {
  return (
    <div className="flex flex-col items-center gap-2">
      <h2 className="text-sm font-semibold text-neutral-900">Subscribe to Our Channel</h2>
      <div className="flex-1 flex justify-center">
        <iframe
          title="YouTube Subscribe Button"
          src="https://www.youtube.com/subscribe_embed?channelid=UCBUNH_lKitDaw"
          width="115"
          height="24"
          frameBorder="0"
          allowFullScreen
          loading="lazy"
          style={{
            maxWidth: '100%',
            border: 'none',
          }}
        />
      </div>
    </div>
  );
} 