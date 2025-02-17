import prisma from './prisma';

export async function getSiteSettings() {
  const settings = await prisma.siteSettings.findFirst();
  return settings;
}

export async function generateMetadata(pageTitle?: string, pageDescription?: string, pageImage?: string) {
  const settings = await getSiteSettings();
  
  return {
    title: pageTitle ? `${pageTitle} | ${settings?.siteName || 'Midnight Spa'}` : settings?.siteTitle || 'Midnight Spa',
    description: pageDescription || settings?.siteDescription || 'Your ultimate destination for relaxation and wellness',
    keywords: settings?.siteKeywords,
    openGraph: {
      title: pageTitle || settings?.ogTitle || 'Midnight Spa',
      description: pageDescription || settings?.ogDescription || 'Your ultimate destination for relaxation and wellness',
      images: [pageImage || settings?.ogImage || '/images/default-og.jpg'],
      siteName: settings?.siteName || 'Midnight Spa',
    },
    twitter: {
      card: settings?.twitterCardType || 'summary_large_image',
      site: settings?.twitterHandle,
    },
    icons: {
      icon: settings?.favicon || '/favicon.ico',
    },
  };
}

export function generateStructuredData(settings: any) {
  // Return a minimal structured data if settings is null
  if (!settings) {
    return {
      "@context": "https://schema.org",
      "@type": "Organization",
      "name": "Midnight Spa",
    };
  }

  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": settings.organizationName || "Midnight Spa",
    "logo": settings.organizationLogo || "/logo.png",
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": settings.contactPhone || "",
      "email": settings.contactEmail || "",
      "address": settings.contactAddress || ""
    }
  };
} 