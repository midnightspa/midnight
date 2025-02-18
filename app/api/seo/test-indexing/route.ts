import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/auth.config';
import { submitUrlToIndex } from '@/lib/google-indexing';

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { url } = await request.json();
    
    if (!url) {
      return NextResponse.json(
        { error: 'URL must be provided' },
        { status: 400 }
      );
    }

    const result = await submitUrlToIndex(url);

    return NextResponse.json({ success: true, result });
  } catch (error) {
    console.error('Error testing indexing:', error);
    return NextResponse.json(
      { 
        error: 'Failed to test indexing',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
} 