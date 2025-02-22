import { revalidatePath } from 'next/cache';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { path = '/', secret } = body;

    // Check for secret to confirm this is a valid request
    if (secret !== process.env.REVALIDATION_SECRET) {
      return NextResponse.json({ message: 'Invalid secret' }, { status: 401 });
    }

    // Always revalidate the homepage when any content changes
    revalidatePath('/');
    
    // Revalidate the specific path if it's different from homepage
    if (path !== '/') {
      revalidatePath(path);
    }

    return NextResponse.json({ 
      revalidated: true, 
      paths: path === '/' ? ['/'] : ['/', path],
      now: Date.now() 
    });
  } catch (err) {
    console.error('Error during revalidation:', err);
    return NextResponse.json({ message: 'Error revalidating' }, { status: 500 });
  }
} 