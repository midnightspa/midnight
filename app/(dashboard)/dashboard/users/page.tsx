import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from '@/app/api/auth/[...nextauth]/auth.config';
import prisma from '@/lib/prisma';
import UserManagement from '../../../components/admin/UserManagement';
import { Role } from '@prisma/client';

export default async function AdminUsersPage() {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    console.log('No session found, redirecting to signin');
    redirect('/auth/signin');
  }

  try {
    // Verify the current user is a super admin
    const currentUser = await prisma.user.findUnique({
      where: { 
        id: session.user.id 
      },
      select: {
        id: true,
        email: true,
        role: true
      }
    });

    console.log('Current user:', {
      id: currentUser?.id,
      email: currentUser?.email,
      role: currentUser?.role
    });

    if (!currentUser || currentUser.role !== Role.SUPER_ADMIN) {
      console.log('Access denied: Not a super admin');
      redirect('/');
    }

    // Fetch all users except super admin
    const users = await prisma.user.findMany({
      where: {
        role: {
          not: Role.SUPER_ADMIN
        }
      },
      orderBy: {
        createdAt: 'desc'
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        isApproved: true,
        createdAt: true,
      }
    });

    // Transform the data to match the component's expected types
    const transformedUsers = users.map(user => ({
      ...user,
      createdAt: user.createdAt.toISOString()
    }));

    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">User Management</h1>
        <UserManagement users={transformedUsers} />
      </div>
    );
  } catch (error) {
    console.error('Error in AdminUsersPage:', error);
    redirect('/');
  }
} 