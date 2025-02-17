import './globals.css';
import type { Metadata } from 'next';
import { Poppins } from 'next/font/google';
import MainLayout from './components/MainLayout';
import { Toaster } from 'sonner';

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
});

export const metadata: Metadata = {
  title: 'Midnight Spa',
  description: 'Your ultimate destination for relaxation and wellness',
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'),
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={poppins.className} suppressHydrationWarning>
        <MainLayout>{children}</MainLayout>
        <Toaster />
      </body>
    </html>
  );
}
