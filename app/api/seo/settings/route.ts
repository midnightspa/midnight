import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/auth.config';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const settings = await prisma.siteSettings.findFirst();
    return NextResponse.json(settings);
  } catch (error) {
    console.error('Error fetching SEO settings:', error);
    return NextResponse.json(
      { error: 'Failed to fetch SEO settings' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const data = await request.json();
    const settings = await prisma.siteSettings.create({
      data: {
        siteName: data.siteName,
        siteTitle: data.siteTitle,
        siteDescription: data.siteDescription,
        siteKeywords: data.siteKeywords,
        ogTitle: data.ogTitle,
        ogDescription: data.ogDescription,
        ogImage: data.ogImage,
        twitterHandle: data.twitterHandle,
        twitterCardType: data.twitterCardType,
        organizationName: data.organizationName,
        organizationLogo: data.organizationLogo,
        contactEmail: data.contactEmail,
        contactPhone: data.contactPhone,
        contactAddress: data.contactAddress,
        googleAnalyticsId: data.googleAnalyticsId,
        googleSiteVerification: data.googleSiteVerification,
        robotsTxt: data.robotsTxt,
        sitemapXml: data.sitemapXml,
        favicon: data.favicon,
      },
    });

    return NextResponse.json(settings);
  } catch (error) {
    console.error('Error creating SEO settings:', error);
    return NextResponse.json(
      { error: 'Failed to create SEO settings' },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const data = await request.json();
    const settings = await prisma.siteSettings.update({
      where: { id: data.id },
      data: {
        siteName: data.siteName,
        siteTitle: data.siteTitle,
        siteDescription: data.siteDescription,
        siteKeywords: data.siteKeywords,
        ogTitle: data.ogTitle,
        ogDescription: data.ogDescription,
        ogImage: data.ogImage,
        twitterHandle: data.twitterHandle,
        twitterCardType: data.twitterCardType,
        organizationName: data.organizationName,
        organizationLogo: data.organizationLogo,
        contactEmail: data.contactEmail,
        contactPhone: data.contactPhone,
        contactAddress: data.contactAddress,
        googleAnalyticsId: data.googleAnalyticsId,
        googleSiteVerification: data.googleSiteVerification,
        robotsTxt: data.robotsTxt,
        sitemapXml: data.sitemapXml,
        favicon: data.favicon,
      },
    });

    return NextResponse.json(settings);
  } catch (error) {
    console.error('Error updating SEO settings:', error);
    return NextResponse.json(
      { error: 'Failed to update SEO settings' },
      { status: 500 }
    );
  }
} 