import { hash } from 'bcryptjs';
import prisma from '@/lib/prisma';

async function updatePassword() {
  try {
    const newPassword = 'Mounir@X2bbvn7y';
    const hashedPassword = await hash(newPassword, 12);
    
    const updatedUser = await prisma.user.updateMany({
      where: {
        password: '$2a$12$E1lvegsdODzhPyBPPlO8MOPtg6YUvIli8PzujN.EVFaflWEQaGlTy'
      },
      data: {
        password: hashedPassword
      }
    });

    console.log('Password updated successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error updating password:', error);
    process.exit(1);
  }
}

updatePassword(); 