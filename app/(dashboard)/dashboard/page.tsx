import React from 'react';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/auth.config';
import { redirect } from 'next/navigation';
import prisma from '@/lib/prisma';

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect('/auth/signin');
  }

  // Fetch dashboard stats
  const [postsCount, videosCount, productsCount] = await Promise.all([
    prisma.post.count({ where: { published: true } }),
    prisma.video.count({ where: { published: true } }),
    prisma.product.count({ where: { published: true } }),
  ]);

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-2xl font-semibold mb-4">Dashboard</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Quick Stats */}
        <div className="bg-blue-50 p-4 rounded-lg">
          <h3 className="text-lg font-medium text-blue-900">Published Posts</h3>
          <p className="text-3xl font-bold text-blue-600">{postsCount}</p>
        </div>
        
        <div className="bg-green-50 p-4 rounded-lg">
          <h3 className="text-lg font-medium text-green-900">Published Videos</h3>
          <p className="text-3xl font-bold text-green-600">{videosCount}</p>
        </div>
        
        <div className="bg-purple-50 p-4 rounded-lg">
          <h3 className="text-lg font-medium text-purple-900">Active Products</h3>
          <p className="text-3xl font-bold text-purple-600">{productsCount}</p>
        </div>
      </div>
      
      {/* Recent Activity Section */}
      <div className="mt-8">
        <h3 className="text-xl font-semibold mb-4">Recent Activity</h3>
        <div className="bg-gray-50 p-4 rounded-lg">
          <p className="text-gray-600 text-center">
            Track your recent content updates and user interactions here.
          </p>
        </div>
      </div>
    </div>
  );
} 