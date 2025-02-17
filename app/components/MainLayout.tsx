'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import Header from './Header';
import Footer from './Footer';
import { CartProvider } from '../contexts/CartContext';

interface MainLayoutProps {
  children: React.ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
  const pathname = usePathname();
  
  // Check if we're in the dashboard, auth pages, or other protected routes
  const isProtectedRoute = pathname?.includes('/dashboard') || 
                          pathname?.includes('/auth/') ||
                          pathname?.includes('/admin');

  return (
    <CartProvider>
      {!isProtectedRoute && <Header />}
      <main className={`min-h-screen ${!isProtectedRoute ? 'pt-24' : ''}`}>
        {children}
      </main>
      {!isProtectedRoute && <Footer />}
    </CartProvider>
  );
} 