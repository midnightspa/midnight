import React from 'react';
import { Poppins } from 'next/font/google';
import Script from 'next/script';
import { generateStructuredData, getSiteSettings } from '@/lib/seo';
import HomeHero from '@/app/components/home/homehero';
import HomeCategory from '@/app/components/home/homecategory';
import HomeSubcategory from '@/app/components/home/homesubcategory';
import HomeVideo from '@/app/components/home/homevideo';
import HomePost from '@/app/components/home/homepost';
import { unstable_noStore as noStore } from 'next/cache';

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
});

// Force dynamic rendering and disable caching
export const dynamic = 'force-dynamic';
export const revalidate = 0;

// Define metadata for the page
export async function generateMetadata() {
  return {
    title: 'Midnight Spa - Your Ultimate Destination for Relaxation and Wellness',
    description: 'Discover luxury spa treatments, wellness tips, and relaxation techniques at Midnight Spa.',
  };
}

export default async function HomePage() {
  try {
    console.log('[HomePage] Starting page render');
    noStore();

    // Fetch settings
    console.log('[HomePage] Fetching site settings');
    const settings = await getSiteSettings();
    
    if (!settings) {
      console.error('[HomePage] No settings found');
      throw new Error('Failed to load site settings');
    }

    // Generate structured data
    console.log('[HomePage] Generating structured data');
    const structuredData = generateStructuredData({
      organizationName: settings.organizationName || '',
      organizationLogo: settings.organizationLogo || '',
      contactPhone: settings.contactPhone || '',
      contactEmail: settings.contactEmail || '',
      contactAddress: settings.contactAddress || '',
    });

    // Render the page
    console.log('[HomePage] Rendering page components');
    return (
      <>
        <Script
          id="structured-data"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
        <div className={`min-h-screen bg-white ${poppins.className}`}>
          <HomeHero />
          <HomeCategory />
          <HomeSubcategory />
          <HomeVideo />
          <HomePost />
        </div>
      </>
    );
  } catch (error) {
    const err = error as Error;
    console.error('[HomePage] Fatal error rendering page:', {
      message: err.message,
      stack: err.stack,
      type: err.constructor.name
    });
    
    return (
      <div className="flex items-center justify-center min-h-screen bg-white text-red-500">
        <p>Error loading page content. Please try again later.</p>
      </div>
    );
  }
}