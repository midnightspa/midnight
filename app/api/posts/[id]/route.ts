import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/auth.config';
import { writeFile } from 'fs/promises';
import path from 'path';
import { submitUrlToIndex } from '@/lib/google-indexing';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const resolvedParams = await params;
    const post = await prisma.post.findUnique({
      where: {
        id: resolvedParams.id,
      },
      select: {
        id: true,
        title: true,
        content: true,
        excerpt: true,
        thumbnail: true,
        createdAt: true,
        published: true,
        tags: true,
        category: {
          select: {
            id: true,
            title: true,
            slug: true,
          },
        },
        subcategory: {
          select: {
            id: true,
            title: true,
            slug: true,
          },
        },
      },
    });

    if (!post) {
      return NextResponse.json(
        { error: 'Post not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(post);
  } catch (error) {
    console.error('Error fetching post:', error);
    return NextResponse.json(
      { error: 'Failed to fetch post' },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const resolvedParams = await params;
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get the current post
    const currentPost = await prisma.post.findUnique({
      where: { id: resolvedParams.id },
      select: { published: true, slug: true }
    });

    if (!currentPost) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }

    // Parse the request body
    const contentType = request.headers.get('content-type') || '';
    let data: any = {};
    
    if (contentType.includes('application/json')) {
      data = await request.json();
    } else if (contentType.includes('multipart/form-data')) {
      const formData = await request.formData();
      formData.forEach((value, key) => {
        if (key === 'published') {
          data[key] = value === 'true';
        } else if (key === 'tags') {
          data[key] = JSON.parse(value as string);
        } else {
          data[key] = value;
        }
      });
    }

    // Update the post
    const updatedPost = await prisma.post.update({
      where: { id: resolvedParams.id },
      data: {
        ...data,
        published: typeof data.published === 'boolean' ? data.published : currentPost.published
      }
    });

    // Trigger revalidation for affected pages
    const paths = [
      `/posts/${updatedPost.slug}`,
      '/posts',
      '/',
      '/archive',
      `/categories/${updatedPost.categoryId}`,
    ];

    // Revalidate all affected paths
    await Promise.all(paths.map(async (path) => {
      try {
        await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/revalidate`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ 
            path,
            tag: `post-${updatedPost.id}`
          })
        });
      } catch (error) {
        console.error(`Failed to revalidate path: ${path}`, error);
      }
    }));

    // If publish status changed and the post is now published, submit to Google indexing
    if (data.published === true && !currentPost.published) {
      try {
        const url = `${process.env.NEXT_PUBLIC_BASE_URL}/posts/${currentPost.slug}`;
        await submitUrlToIndex(url);
        
        // Log the indexing request
        await prisma.seoIndexingLog.create({
          data: {
            urls: [url],
            type: 'URL_UPDATED',
            results: { status: 'submitted' },
            userId: session.user.id,
          },
        });
      } catch (indexError) {
        console.error('Error submitting to Google indexing:', indexError);
      }
    }

    return NextResponse.json(updatedPost);
  } catch (error) {
    console.error('Error updating post:', error);
    return NextResponse.json(
      { error: 'Failed to update post' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const resolvedParams = await params;
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await prisma.post.delete({
      where: {
        id: resolvedParams.id,
      },
    });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error('Error deleting post:', error);
    return NextResponse.json(
      { error: 'Failed to delete post' },
      { status: 500 }
    );
  }
} 