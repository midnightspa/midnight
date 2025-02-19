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

    const categories = await prisma.postCategory.findMany({
      select: {
        id: true,
        title: true,
        description: true,
        slug: true,
        thumbnail: true,
        _count: {
          select: {
            posts: true,
            subcategories: true
          }
        },
        subcategories: {
          select: {
            id: true,
            title: true,
            description: true,
            slug: true,
            _count: {
              select: {
                posts: true
              }
            }
          }
        }
      },
      orderBy: {
        title: 'asc'
      }
    });

    return NextResponse.json({
      success: true,
      data: categories
    });
  } catch (error) {
    console.error('Error fetching categories:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch categories',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
} 