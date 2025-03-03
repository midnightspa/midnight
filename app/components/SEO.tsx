'use client';

import { Metadata } from 'next';
import Head from 'next/head';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  ogImage?: string;
  ogType?: 'website' | 'article' | 'product' | 'video';
  canonical?: string;
  structuredData?: object;
  author?: string;
  publishedTime?: string;
  modifiedTime?: string;
  category?: string;
  tags?: string[];
  locale?: string;
  alternateLocales?: string[];
  twitterCard?: 'summary' | 'summary_large_image' | 'app' | 'player';
  twitterSite?: string;
  twitterCreator?: string;
  noindex?: boolean;
  nofollow?: boolean;
}

export default function SEO({
  title,
  description,
  keywords,
  ogImage,
  ogType = 'website',
  canonical,
  structuredData,
  author,
  publishedTime,
  modifiedTime,
  category,
  tags = [],
  locale = 'en_US',
  alternateLocales = [],
  twitterCard = 'summary_large_image',
  twitterSite,
  twitterCreator,
  noindex = false,
  nofollow = false,
}: SEOProps) {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
  const fullCanonical = canonical ? `${baseUrl}${canonical}` : baseUrl;

  return (
    <Head>
      {/* Basic Meta Tags */}
      {title && <title>{title}</title>}
      {description && <meta name="description" content={description} />}
      {keywords && <meta name="keywords" content={keywords} />}
      {author && <meta name="author" content={author} />}

      {/* Robots Meta Tags */}
      <meta 
        name="robots" 
        content={`${noindex ? 'noindex' : 'index'},${nofollow ? 'nofollow' : 'follow'}`} 
      />

      {/* Open Graph Tags */}
      <meta property="og:type" content={ogType} />
      {title && <meta property="og:title" content={title} />}
      {description && <meta property="og:description" content={description} />}
      {ogImage && <meta property="og:image" content={ogImage} />}
      <meta property="og:url" content={fullCanonical} />
      <meta property="og:locale" content={locale} />
      {alternateLocales.map((alt) => (
        <meta key={alt} property="og:locale:alternate" content={alt} />
      ))}
      {category && <meta property="article:section" content={category} />}
      {tags.map((tag) => (
        <meta key={tag} property="article:tag" content={tag} />
      ))}
      {publishedTime && <meta property="article:published_time" content={publishedTime} />}
      {modifiedTime && <meta property="article:modified_time" content={modifiedTime} />}
      {author && <meta property="article:author" content={author} />}

      {/* Twitter Card Tags */}
      <meta name="twitter:card" content={twitterCard} />
      {title && <meta name="twitter:title" content={title} />}
      {description && <meta name="twitter:description" content={description} />}
      {ogImage && <meta name="twitter:image" content={ogImage} />}
      {twitterSite && <meta name="twitter:site" content={twitterSite} />}
      {twitterCreator && <meta name="twitter:creator" content={twitterCreator} />}

      {/* Canonical URL */}
      <link rel="canonical" href={fullCanonical} />

      {/* Alternate Language URLs */}
      {alternateLocales.map((locale) => (
        <link
          key={locale}
          rel="alternate"
          hrefLang={locale.toLowerCase()}
          href={`${baseUrl}/${locale.toLowerCase()}`}
        />
      ))}

      {/* Structured Data */}
      {structuredData && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      )}
    </Head>
  );
} 