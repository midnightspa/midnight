import { hash } from 'bcryptjs';
import prisma from '../lib/prisma';

async function updateAdminPassword() {
  try {
    const hashedPassword = await hash('Mounir@X2bbvn7y', 12);
    
    const updatedUser = await prisma.user.update({
      where: {
        email: 'mounir@clicksalesmedia.com'
      },
      data: {
        password: hashedPassword,
        isApproved: true,
        role: 'SUPER_ADMIN'
      }
    });

    console.log('Password updated successfully for user:', updatedUser.email);
  } catch (error) {
    console.error('Error updating password:', error);
  } finally {
    await prisma.$disconnect();
  }
}

updateAdminPassword(); 