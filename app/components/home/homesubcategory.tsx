import React from 'react';
import SubCatCarousel from '@/components/SubCatCarousel';

interface SubCategory {
  id: string;
  title: string;
  description: string | null;
  thumbnail: string | null;
  slug: string;
  category: {
    id: string;
    title: string;
    slug: string;
  };
  _count: {
    posts: number;
  };
}

interface HomeSubcategoryProps {
  subcategories: SubCategory[];
}

export default function HomeSubcategory({ subcategories }: HomeSubcategoryProps) {
  return (
    <section className="py-16 bg-neutral-50">
      <SubCatCarousel subcategories={subcategories} />
    </section>
  );
}
