import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function GET() {
  try {
    // Test database connection by querying the User table
    const userCount = await prisma.user.count();
    
    // Test site settings
    const siteSettings = await prisma.siteSettings.findFirst();
    
    return NextResponse.json({
      status: 'success',
      message: 'Database connection successful',
      data: {
        userCount,
        siteSettings: siteSettings ? {
          siteName: siteSettings.siteName,
          siteDescription: siteSettings.siteDescription
        } : null
      }
    }, { status: 200 });
  } catch (error) {
    console.error('Database connection error:', error);
    return NextResponse.json({
      status: 'error',
      message: 'Database connection failed',
      error: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
} 