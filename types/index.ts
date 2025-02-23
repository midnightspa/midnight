export interface Post {
  id: string;
  title: string;
  excerpt: string | null;
  thumbnail: string | null;
  createdAt: string;
  tags: string[];
  slug: string;
  category?: {
    title: string;
    slug: string;
  } | null;
  subcategory?: {
    title: string;
    slug: string;
  } | null;
  author: {
    name: string;
  };
}

export interface Category {
  id: string;
  title: string;
  description: string | null;
  thumbnail: string | null;
  slug: string;
  subcategories: SubCategory[];
}

export interface SubCategory {
  id: string;
  title: string;
  description: string | null;
  thumbnail: string | null;
  slug: string;
  categoryId: string;
  category: {
    id: string;
    title: string;
    slug: string;
  };
  _count: {
    posts: number;
  };
}

export interface Video {
  id: string;
  title: string;
  description: string | null;
  youtubeUrl: string;
  thumbnail: string | null;
  createdAt: string;
  slug: string;
  author: {
    name: string | null;
  };
}

export interface Settings {
  organizationName: string | null;
  organizationLogo: string | null;
  contactPhone: string | null;
  contactEmail: string | null;
  contactAddress: string | null;
  siteName: string | null;
  siteTitle: string | null;
  siteDescription: string | null;
  siteKeywords: string | null;
  favicon: string | null;
  id: string;
  createdAt: Date;
  updatedAt: Date;
} 