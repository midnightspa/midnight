'use client';

import { useEffect, useState } from 'react';
import { ChartBarIcon, DocumentIcon, ExclamationCircleIcon, DevicePhoneMobileIcon } from '@heroicons/react/24/outline';

interface SeoStatsData {
  totalPages: number;
  indexedPages: number;
  missingMetaTags: number;
  mobilePerformance: number;
}

export default function SeoStats() {
  const [stats, setStats] = useState<SeoStatsData>({
    totalPages: 0,
    indexedPages: 0,
    missingMetaTags: 0,
    mobilePerformance: 85,
  });

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      // Fetch total pages
      const [posts, products, videos] = await Promise.all([
        fetch('/api/posts').then(res => res.json()),
        fetch('/api/products').then(res => res.json()),
        fetch('/api/videos').then(res => res.json())
      ]);

      const totalPages = posts.length + products.length + videos.length;
      
      setStats(prev => ({
        ...prev,
        totalPages,
        indexedPages: totalPages, // This should be fetched from Google Search Console API
      }));
    } catch (error) {
      console.error('Error fetching SEO stats:', error);
    }
  };

  const stats_items = [
    {
      name: 'Total Pages',
      value: stats.totalPages,
      icon: DocumentIcon,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
    },
    {
      name: 'Indexed Pages',
      value: stats.indexedPages,
      icon: ChartBarIcon,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
    },
    {
      name: 'Missing Meta Tags',
      value: stats.missingMetaTags,
      icon: ExclamationCircleIcon,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-100',
    },
    {
      name: 'Mobile Performance',
      value: `${stats.mobilePerformance}%`,
      icon: DevicePhoneMobileIcon,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
    },
  ];

  return (
    <>
      {stats_items.map((item) => (
        <div
          key={item.name}
          className="bg-white overflow-hidden rounded-lg shadow"
        >
          <div className="p-5">
            <div className="flex items-center">
              <div className={`flex-shrink-0 rounded-md p-3 ${item.bgColor}`}>
                <item.icon
                  className={`h-6 w-6 ${item.color}`}
                  aria-hidden="true"
                />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    {item.name}
                  </dt>
                  <dd className="text-lg font-semibold text-gray-900">
                    {item.value}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      ))}
    </>
  );
} 