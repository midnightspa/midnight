import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from '@/app/api/auth/[...nextauth]/auth.config';
import prisma from '@/lib/prisma';
import SubscribersList from './components/SubscribersList';

export const metadata = {
  title: 'Newsletter Subscribers',
  description: 'Manage your newsletter subscribers'
};

export default async function SubscribersPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect('/auth/signin');
  }

  const subscribers = await prisma.subscriber.findMany({
    orderBy: {
      createdAt: 'desc'
    }
  });

  return (
    <div className="py-10">
      <header>
        <div className="px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold leading-tight tracking-tight text-gray-900">Newsletter Subscribers</h1>
          <p className="mt-2 text-sm text-gray-700">
            Manage your newsletter subscribers, view their status, and export their information.
          </p>
        </div>
      </header>
      <main>
        <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="px-4 py-8 sm:px-0">
            <SubscribersList subscribers={subscribers} />
          </div>
        </div>
      </main>
    </div>
  );
} 