import { PrismaClient, Role } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting database seeding...');

  // Create admin user if it doesn't exist
  const adminEmail = 'admin@midnightspa.com';
  const existingAdmin = await prisma.user.findUnique({
    where: { email: adminEmail },
  });

  if (!existingAdmin) {
    const hashedPassword = await bcrypt.hash('Admin123!', 10);
    await prisma.user.create({
      data: {
        email: adminEmail,
        password: hashedPassword,
        name: 'Admin User',
        role: Role.ADMIN,
        isApproved: true,
      },
    });
    console.log('Admin user created successfully');
  } else {
    console.log('Admin user already exists');
  }

  // Create site settings if they don't exist
  const existingSettings = await prisma.siteSettings.findFirst();
  if (!existingSettings) {
    await prisma.siteSettings.create({
      data: {
        siteName: 'Midnight Spa',
        siteTitle: 'Midnight Spa - Luxury Wellness',
        siteDescription: 'Luxury spa services and products',
        siteKeywords: 'spa, wellness, luxury, treatments, products',
        contactEmail: 'contact@midnightspa.com',
        contactPhone: '+1234567890',
        contactAddress: '123 Spa Street, Wellness City',
        favicon: '/favicon.ico',
        ogImage: '/images/og-image.jpg',
        twitterHandle: '@midnightspa',
        organizationName: 'Midnight Spa LLC',
        organizationLogo: '/images/logo.png',
      },
    });
    console.log('Site settings created successfully');
  } else {
    console.log('Site settings already exist');
  }

  console.log('Database seeding completed successfully');
}

main()
  .catch((e) => {
    console.error('Error during database seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 