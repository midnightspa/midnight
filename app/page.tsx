import React, { Suspense } from 'react';
import { Poppins } from 'next/font/google';
import { generateStructuredData, getSiteSettings } from '@/lib/seo';
import Script from 'next/script';
import dynamic from 'next/dynamic';
import HomeHero from '@/app/components/home/homehero';

// Dynamically import non-critical components
const HomeCategory = dynamic(() => import('@/app/components/home/homecategory'), {
  loading: () => <div className="animate-pulse bg-gray-200 h-64 rounded-xl" />,
  ssr: true
});

const HomeSubcategory = dynamic(() => import('@/app/components/home/homesubcategory'), {
  loading: () => <div className="animate-pulse bg-gray-200 h-64 rounded-xl" />,
  ssr: true
});

const HomeVideo = dynamic(() => import('@/app/components/home/homevideo'), {
  loading: () => <div className="animate-pulse bg-gray-200 h-64 rounded-xl" />,
  ssr: true
});

const HomePost = dynamic(() => import('@/app/components/home/homepost'), {
  loading: () => <div className="animate-pulse bg-gray-200 h-64 rounded-xl" />,
  ssr: true
});

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
        <Suspense fallback={<div className="animate-pulse bg-gray-200 h-[70vh] rounded-xl" />}>
          <HomeHero />
        </Suspense>
        
        <Suspense fallback={<div className="animate-pulse bg-gray-200 h-64 rounded-xl" />}>
          <HomeCategory />
        </Suspense>

        <Suspense fallback={<div className="animate-pulse bg-gray-200 h-64 rounded-xl" />}>
          <HomeSubcategory />
        </Suspense>

        <Suspense fallback={<div className="animate-pulse bg-gray-200 h-64 rounded-xl" />}>
          <HomeVideo />
        </Suspense>

        <Suspense fallback={<div className="animate-pulse bg-gray-200 h-64 rounded-xl" />}>
          <HomePost />
        </Suspense>
      </div>
    </>
  );
}