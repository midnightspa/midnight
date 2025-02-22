import { revalidatePath } from 'next/cache';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { path = '/' } = body;
    
    // Verify the secret if provided
    const secret = request.headers.get('x-revalidate-token');
    if (secret !== process.env.REVALIDATE_TOKEN) {
      return NextResponse.json(
        { message: 'Invalid token' },
        { status: 401 }
      );
    }

    // Revalidate the path
    revalidatePath(path);

    return NextResponse.json(
      { revalidated: true, message: `Revalidated ${path}` },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: 'Error revalidating', error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
} 