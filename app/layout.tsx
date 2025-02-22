import './globals.css';
import type { Metadata } from 'next';
import { Poppins } from 'next/font/google';
import MainLayout from './components/MainLayout';
import { Toaster } from 'sonner';
import { AuthProvider } from './contexts/AuthContext';
import Script from 'next/script';
import { generateMetadata as generateSiteMetadata } from '@/lib/seo';

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
});

export async function generateMetadata(): Promise<Metadata> {
  return generateSiteMetadata();
}

export const viewport = {
  themeColor: '#ffffff',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body className={poppins.className} suppressHydrationWarning>
        <AuthProvider>
          <MainLayout>
            {children}
            <Toaster position="top-center" />
          </MainLayout>
        </AuthProvider>
        {process.env.NEXT_PUBLIC_GTM_ID && (
          <>
            <noscript>
              <iframe 
                src={`https://www.googletagmanager.com/ns.html?id=${process.env.NEXT_PUBLIC_GTM_ID}`}
                height="0" 
                width="0" 
                style={{display: 'none', visibility: 'hidden'}}
              />
            </noscript>
            <Script
              id="gtm"
              strategy="afterInteractive"
              dangerouslySetInnerHTML={{
                __html: `
                  (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
                  new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
                  j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
                  'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
                  })(window,document,'script','dataLayer','${process.env.NEXT_PUBLIC_GTM_ID}');
                `
              }}
            />
          </>
        )}
        {process.env.NEXT_PUBLIC_GA_ID && (
          <>
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
          </>
        )}
      </body>
    </html>
  );
}
