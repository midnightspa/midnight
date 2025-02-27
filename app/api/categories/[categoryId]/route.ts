import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/auth.config';
import { unlink } from 'fs/promises';
import path from 'path';
import { writeFile, mkdir } from 'fs/promises';

export async function DELETE(
  request: Request,
  { params }: { params: { categoryId: string } }
) {
  try {
    const resolvedParams = await params;
    const categoryId = resolvedParams.categoryId;
    
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // First, get the category to check if it has a thumbnail
    const category = await prisma.postCategory.findUnique({
      where: { id: categoryId },
      include: { subcategories: true },
    });

    if (!category) {
      return NextResponse.json({ error: 'Category not found' }, { status: 404 });
    }

    // Check if category has subcategories
    if (category.subcategories.length > 0) {
      return NextResponse.json(
        { error: 'Cannot delete category with subcategories. Please delete subcategories first.' },
        { status: 400 }
      );
    }

    // Delete the thumbnail file if it exists
    if (category.thumbnail) {
      try {
        const thumbnailPath = path.join(process.cwd(), 'public', category.thumbnail);
        await unlink(thumbnailPath);
      } catch (error) {
        console.error('Error deleting thumbnail file:', error);
        // Continue with category deletion even if thumbnail deletion fails
      }
    }

    // Delete the category
    await prisma.postCategory.delete({
      where: { id: categoryId },
    });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error('Error deleting category:', error);
    return NextResponse.json(
      { error: 'Failed to delete category' },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: { categoryId: string } }
) {
  try {
    const resolvedParams = await params;
    const categoryId = resolvedParams.categoryId;
    
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const formData = await request.formData();
    const title = formData.get('title') as string;
    const description = formData.get('description') as string;
    const slug = formData.get('slug') as string;
    const seoTitle = formData.get('seoTitle') as string;
    const seoDescription = formData.get('seoDescription') as string;
    const seoKeywords = formData.get('seoKeywords') as string;
    const thumbnailFile = formData.get('thumbnail') as File | null;

    if (!title || !slug) {
      return NextResponse.json(
        { error: 'Title and slug are required' },
        { status: 400 }
      );
    }

    // Handle thumbnail upload if provided
    let thumbnail = undefined;
    if (thumbnailFile) {
      try {
        // Create uploads directory if it doesn't exist
        const uploadsDir = path.join(process.cwd(), 'public/uploads');
        await mkdir(uploadsDir, { recursive: true });

        // Generate unique filename
        const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1E9)}`;
        const filename = `${slug}-${uniqueSuffix}${path.extname(thumbnailFile.name)}`;
        
        // Convert File to Buffer
        const bytes = await thumbnailFile.arrayBuffer();
        const buffer = Buffer.from(bytes);

        // Save the file
        const filepath = path.join(uploadsDir, filename);
        await writeFile(filepath, buffer);
        
        // Set the thumbnail URL
        thumbnail = `/uploads/${filename}`;
      } catch (error) {
        console.error('Error uploading thumbnail:', error);
        return NextResponse.json(
          { error: 'Failed to upload thumbnail' },
          { status: 500 }
        );
      }
    }

    const category = await prisma.postCategory.update({
      where: {
        id: categoryId,
      },
      data: {
        title,
        slug,
        description: description || undefined,
        ...(thumbnail && { thumbnail }),
        seoTitle: seoTitle || undefined,
        seoDescription: seoDescription || undefined,
        seoKeywords: seoKeywords || undefined,
      },
    });

    return NextResponse.json(category);
  } catch (error) {
    console.error('Error updating category:', error);
    return NextResponse.json(
      { error: 'Failed to update category' },
      { status: 500 }
    );
  }
}

export async function GET(
  request: Request,
  { params }: { params: { categoryId: string } }
) {
  try {
    const resolvedParams = await params;
    const slug = resolvedParams.categoryId;

    const category = await prisma.postCategory.findFirst({
      where: {
        OR: [
          { slug },
          { id: slug }
        ]
      },
      include: {
        subcategories: {
          select: {
            id: true,
            title: true,
            slug: true,
            _count: {
              select: {
                posts: true
              }
            }
          }
        }
      }
    });

    if (!category) {
      return NextResponse.json(
        { error: 'Category not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(category);
  } catch (error) {
    console.error('Error fetching category:', error);
    return NextResponse.json(
      { error: 'Failed to fetch category' },
      { status: 500 }
    );
  }
} 