import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/auth.config';
import fs from 'fs/promises';
import path from 'path';
import { parseStringPromise } from 'xml2js';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const sitemapPath = path.join(process.cwd(), 'public', 'sitemap.xml');
    
    try {
      const stats = await fs.stat(sitemapPath);
      const content = await fs.readFile(sitemapPath, 'utf-8');
      const result = await parseStringPromise(content);
      
      const urls = result.urlset?.url || [];
      
      return NextResponse.json({
        lastUpdated: stats.mtime.toISOString(),
        urlCount: urls.length,
      });
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
        return NextResponse.json({
          lastUpdated: null,
          urlCount: 0,
        });
      }
      throw error;
    }
  } catch (error) {
    console.error('Error checking sitemap status:', error);
    return NextResponse.json(
      { error: 'Failed to check sitemap status' },
      { status: 500 }
    );
  }
} 