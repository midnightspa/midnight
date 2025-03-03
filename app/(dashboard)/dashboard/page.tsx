import React from 'react';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/auth.config';
import { redirect } from 'next/navigation';
import prisma from '@/lib/prisma';
import DashboardContent from '../dashboard/components/DashboardContent';

export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect('/auth/signin');
  }

  // Verify user exists and is approved
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { isApproved: true, role: true }
  });

  if (!user || (!user.isApproved && user.role !== 'SUPER_ADMIN')) {
    redirect('/auth/signin');
  }

  // Fetch dashboard stats
  const [postsCount, videosCount, productsCount] = await Promise.all([
    prisma.post.count({ where: { published: true } }),
    prisma.video.count({ where: { published: true } }),
    prisma.product.count({ where: { published: true } }),
  ]);

  return (
    <DashboardContent
      postsCount={postsCount}
      videosCount={videosCount}
      productsCount={productsCount}
      userEmail={session.user.email}
    />
  );
} 