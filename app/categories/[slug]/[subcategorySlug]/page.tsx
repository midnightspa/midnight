import { Metadata } from 'next';
import prisma from '@/lib/prisma';
import SubCategoryClient from './SubCategoryClient';

export async function generateMetadata({ params }: { params: { slug: string, subcategorySlug: string } }): Promise<Metadata> {
  const resolvedParams = await params;
  const subcategory = await prisma.postSubCategory.findFirst({
    where: {
      slug: resolvedParams.subcategorySlug,
      category: {
        slug: resolvedParams.slug
      }
    },
    include: {
      category: {
        select: {
          title: true
        }
      }
    }
  });

  if (!subcategory) {
    return {
      title: 'Subcategory Not Found',
      description: 'The requested subcategory could not be found.',
      robots: { index: false, follow: false }
    };
  }

  return {
    title: subcategory.seoTitle || `${subcategory.title} - ${subcategory.category.title} Articles`,
    description: subcategory.seoDescription || `Discover expert articles about ${subcategory.title.toLowerCase()} in our ${subcategory.category.title.toLowerCase()} collection. Learn from professionals and enhance your wellness journey.`,
    keywords: subcategory.seoKeywords || `${subcategory.title.toLowerCase()}, ${subcategory.category.title.toLowerCase()}, wellness, relaxation, spa treatments`,
    openGraph: {
      title: subcategory.seoTitle || `${subcategory.title} - ${subcategory.category.title}`,
      description: subcategory.seoDescription || subcategory.description || `Discover expert articles about ${subcategory.title.toLowerCase()} in our ${subcategory.category.title.toLowerCase()} collection.`,
      type: 'website',
      images: subcategory.thumbnail ? [
        {
          url: subcategory.thumbnail,
          width: 1200,
          height: 630,
          alt: subcategory.title
        }
      ] : undefined
    },
    twitter: {
      card: 'summary_large_image',
      title: subcategory.seoTitle || `${subcategory.title} - ${subcategory.category.title}`,
      description: subcategory.seoDescription || subcategory.description || `Discover expert articles about ${subcategory.title.toLowerCase()} in our ${subcategory.category.title.toLowerCase()} collection.`,
      images: subcategory.thumbnail ? [subcategory.thumbnail] : undefined
    }
  };
}

export default function SubCategoryPage() {
  return <SubCategoryClient />;
} 