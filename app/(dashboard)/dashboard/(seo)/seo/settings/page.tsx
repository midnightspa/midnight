import React from 'react';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/auth.config';
import { redirect } from 'next/navigation';
import prisma from '@/lib/prisma';
import SEOSettingsForm from './components/SEOSettingsForm';

export default async function SEOSettingsPage() {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    redirect('/auth/signin');
  }

  // Fetch existing SEO settings
  const settings = await prisma.siteSettings.findFirst();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">SEO Settings</h1>
          <p className="mt-1 text-sm text-gray-600">
            Manage your website's SEO and social media meta information
          </p>
        </div>
      </div>

      <div className="bg-white shadow rounded-lg">
        <SEOSettingsForm initialData={settings} />
      </div>
    </div>
  );
} 