'use client';

import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';

interface IndexingLog {
  id: string;
  urls: string[];
  type: string;
  results: any;
  createdAt: string;
  user: {
    name: string;
    email: string;
  };
}

export default function IndexingManager() {
  const [logs, setLogs] = useState<IndexingLog[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedContent, setSelectedContent] = useState<string[]>([]);
  const [contentType, setContentType] = useState('posts');

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    try {
      const response = await fetch('/api/seo/index-url');
      if (!response.ok) throw new Error('Failed to fetch logs');
      const data = await response.json();
      setLogs(data);
    } catch (error) {
      console.error('Error fetching logs:', error);
      toast.error('Failed to fetch indexing logs');
    }
  };

  const fetchContent = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/${contentType}`);
      if (!response.ok) throw new Error(`Failed to fetch ${contentType}`);
      const data = await response.json();
      
      // Extract URLs based on content type
      const urls = data.map((item: any) => 
        `https://themidnightspa.com/${contentType}/${item.slug}`
      );
      setSelectedContent(urls);
    } catch (error) {
      console.error('Error fetching content:', error);
      toast.error(`Failed to fetch ${contentType}`);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitForIndexing = async () => {
    if (!selectedContent.length) {
      toast.error('Please select content to index');
      return;
    }

    try {
      setLoading(true);
      const response = await fetch('/api/seo/index-url', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          urls: selectedContent,
          type: 'URL_UPDATED',
        }),
      });

      if (!response.ok) throw new Error('Failed to submit URLs');
      
      const data = await response.json();
      toast.success('URLs submitted for indexing');
      fetchLogs();
    } catch (error) {
      console.error('Error submitting URLs:', error);
      toast.error('Failed to submit URLs for indexing');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">Google Search Console Indexing</h2>
        
        <div className="space-y-4">
          <div className="flex gap-4">
            <select
              value={contentType}
              onChange={(e) => setContentType(e.target.value)}
              className="rounded-md border-gray-300"
            >
              <option value="posts">Posts</option>
              <option value="videos">Videos</option>
              <option value="products">Products</option>
              <option value="categories">Categories</option>
            </select>
            
            <button
              onClick={fetchContent}
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              Fetch Content
            </button>
            
            <button
              onClick={handleSubmitForIndexing}
              disabled={loading || !selectedContent.length}
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50"
            >
              Submit for Indexing
            </button>
          </div>

          {selectedContent.length > 0 && (
            <div className="mt-4">
              <h3 className="text-lg font-medium mb-2">Selected URLs ({selectedContent.length})</h3>
              <div className="max-h-40 overflow-y-auto bg-gray-50 p-4 rounded-md">
                {selectedContent.map((url, index) => (
                  <div key={index} className="text-sm text-gray-600">{url}</div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">Indexing History</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-4 py-2 text-left">Date</th>
                <th className="px-4 py-2 text-left">User</th>
                <th className="px-4 py-2 text-left">URLs</th>
                <th className="px-4 py-2 text-left">Status</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((log) => (
                <tr key={log.id} className="border-t">
                  <td className="px-4 py-2">
                    {new Date(log.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-2">{log.user.name}</td>
                  <td className="px-4 py-2">{log.urls.length} URLs</td>
                  <td className="px-4 py-2">
                    {log.results.every((r: any) => r.status === 'fulfilled')
                      ? 'Success'
                      : 'Partial Success'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
} 