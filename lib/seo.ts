import { Metadata } from 'next';

export async function getSiteSettings() {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/settings`, {
      next: { revalidate: 3600 },
    });
    if (!response.ok) {
      throw new Error('Failed to fetch site settings');
    }
    return response.json();
  } catch (error) {
    console.error('Error fetching site settings:', error);
    return null;
  }
}

export function generateStructuredData(settings: any) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: settings?.siteName || '',
    description: settings?.siteDescription || '',
    url: process.env.NEXT_PUBLIC_BASE_URL,
    logo: `${process.env.NEXT_PUBLIC_BASE_URL}/logo.png`,
  };
}

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();

  return {
    title: {
      default: settings?.siteName || '',
      template: `%s | ${settings?.siteName || ''}`,
    },
    description: settings?.siteDescription || '',
    keywords: settings?.siteKeywords?.split(',').map((keyword: string) => keyword.trim()) || [],
    metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || ''),
    openGraph: {
      title: settings?.siteName || '',
      description: settings?.siteDescription || '',
      url: process.env.NEXT_PUBLIC_BASE_URL,
      siteName: settings?.siteName || '',
      images: [
        {
          url: `${process.env.NEXT_PUBLIC_BASE_URL}/logo.png`,
          width: 1200,
          height: 630,
        },
      ],
      locale: 'en_US',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: settings?.siteName || '',
      description: settings?.siteDescription || '',
      images: [`${process.env.NEXT_PUBLIC_BASE_URL}/logo.png`],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    verification: {
      google: settings?.googleSiteVerification || '',
    },
  };
} 