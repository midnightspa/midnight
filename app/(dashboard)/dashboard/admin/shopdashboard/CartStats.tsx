"use client";

import React, { useEffect, useState } from 'react';

interface CartStatsProps {}

interface CartStat {
  stage: string;
  count: number;
  percentage?: number;
}

const CartStats: React.FC<CartStatsProps> = () => {
  const [stats, setStats] = useState<CartStat[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/admin/stats/cart');
        
        if (!response.ok) {
          throw new Error(`Error: ${response.status}`);
        }
        
        const data = await response.json();
        setStats(data.stats);
      } catch (err) {
        setError('Failed to load cart statistics');
        console.error('Error fetching cart stats:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  // Helper function to get color based on stage
  const getStageColor = (stage: string): string => {
    switch (stage) {
      case 'VIEWING_CART':
        return 'bg-blue-100 text-blue-800';
      case 'ADDED_TO_CART':
        return 'bg-green-100 text-green-800';
      case 'STARTED_CHECKOUT':
        return 'bg-yellow-100 text-yellow-800';
      case 'ABANDONED_CHECKOUT':
        return 'bg-orange-100 text-orange-800';
      case 'COMPLETED_CHECKOUT':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Format stage name for display
  const formatStageName = (stage: string): string => {
    return stage
      .split('_')
      .map(word => word.charAt(0) + word.slice(1).toLowerCase())
      .join(' ');
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <div className="mb-4">
        <h2 className="text-xl font-semibold">Cart Activity</h2>
        <p className="text-sm text-gray-500">User cart behavior statistics</p>
      </div>
      <div className="mt-4">
        {loading ? (
          <div className="space-y-2">
            <div className="h-4 bg-gray-200 rounded animate-pulse w-full" />
            <div className="h-4 bg-gray-200 rounded animate-pulse w-full" />
            <div className="h-4 bg-gray-200 rounded animate-pulse w-full" />
          </div>
        ) : error ? (
          <div className="p-4 text-sm text-red-800 bg-red-100 rounded-md">
            {error}
          </div>
        ) : (
          <div className="space-y-4">
            {stats.length === 0 ? (
              <p className="text-sm text-gray-500">No cart activity data available</p>
            ) : (
              stats.map((stat, index) => (
                <div key={index} className="flex flex-col space-y-1">
                  <div className="flex justify-between items-center">
                    <span className={`px-2 py-1 rounded-md text-xs font-medium ${getStageColor(stat.stage)}`}>
                      {formatStageName(stat.stage)}
                    </span>
                    <span className="text-sm font-medium">{stat.count}</span>
                  </div>
                  {stat.percentage !== undefined && (
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div 
                        className="bg-blue-600 h-2.5 rounded-full" 
                        style={{ width: `${stat.percentage}%` }}
                      />
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default CartStats; 