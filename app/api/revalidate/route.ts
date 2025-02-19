import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath, revalidateTag } from 'next/cache';

export async function POST(request: NextRequest) {
  try {
    const { path, tag } = await request.json();

    if (path) {
      revalidatePath(path);
    }

    if (tag) {
      revalidateTag(tag);
    }

    return NextResponse.json({
      revalidated: true,
      now: Date.now(),
      path,
      tag
    });
  } catch (error) {
    return NextResponse.json({
      revalidated: false,
      now: Date.now(),
      error: 'Failed to revalidate'
    }, { status: 500 });
  }
} 