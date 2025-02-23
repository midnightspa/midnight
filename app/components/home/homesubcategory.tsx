import React from 'react';
import SubCatCarousel from '@/components/SubCatCarousel';
import prisma from '@/lib/prisma';

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

async function getSubcategories() {
  try {
    const subcategories = await prisma.postSubCategory.findMany({
      select: {
        id: true,
        title: true,
        description: true,
        thumbnail: true,
        slug: true,
        category: {
          select: {
            id: true,
            title: true,
            slug: true
          }
        },
        _count: {
          select: {
            posts: true
          }
        }
      }
    });

    return subcategories.map(subcategory => ({
      ...subcategory,
      id: subcategory.id || '',
      title: subcategory.title || 'Uncategorized',
      description: subcategory.description || '',
      thumbnail: subcategory.thumbnail || null,
      _count: {
        posts: subcategory._count?.posts || 0
      }
    }));
  } catch (error) {
    console.error('Error fetching subcategories:', error);
    return [];
  }
}

export default async function HomeSubcategory() {
  const subcategories = await getSubcategories();

  return (
    <section className="py-16 bg-neutral-50">
      <SubCatCarousel subcategories={subcategories} />
    </section>
  );
}
