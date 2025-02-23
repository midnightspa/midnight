import React from 'react';
import { Poppins } from 'next/font/google';
import { generateStructuredData, getSiteSettings } from '@/lib/seo';
import Script from 'next/script';
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

export async function generateMetadata() {
  return {
    title: 'Midnight Spa - Your Ultimate Destination for Relaxation and Wellness',
    description: 'Discover luxury spa treatments, wellness tips, and relaxation techniques at Midnight Spa.',
  }
}

export default async function HomePage() {
  // Opt out of caching for all data fetches in this component
  noStore();

  const settings = await getSiteSettings().catch(error => {
    console.error('Error fetching settings:', error);
    return null;
  });

  const structuredData = generateStructuredData({
    organizationName: settings?.organizationName || undefined,
    organizationLogo: settings?.organizationLogo || undefined,
    contactPhone: settings?.contactPhone || undefined,
    contactEmail: settings?.contactEmail || undefined,
    contactAddress: settings?.contactAddress || undefined
  });

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
}