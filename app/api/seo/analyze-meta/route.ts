import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/auth.config';
import * as cheerio from 'cheerio';

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { url } = await request.json();
    if (!url) {
      return NextResponse.json(
        { error: 'URL must be provided' },
        { status: 400 }
      );
    }

    // Validate URL
    if (!url.startsWith('https://themidnightspa.com')) {
      return NextResponse.json(
        { error: 'URL must be from themidnightspa.com domain' },
        { status: 400 }
      );
    }

    // Fetch the page content
    const response = await fetch(url, {
      headers: {
        'Accept': 'text/html',
        'User-Agent': 'MetaTagsAnalyzer/1.0'
      }
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch URL: ${response.status} ${response.statusText}`);
    }

    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('text/html')) {
      throw new Error('URL did not return HTML content');
    }

    const html = await response.text();
    const $ = cheerio.load(html);

    // Extract meta tags
    const metaTags = {
      title: $('title').text() || '',
      description: $('meta[name="description"]').attr('content') || '',
      keywords: $('meta[name="keywords"]').attr('content') || '',
      ogTitle: $('meta[property="og:title"]').attr('content') || '',
      ogDescription: $('meta[property="og:description"]').attr('content') || '',
      ogImage: $('meta[property="og:image"]').attr('content') || '',
      twitterCard: $('meta[name="twitter:card"]').attr('content') || '',
      twitterTitle: $('meta[name="twitter:title"]').attr('content') || '',
      twitterDescription: $('meta[name="twitter:description"]').attr('content') || '',
      twitterImage: $('meta[name="twitter:image"]').attr('content') || '',
      canonical: $('link[rel="canonical"]').attr('href') || '',
    };

    return NextResponse.json(metaTags);
  } catch (error) {
    console.error('Error analyzing meta tags:', {
      error: error instanceof Error ? {
        message: error.message,
        stack: error.stack,
        name: error.name
      } : error
    });
    return NextResponse.json(
      { 
        error: 'Failed to analyze meta tags',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
} 