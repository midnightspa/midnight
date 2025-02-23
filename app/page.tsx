import React from 'react';
import { Poppins } from 'next/font/google';
import HomeHero from '@/app/components/home/homehero';
import HomeCategory from '@/app/components/home/homecategory';
import HomeSubcategory from '@/app/components/home/homesubcategory';
import HomeVideo from '@/app/components/home/homevideo';
import HomePost from '@/app/components/home/homepost';

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
});

export default async function HomePage() {
  return (
    <div className={`min-h-screen bg-white ${poppins.className}`}>
      <HomeHero />
      <HomeCategory />
      <HomeSubcategory />
      <HomeVideo />
      <HomePost />
    </div>
  );
}