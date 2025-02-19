import './globals.css';
import type { Metadata } from 'next';
import { Poppins } from 'next/font/google';
import MainLayout from './components/MainLayout';
import { Toaster } from 'sonner';
import { AuthProvider } from './contexts/AuthContext';
import Script from 'next/script';

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'),
  title: {
    template: '%s | Midnight Spa',
    default: 'Midnight Spa'
  },
  description: 'Your ultimate destination for relaxation and wellness',
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' }
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' }
    ]
  },
  manifest: '/site.webmanifest',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: process.env.NEXT_PUBLIC_BASE_URL,
    title: 'Midnight Spa',
    description: 'Your ultimate destination for relaxation and wellness',
    siteName: 'Midnight Spa',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Midnight Spa',
    description: 'Your ultimate destination for relaxation and wellness',
    creator: '@midnightspa',
  },
  other: {
    'msapplication-TileColor': '#ffffff'
  }
};

export const viewport = {
  themeColor: '#ffffff',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={poppins.className} suppressHydrationWarning>
        <noscript>
          <iframe 
            src={`https://www.googletagmanager.com/ns.html?id=${process.env.NEXT_PUBLIC_GTM_ID}`}
            height="0" 
            width="0" 
            style={{display: 'none', visibility: 'hidden'}}
          />
        </noscript>
        <Script
          strategy="afterInteractive"
          src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID}`}
        />
        <Script
          id="google-analytics"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${process.env.NEXT_PUBLIC_GA_ID}');
            `
          }}
        />
        <AuthProvider>
          <MainLayout>{children}</MainLayout>
          <Toaster richColors position="top-right" />
        </AuthProvider>
      </body>
    </html>
  );
}
