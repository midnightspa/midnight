'use client';

import { useState } from 'react';
import { toast } from 'react-hot-toast';

export default function SitemapManager() {
  const [loading, setLoading] = useState(false);
  const [lastGenerated, setLastGenerated] = useState<string | null>(null);

  const generateSitemap = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/sitemap/generate', {
        method: 'POST',
      });

      if (!response.ok) {
        throw new Error('Failed to generate sitemap');
      }

      setLastGenerated(new Date().toLocaleString());
      toast.success('Sitemap generated successfully');
    } catch (error) {
      console.error('Error generating sitemap:', error);
      toast.error('Failed to generate sitemap');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500">
            Last generated: {lastGenerated || 'Never'}
          </p>
          <p className="text-sm text-gray-500">
            Location: /sitemap.xml
          </p>
        </div>
        <button
          onClick={generateSitemap}
          disabled={loading}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? 'Generating...' : 'Generate Sitemap'}
        </button>
      </div>

      <div className="mt-4 p-4 bg-gray-50 rounded-md">
        <h3 className="text-sm font-medium text-gray-900">Sitemap includes:</h3>
        <ul className="mt-2 text-sm text-gray-500 list-disc list-inside">
          <li>All published posts</li>
          <li>All published products</li>
          <li>All published videos</li>
          <li>All category pages</li>
          <li>Homepage and static pages</li>
        </ul>
      </div>
    </div>
  );
} 