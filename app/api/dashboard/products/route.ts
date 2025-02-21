import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/auth.config';
import prisma from '@/lib/prisma';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';
import { ProductType } from '@prisma/client';

type FormDataEntryValue = string | File;

async function saveFile(file: FormDataEntryValue, slug: string): Promise<string> {
  // Create uploads directory if it doesn't exist
  const uploadsDir = path.join(process.cwd(), 'public/uploads');
  try {
    await writeFile(path.join(uploadsDir, 'test.txt'), '');
  } catch (error) {
    await mkdir(uploadsDir, { recursive: true });
  }

  // Generate unique filename
  const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1E9)}`;
  
  // Get file extension from name or default to .bin
  let extension = '.bin';
  if (file instanceof File) {
    if (file.name) {
      extension = path.extname(file.name) || '.bin';
    } else if (file.type) {
      // Try to get extension from MIME type
      const mimeExtension = {
        'image/jpeg': '.jpg',
        'image/png': '.png',
        'image/webp': '.webp',
        'image/gif': '.gif',
        'application/pdf': '.pdf',
        'application/msword': '.doc',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document': '.docx',
        'application/vnd.ms-excel': '.xls',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': '.xlsx',
        'text/csv': '.csv',
        'audio/mpeg': '.mp3',
        'audio/wav': '.wav'
      }[file.type];
      if (mimeExtension) {
        extension = mimeExtension;
      }
    }
  }

  const filename = `${slug}-${uniqueSuffix}${extension}`;
  
  // Convert to Buffer
  let buffer: Buffer;
  if (file instanceof File) {
    const arrayBuffer = await file.arrayBuffer();
    buffer = Buffer.from(arrayBuffer);
  } else {
    // Handle string by converting to buffer directly
    buffer = Buffer.from(file);
  }

  // Save the file
  const filepath = path.join(uploadsDir, filename);
  await writeFile(filepath, buffer);
  
  // Return the relative path
  return `/uploads/${filename}`;
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const formData = await request.formData();
    const title = formData.get('title') as string;
    const description = formData.get('description') as string;
    const price = parseFloat(formData.get('price') as string);
    const categoryId = formData.get('categoryId') as string;
    const type = formData.get('type') as string as ProductType;
    const digitalFile = formData.get('digitalFile');
    const thumbnailFile = formData.get('thumbnail');

    if (!title || !description || !price || !categoryId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Create slug from title
    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    // Check if slug exists
    const existingProduct = await prisma.product.findUnique({
      where: { slug },
    });

    if (existingProduct) {
      return NextResponse.json(
        { error: 'A product with this name already exists' },
        { status: 400 }
      );
    }

    // Handle file uploads
    let digitalAssetUrl = null;
    let thumbnailUrl = null;
    let galleryUrls: string[] = [];

    if (digitalFile && (digitalFile instanceof File || typeof digitalFile === 'string')) {
      digitalAssetUrl = await saveFile(digitalFile, `${slug}-digital`);
    }

    if (thumbnailFile && (thumbnailFile instanceof File || typeof thumbnailFile === 'string')) {
      thumbnailUrl = await saveFile(thumbnailFile, `${slug}-thumb`);
    }

    // Handle gallery files
    const galleryFiles: FormDataEntryValue[] = [];
    const entries = Array.from(formData.entries());
    for (const [key, value] of entries) {
      if (key.startsWith('gallery[') && (value instanceof File || typeof value === 'string')) {
        galleryFiles.push(value);
      }
    }

    for (const file of galleryFiles) {
      const url = await saveFile(file, `${slug}-gallery`);
      galleryUrls.push(url);
    }

    // Handle bundles
    const bundles = [];
    let bundleIndex = 0;
    while (formData.has(`bundles[${bundleIndex}][title]`)) {
      const bundleTitle = formData.get(`bundles[${bundleIndex}][title]`) as string;
      const bundleDescription = formData.get(`bundles[${bundleIndex}][description]`) as string;
      const bundlePrice = parseFloat(formData.get(`bundles[${bundleIndex}][price]`) as string);
      const bundleThumbnailFile = formData.get(`bundles[${bundleIndex}][thumbnail]`);

      let bundleThumbnailUrl = null;

      if (bundleThumbnailFile && (bundleThumbnailFile instanceof File || typeof bundleThumbnailFile === 'string')) {
        bundleThumbnailUrl = await saveFile(bundleThumbnailFile, `${slug}-bundle-${bundleIndex}-thumb`);
      }

      // Create bundle slug
      const bundleSlug = `${slug}-bundle-${bundleIndex}`;

      bundles.push({
        title: bundleTitle,
        description: bundleDescription,
        price: bundlePrice,
        thumbnail: bundleThumbnailUrl,
        slug: bundleSlug,
      });

      bundleIndex++;
    }

    // Create the product
    const product = await prisma.product.create({
      data: {
        title,
        description,
        price,
        type,
        slug,
        thumbnail: thumbnailUrl,
        gallery: galleryUrls,
        digitalAssets: digitalAssetUrl ? [digitalAssetUrl] : [],
        published: false,
        featured: false,
        categoryId,
        authorId: session.user.id,
      },
      include: {
        category: true,
      },
    });

    // Create bundles and associate them with the product
    if (bundles.length > 0) {
      for (const bundle of bundles) {
        await prisma.bundle.create({
          data: {
            title: bundle.title,
            description: bundle.description,
            price: bundle.price,
            thumbnail: bundle.thumbnail,
            slug: bundle.slug,
            published: false,
            products: {
              connect: { id: product.id }
            }
          }
        });
      }

      // Fetch the product again with bundles included
      const updatedProduct = await prisma.product.findUnique({
        where: { id: product.id },
        include: {
          category: true,
          bundles: true,
        }
      });

      return NextResponse.json(updatedProduct);
    }

    return NextResponse.json(product);
  } catch (error) {
    console.error('Product creation error:', error);
    return NextResponse.json(
      { error: 'Failed to create product' },
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

    const { searchParams } = new URL(request.url);
    const categoryId = searchParams.get('category');
    const featured = searchParams.get('featured');
    const published = searchParams.get('published');

    const where = {
      ...(categoryId && { categoryId }),
      ...(featured === 'true' && { featured: true }),
      ...(published === 'true' && { published: true }),
    };

    const products = await prisma.product.findMany({
      where,
      include: {
        category: {
          select: {
            title: true,
            slug: true,
          },
        },
        author: {
          select: {
            name: true,
          },
        },
        bundles: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    );
  }
} 