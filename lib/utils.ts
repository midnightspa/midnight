import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')        // Replace spaces with -
    .replace(/[^\w\-]+/g, '')    // Remove all non-word chars
    .replace(/\-\-+/g, '-')      // Replace multiple - with single -
    .replace(/^-+/, '')          // Trim - from start of text
    .replace(/-+$/, '');         // Trim - from end of text
}

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getImageUrl(url: string | null): string {
  if (!url) return '/placeholder.jpg';
  
  // If it's already a full URL, return it
  if (url.startsWith('http')) return url;
  
  // Get the server URL from environment or default to the production URL
  const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL || 'https://themidnightspa.com';
  
  // Clean up the URL path
  const cleanPath = url.startsWith('/uploads/') 
    ? url 
    : url.includes('/uploads/') 
      ? `/uploads/${url.split('/uploads/').pop()}`
      : `/uploads/${url}`;
  
  // Always use full URL in production
  if (process.env.NODE_ENV === 'production') {
    // Remove any potential double slashes (except after http/https)
    return `${serverUrl}${cleanPath}`.replace(/([^:]\/)\/+/g, '$1');
  }
  
  // For development, use relative path
  return cleanPath;
} 