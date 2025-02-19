import prisma from '../lib/prisma';

async function resetPassword() {
  try {
    const hashedPassword = '$2a$12$rtlylorJtGMn5.m1WizuPezr4KLvl8/n5cCdVVCuEP5mHOoLEmhH.';
    
    const updatedUser = await prisma.user.upsert({
      where: {
        email: 'mounir@clicksalesmedia.com'
      },
      update: {
        password: hashedPassword,
        isApproved: true,
        role: 'SUPER_ADMIN'
      },
      create: {
        email: 'mounir@clicksalesmedia.com',
        password: hashedPassword,
        name: 'Super Admin',
        isApproved: true,
        role: 'SUPER_ADMIN'
      }
    });

    console.log('User updated successfully:', {
      email: updatedUser.email,
      isApproved: updatedUser.isApproved,
      role: updatedUser.role
    });
  } catch (error) {
    console.error('Error updating user:', error);
  } finally {
    await prisma.$disconnect();
  }
}

resetPassword(); 