import { NextResponse } from 'next/server';
import { writeFile } from 'fs/promises';
import { join } from 'path';
import { mkdir } from 'fs/promises';
import sharp from 'sharp';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('thumbnail') as File;
    
    if (!file) {
      console.error('No file received in request');
      return NextResponse.json(
        { error: 'No file uploaded' },
        { status: 400 }
      );
    }

    console.log('Received file:', {
      name: file.name,
      type: file.type,
      size: file.size
    });

    // Validate file size (10MB limit)
    if (file.size > 10 * 1024 * 1024) {
      console.error('File size too large:', file.size);
      return NextResponse.json(
        { error: 'File size exceeds 10MB limit' },
        { status: 400 }
      );
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (!allowedTypes.includes(file.type)) {
      console.error('Invalid file type:', file.type);
      return NextResponse.json(
        { error: 'Invalid file type. Only JPEG, PNG, WebP, and GIF are allowed.' },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Create uploads directory if it doesn't exist
    const uploadDir = join(process.cwd(), 'public', 'uploads');
    await mkdir(uploadDir, { recursive: true });

    // Generate unique filename
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1E9)}`;
    const extension = 'webp'; // Always convert to WebP for better compression
    const filename = `${uniqueSuffix}.${extension}`;
    const filepath = join(uploadDir, filename);

    console.log('Processing image...');

    // Optimize image using Sharp
    const optimizedImage = await sharp(buffer)
      .webp({ quality: 80 }) // Convert to WebP with 80% quality
      .resize({
        width: 1200, // Max width
        height: 800, // Max height
        fit: 'inside', // Maintain aspect ratio
        withoutEnlargement: true // Don't upscale small images
      })
      .toBuffer();

    console.log('Writing optimized file to:', filepath);

    // Write the optimized file
    await writeFile(filepath, optimizedImage);
    console.log('File written successfully');

    // Return the public URL
    const url = `/uploads/${filename}`;
    console.log('Returning URL:', url);

    return NextResponse.json({ 
      success: true,
      url: url
    });
    
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to upload file',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export const config = {
  api: {
    bodyParser: false,
  },
}; 