import React from 'react';
import { Poppins } from 'next/font/google';
import { generateStructuredData, getSiteSettings } from '@/lib/seo';
import Script from 'next/script';
import HomeHero from '@/app/components/home/homehero';
import HomeCategory from '@/app/components/home/homecategory';
import HomeSubcategory from '@/app/components/home/homesubcategory';
import HomeVideo from '@/app/components/home/homevideo';
import HomePost from '@/app/components/home/homepost';

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
});

// Fetch site settings dynamically on each request
export async function getServerSideProps() {
  try {
    const settings = await getSiteSettings();
    return {
      props: { settings },
    };
  } catch (error) {
    console.error('Error fetching settings:', error);
    return {
      props: { settings: null },
    };
  }
}

export default function HomePage({ settings }) {
  if (!settings) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white text-red-500">
        <p>Error loading site settings. Please try again later.</p>
      </div>
    );
  }

  const structuredData = generateStructuredData({
    organizationName: settings?.organizationName || undefined,
    organizationLogo: settings?.organizationLogo || undefined,
    contactPhone: settings?.contactPhone || undefined,
    contactEmail: settings?.contactEmail || undefined,
    contactAddress: settings?.contactAddress || undefined,
  });

  return (
    <>
      {/* Structured Data for SEO */}
      <Script
        id="structured-data"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      
      {/* Main Page Content */}
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