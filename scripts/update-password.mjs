import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function updatePassword() {
  try {
    const newPassword = 'Mounir@X2bbvn7y';
    const hashedPassword = await bcrypt.hash(newPassword, 12);
    
    const updatedUser = await prisma.user.updateMany({
      where: {
        password: '$2a$12$E1lvegsdODzhPyBPPlO8MOPtg6YUvIli8PzujN.EVFaflWEQaGlTy'
      },
      data: {
        password: hashedPassword
      }
    });

    console.log('Password updated successfully:', updatedUser);
  } catch (error) {
    console.error('Error updating password:', error);
  } finally {
    await prisma.$disconnect();
  }
}

updatePassword(); 