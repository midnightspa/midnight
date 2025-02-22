export interface Post {
  id: string;
  title: string;
  excerpt: string;
  thumbnail: string | null;
  createdAt: string;
  tags: string[];
  slug: string;
  category: {
    title: string;
    slug: string;
  } | null;
  subcategory: {
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
  description: string;
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
  _count: {
    posts: number;
  };
}

export interface Video {
  id: string;
  title: string;
  description: string;
  youtubeUrl: string;
  thumbnail: string | null;
  createdAt: string;
  slug: string;
  author: {
    name: string;
  };
} 