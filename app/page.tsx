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
import { ErrorBoundary } from 'react-error-boundary';

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
});

// Force dynamic rendering and disable caching
export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';
export const revalidate = 0;

// Define metadata for the page
export async function generateMetadata() {
  try {
    const settings = await getSiteSettings();
    return {
      title: settings?.siteTitle || 'Midnight Spa - Your Ultimate Destination for Relaxation and Wellness',
      description: settings?.siteDescription || 'Discover luxury spa treatments, wellness tips, and relaxation techniques at Midnight Spa.',
    };
  } catch (error) {
    console.error('[generateMetadata] Error:', error);
    return {
      title: 'Midnight Spa',
      description: 'Your Ultimate Destination for Relaxation and Wellness',
    };
  }
}

export default async function HomePage() {
  try {
    console.log('[HomePage] Starting page render');
    noStore();

    // Fetch settings with error boundary
    console.log('[HomePage] Fetching site settings');
    let settings;
    try {
      settings = await getSiteSettings();
    } catch (error) {
      console.error('[HomePage] Error fetching settings:', error);
      settings = null;
    }

    // Generate structured data with fallback
    console.log('[HomePage] Generating structured data');
    const structuredData = generateStructuredData({
      organizationName: settings?.organizationName || 'Midnight Spa',
      organizationLogo: settings?.organizationLogo || '/logo.png',
      contactPhone: settings?.contactPhone || '',
      contactEmail: settings?.contactEmail || '',
      contactAddress: settings?.contactAddress || '',
    });

    // Render the page with error boundaries for each component
    console.log('[HomePage] Rendering page components');
    return (
      <>
        <Script
          id="structured-data"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
        <div className={`min-h-screen bg-white ${poppins.className}`}>
          <ErrorBoundary fallback={<ErrorComponent />}>
            <React.Suspense fallback={<LoadingComponent />}>
              <HomeHero />
            </React.Suspense>
          </ErrorBoundary>
          
          <ErrorBoundary fallback={<ErrorComponent />}>
            <React.Suspense fallback={<LoadingComponent />}>
              <HomeCategory />
            </React.Suspense>
          </ErrorBoundary>
          
          <ErrorBoundary fallback={<ErrorComponent />}>
            <React.Suspense fallback={<LoadingComponent />}>
              <HomeSubcategory />
            </React.Suspense>
          </ErrorBoundary>
          
          <ErrorBoundary fallback={<ErrorComponent />}>
            <React.Suspense fallback={<LoadingComponent />}>
              <HomeVideo />
            </React.Suspense>
          </ErrorBoundary>
          
          <ErrorBoundary fallback={<ErrorComponent />}>
            <React.Suspense fallback={<LoadingComponent />}>
              <HomePost />
            </React.Suspense>
          </ErrorBoundary>
        </div>
      </>
    );
  } catch (error) {
    console.error('[HomePage] Fatal error rendering page:', error);
    return (
      <div className="flex items-center justify-center min-h-screen bg-white text-red-500">
        <p>Error loading page content. Please try again later.</p>
      </div>
    );
  }
}

function ErrorComponent() {
  return (
    <div className="p-4 text-red-500">
      <p>Error loading this section. Please refresh the page.</p>
    </div>
  );
}

function LoadingComponent() {
  return (
    <div className="p-4">
      <div className="animate-pulse bg-gray-200 h-48 rounded-lg"></div>
    </div>
  );
}

function ErrorBoundary({ children, fallback }: { children: React.ReactNode; fallback: React.ReactNode }) {
  try {
    return <>{children}</>;
  } catch (error) {
    console.error('[ErrorBoundary] Error:', error);
    return <>{fallback}</>;
  }
}