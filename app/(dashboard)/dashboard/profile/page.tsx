import React from 'react';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/auth.config';
import ProfileForm from './components/ProfileForm';

export default async function ProfilePage() {
  const session = await getServerSession(authOptions);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">Profile Settings</h1>
      </div>

      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <ProfileForm user={session?.user} />
        </div>
      </div>
    </div>
  );
} 