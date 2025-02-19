import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/auth.config';
import { checkUrlIndexStatus } from '@/lib/google-indexing';

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { url } = await request.json();
    console.log('Received indexing status check request for URL:', url);

    if (!url) {
      return NextResponse.json(
        { error: 'URL must be provided' },
        { status: 400 }
      );
    }

    // Validate URL
    if (!url.startsWith('https://themidnightspa.com')) {
      return NextResponse.json(
        { error: 'URL must be from themidnightspa.com domain' },
        { status: 400 }
      );
    }

    const result = await checkUrlIndexStatus(url);
    console.log('Index status check result:', result);

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error checking URL indexing status:', {
      error: error instanceof Error ? {
        message: error.message,
        stack: error.stack,
        name: error.name
      } : error
    });
    return NextResponse.json(
      { 
        error: 'Failed to check URL indexing status',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
} 