import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/auth.config';
import { submitUrlToIndex, submitUrlsToIndex } from '@/lib/google-indexing';
import prisma from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { urls, type } = await request.json();

    if (!urls || !Array.isArray(urls)) {
      return NextResponse.json(
        { error: 'URLs must be provided as an array' },
        { status: 400 }
      );
    }

    const results = await submitUrlsToIndex(urls, type);

    // Log indexing request to database
    await prisma.seoIndexingLog.create({
      data: {
        urls: urls as string[],
        type: type || 'URL_UPDATED',
        results: results as any,
        userId: session.user.id,
      },
    });

    return NextResponse.json({ results });
  } catch (error) {
    console.error('Error submitting URLs for indexing:', error);
    return NextResponse.json(
      { error: 'Failed to submit URLs for indexing' },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const logs = await prisma.seoIndexingLog.findMany({
      orderBy: { createdAt: 'desc' },
      take: 100,
      include: {
        user: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    });

    return NextResponse.json(logs);
  } catch (error) {
    console.error('Error fetching indexing logs:', error);
    return NextResponse.json(
      { error: 'Failed to fetch indexing logs' },
      { status: 500 }
    );
  }
} 