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
  
  // Clean up the URL path
  const cleanPath = url.startsWith('/uploads/') 
    ? url 
    : url.includes('/uploads/') 
      ? `/uploads/${url.split('/uploads/').pop()}`
      : `/uploads/${url}`;
  
  // Always return the clean path - Nginx will handle serving the files
  return cleanPath;
} 