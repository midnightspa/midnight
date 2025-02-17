import { PrismaClient } from '@prisma/client';
import { hash } from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  try {
    const superAdminEmail = 'mounir@clicksalesmedia.com';
    const password = 'admin123'; // Change this to a secure password

    // Check if super admin already exists
    const existingAdmin = await prisma.user.findUnique({
      where: { email: superAdminEmail }
    });

    if (existingAdmin) {
      console.log('Super admin already exists');
      return;
    }

    // Create super admin
    const hashedPassword = await hash(password, 12);
    const superAdmin = await prisma.user.create({
      data: {
        email: superAdminEmail,
        password: hashedPassword,
        name: 'Super Admin',
        role: 'SUPER_ADMIN',
        isApproved: true
      }
    });

    console.log('Super admin created successfully:', superAdmin.email);
  } catch (error) {
    console.error('Error creating super admin:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main(); 