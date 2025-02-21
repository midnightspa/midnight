import { NextResponse } from 'next/server';
import { writeFile, mkdir, chmod, chown } from 'fs/promises';
import path from 'path';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/auth.config';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

async function setFilePermissions(filePath: string) {
  try {
    // Set file permissions to 777
    await chmod(filePath, 0o777);
    // Set ownership to www-data (uid: 33, gid: 33 for www-data)
    await execAsync(`chown www-data:www-data "${filePath}"`);
  } catch (error) {
    console.error('Error setting file permissions:', error);
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get('file') as File;
    
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

    // Generate unique filename
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(7);
    const filename = `${timestamp}-${randomString}-${file.name}`;
    
    // Ensure uploads directory exists
    const uploadDir = path.join(process.cwd(), 'public', 'uploads');
    await mkdir(uploadDir, { recursive: true });
    
    const filePath = path.join(uploadDir, filename);

    // Write file
    await writeFile(filePath, buffer);
    
    // Set correct permissions and ownership
    await setFilePermissions(filePath);
    
    // Return the public URL - ensure it starts with /uploads/
    const url = `/uploads/${filename}`;
    console.log('File saved successfully:', {
      path: filePath,
      publicUrl: url
    });

    return NextResponse.json({ 
      success: true,
      filename: url,
      url // Adding url field for backward compatibility
    });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: 'Failed to upload file' },
      { status: 500 }
    );
  }
}

export const config = {
  api: {
    bodyParser: false,
  },
}; 