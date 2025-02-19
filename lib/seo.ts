import { Metadata } from 'next';
import prisma from './prisma';

export async function getSiteSettings() {
  const settings = await prisma.siteSettings.findFirst();
  return settings;
}

export async function generateMetadata(
  pageTitle?: string,
  pageDescription?: string,
  pageImage?: string
): Promise<Metadata> {
  const settings = await getSiteSettings();
  
  const title = pageTitle || settings?.siteTitle || 'Midnight Spa';
  const description = pageDescription || settings?.siteDescription || 'Your ultimate destination for relaxation and wellness';
  const image = pageImage || settings?.ogImage || '/images/default-og.jpg';

  return {
    metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'),
    title: {
      template: `%s | ${settings?.siteName || 'Midnight Spa'}`,
      default: title
    },
    description,
    keywords: settings?.siteKeywords?.split(',').map(k => k.trim()) || [],
    openGraph: {
      type: 'website',
      title,
      description,
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: title
        }
      ],
      siteName: settings?.siteName || 'Midnight Spa'
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [image],
      creator: settings?.twitterHandle || '@midnightspa'
    },
    icons: {
      icon: settings?.favicon || '/favicon.ico',
      apple: '/apple-touch-icon.png',
      shortcut: '/favicon-ico'
    }
  };
}

interface SiteSettings {
  organizationName?: string;
  organizationLogo?: string;
  contactPhone?: string;
  contactEmail?: string;
  contactAddress?: string;
}

export function generateStructuredData(settings: SiteSettings) {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": settings.organizationName || "Midnight Spa",
    "logo": settings.organizationLogo || `${process.env.NEXT_PUBLIC_BASE_URL}/logo.png`,
    "url": process.env.NEXT_PUBLIC_BASE_URL,
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": settings.contactPhone || "",
      "email": settings.contactEmail || "",
      "address": settings.contactAddress || ""
    }
  };
} 