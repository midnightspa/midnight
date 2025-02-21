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
  if (url.startsWith('http')) return url;
  
  // Get the server URL from environment or default to the IP
  const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL || 'http://5.161.86.130';
  
  // If the URL starts with /uploads, prepend the server URL
  if (url.startsWith('/uploads')) {
    return `${serverUrl}${url}`;
  }
  
  // For other URLs starting with /, just return as is
  if (url.startsWith('/')) {
    return url;
  }
  
  // For relative URLs, prepend /
  return `/${url}`;
} 