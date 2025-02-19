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
    console.log('Received indexing request:', { urls, type });

    if (!urls || !Array.isArray(urls)) {
      return NextResponse.json(
        { error: 'URLs must be provided as an array' },
        { status: 400 }
      );
    }

    // Validate URLs
    const invalidUrls = urls.filter(url => !url.startsWith('https://themidnightspa.com'));
    if (invalidUrls.length > 0) {
      return NextResponse.json(
        { error: 'All URLs must be from themidnightspa.com domain', invalidUrls },
        { status: 400 }
      );
    }

    console.log('Submitting URLs to Google Indexing API...');
    const results = await submitUrlsToIndex(urls, type);
    console.log('Submission results:', results);

    // Check if any submissions failed
    const failedSubmissions = results.filter(result => 
      result.status === 'rejected' || (result.status === 'fulfilled' && !result.value.success)
    );

    if (failedSubmissions.length > 0) {
      console.error('Some URL submissions failed:', failedSubmissions);
    }

    // Log indexing request to database
    try {
      await prisma.seoIndexingLog.create({
        data: {
          urls: urls as string[],
          type: type || 'URL_UPDATED',
          results: results as any,
          userId: session.user.id,
        },
      });
    } catch (dbError) {
      console.error('Failed to log indexing request:', dbError);
      // Continue execution even if logging fails
    }

    return NextResponse.json({ 
      results,
      failedCount: failedSubmissions.length,
      totalCount: urls.length
    });
  } catch (error) {
    console.error('Detailed error in index-url API:', {
      error: error instanceof Error ? {
        message: error.message,
        stack: error.stack,
        name: error.name
      } : error
    });
    return NextResponse.json(
      { 
        error: 'Failed to submit URLs for indexing',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
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