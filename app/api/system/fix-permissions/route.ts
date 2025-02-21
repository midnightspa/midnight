import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/auth.config';
import { mkdir, chmod } from 'fs/promises';
import path from 'path';

export async function POST() {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
    
    // Ensure uploads directory exists
    await mkdir(uploadsDir, { recursive: true });
    
    // Set directory permissions to 755
    await chmod(uploadsDir, 0o755);
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error fixing permissions:', error);
    return NextResponse.json(
      { error: 'Failed to fix permissions' },
      { status: 500 }
    );
  }
} 