'use client';

import { useState } from 'react';
import { format } from 'date-fns';
import { Subscriber, SubscriberStatus } from '@prisma/client';
import { toast } from 'sonner';

interface SubscribersListProps {
  subscribers: Subscriber[];
}

export default function SubscribersList({ subscribers: initialSubscribers }: SubscribersListProps) {
  const [subscribers, setSubscribers] = useState(initialSubscribers);
  const [selectedSubscribers, setSelectedSubscribers] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleStatusChange = async (subscriberId: string, newStatus: SubscriberStatus) => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/newsletter/subscribers/${subscriberId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) {
        throw new Error('Failed to update subscriber status');
      }

      setSubscribers(subscribers.map(sub => 
        sub.id === subscriberId ? { ...sub, status: newStatus } : sub
      ));
      toast.success(`Subscriber status updated to ${newStatus.toLowerCase()}`);
    } catch (error) {
      toast.error('Failed to update subscriber status');
      console.error('Error updating subscriber status:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectAll = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      setSelectedSubscribers(subscribers.map(sub => sub.id));
    } else {
      setSelectedSubscribers([]);
    }
  };

  const handleSelectSubscriber = (subscriberId: string) => {
    setSelectedSubscribers(current => {
      if (current.includes(subscriberId)) {
        return current.filter(id => id !== subscriberId);
      }
      return [...current, subscriberId];
    });
  };

  const getStatusBadgeClass = (status: SubscriberStatus) => {
    switch (status) {
      case 'ACTIVE':
        return 'bg-green-100 text-green-800';
      case 'UNSUBSCRIBED':
        return 'bg-gray-100 text-gray-800';
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="mt-8 flow-root">
        <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
            <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
              <table className="min-w-full divide-y divide-gray-300">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="relative px-7 sm:w-12 sm:px-6">
                      <input
                        type="checkbox"
                        className="absolute left-4 top-1/2 -mt-2 h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                        checked={selectedSubscribers.length === subscribers.length}
                        onChange={handleSelectAll}
                      />
                    </th>
                    <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">
                      Email
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Status
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Subscribed Date
                    </th>
                    <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                      <span className="sr-only">Actions</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {subscribers.map((subscriber) => (
                    <tr key={subscriber.id}>
                      <td className="relative px-7 sm:w-12 sm:px-6">
                        <input
                          type="checkbox"
                          className="absolute left-4 top-1/2 -mt-2 h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                          checked={selectedSubscribers.includes(subscriber.id)}
                          onChange={() => handleSelectSubscriber(subscriber.id)}
                        />
                      </td>
                      <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                        {subscriber.email}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        <span className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${getStatusBadgeClass(subscriber.status)}`}>
                          {subscriber.status.toLowerCase()}
                        </span>
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        {format(new Date(subscriber.createdAt), 'MMM d, yyyy')}
                      </td>
                      <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                        {subscriber.status === 'ACTIVE' ? (
                          <button
                            onClick={() => handleStatusChange(subscriber.id, 'UNSUBSCRIBED')}
                            disabled={isLoading}
                            className="text-red-600 hover:text-red-900 disabled:opacity-50"
                          >
                            Unsubscribe
                          </button>
                        ) : (
                          <button
                            onClick={() => handleStatusChange(subscriber.id, 'ACTIVE')}
                            disabled={isLoading}
                            className="text-indigo-600 hover:text-indigo-900 disabled:opacity-50"
                          >
                            Reactivate
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 