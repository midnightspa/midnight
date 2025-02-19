import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/auth.config';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const settings = await prisma.staticPageSeo.findMany();
    return NextResponse.json(settings);
  } catch (error) {
    console.error('Error loading static page SEO settings:', error);
    return NextResponse.json(
      { error: 'Failed to load SEO settings' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const data = await request.json();
    const { path, title, description, keywords, ogTitle, ogDescription, ogImage, twitterTitle, twitterDescription, twitterImage } = data;

    if (!path) {
      return NextResponse.json(
        { error: 'Path is required' },
        { status: 400 }
      );
    }

    const settings = await prisma.staticPageSeo.upsert({
      where: { path },
      create: {
        path,
        title,
        description,
        keywords,
        ogTitle,
        ogDescription,
        ogImage,
        twitterTitle,
        twitterDescription,
        twitterImage,
      },
      update: {
        title,
        description,
        keywords,
        ogTitle,
        ogDescription,
        ogImage,
        twitterTitle,
        twitterDescription,
        twitterImage,
      },
    });

    return NextResponse.json(settings);
  } catch (error) {
    console.error('Error saving static page SEO settings:', error);
    return NextResponse.json(
      { error: 'Failed to save SEO settings' },
      { status: 500 }
    );
  }
} 