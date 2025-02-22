export const shimmer = (w: number, h: number) => `
<svg width="${w}" height="${h}" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
  <defs>
    <linearGradient id="g">
      <stop stop-color="#f6f7f8" offset="20%" />
      <stop stop-color="#edeef1" offset="50%" />
      <stop stop-color="#f6f7f8" offset="70%" />
    </linearGradient>
  </defs>
  <rect width="${w}" height="${h}" fill="#f6f7f8" />
  <rect id="r" width="${w}" height="${h}" fill="url(#g)" />
  <animate xlink:href="#r" attributeName="x" from="-${w}" to="${w}" dur="1s" repeatCount="indefinite"  />
</svg>`;

export const toBase64 = (str: string) => {
  if (typeof window === 'undefined') {
    return Buffer.from(str).toString('base64');
  }
  return window.btoa(str);
};

export const getYouTubeThumbnail = (url: string, fallback: string = '/placeholder.jpg') => {
  try {
    const videoId = url.split('v=')[1]?.split('&')[0];
    return videoId ? `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg` : fallback;
  } catch (error) {
    console.error('Error getting YouTube thumbnail:', error);
    return fallback;
  }
};

export const getImageUrl = (url: string | null, fallback: string = '/placeholder.jpg') => {
  if (!url) return fallback;
  if (url.startsWith('http')) return url;
  return url.startsWith('/') ? url : `/${url}`;
}; 