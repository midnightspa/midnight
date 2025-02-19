import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { PrismaClient } from '@prisma/client';

// Use the same API key as posts
const API_KEY = process.env.EXTERNAL_API_KEY || 'your-secure-api-key-for-external-access';

// Validate API key
const validateApiKey = (request: Request) => {
  const apiKey = request.headers.get('x-api-key');
  return apiKey === API_KEY;
};

export async function GET(request: Request) {
  try {
    // Validate API key
    if (!validateApiKey(request)) {
      return NextResponse.json({ 
        success: false, 
        error: 'Unauthorized - Invalid API key' 
      }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const categorySlug = searchParams.get('category');

    const subcategories = await prisma.postSubCategory.findMany({
      where: categorySlug ? {
        category: {
          slug: categorySlug
        }
      } : undefined,
      select: {
        id: true,
        title: true,
        description: true,
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
      },
      orderBy: {
        title: 'asc'
      }
    });

    return NextResponse.json({
      success: true,
      data: subcategories
    });
  } catch (error) {
    console.error('Error fetching subcategories:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch subcategories',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
} 