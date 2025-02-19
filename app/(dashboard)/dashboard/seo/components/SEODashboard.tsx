'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

interface SeoSettings {
  metaTitle: string;
  metaDescription: string;
  keywords: string;
}

export function SEODashboard() {
  const [settings, setSettings] = useState<SeoSettings[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedPage, setSelectedPage] = useState('/');
  const [currentSettings, setCurrentSettings] = useState<SeoSettings>({
    metaTitle: '',
    metaDescription: '',
    keywords: '',
  });

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/seo');
      if (!response.ok) throw new Error('Failed to load SEO settings');
      const data = await response.json();
      setSettings(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      toast.error('Failed to load SEO settings');
    } finally {
      setLoading(false);
    }
  };

  const handlePageSelect = (path: string) => {
    const pageSettings = settings.find(s => s.metaTitle === path) || {
      metaTitle: path,
      metaDescription: '',
      keywords: '',
    };
    setSelectedPage(path);
    setCurrentSettings(pageSettings);
  };

  const handleChange = (field: keyof SeoSettings, value: string) => {
    setCurrentSettings(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/seo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(currentSettings),
      });
      
      if (!response.ok) throw new Error('Failed to save SEO settings');
      
      await loadSettings();
      toast.success('SEO settings saved successfully');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      toast.error('Failed to save SEO settings');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="flex justify-center items-center h-screen">Loading...</div>;
  if (error) return <div className="text-red-500">Error: {error}</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">SEO Dashboard</h1>
      
      <div className="grid gap-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Page SEO Settings</h2>
          
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Page
                <select
                  value={selectedPage}
                  onChange={(e) => handlePageSelect(e.target.value)}
                  className="mt-1 block w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="/">Home Page</option>
                  <option value="/about">About Page</option>
                  <option value="/services">Services Page</option>
                  <option value="/contact">Contact Page</option>
                </select>
              </label>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Meta Title
                <input
                  type="text"
                  value={currentSettings.metaTitle}
                  onChange={(e) => handleChange('metaTitle', e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter meta title"
                />
              </label>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Meta Description
                <textarea
                  value={currentSettings.metaDescription}
                  onChange={(e) => handleChange('metaDescription', e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  rows={4}
                  placeholder="Enter meta description"
                />
              </label>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Keywords
                <input
                  type="text"
                  value={currentSettings.keywords}
                  onChange={(e) => handleChange('keywords', e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter keywords (comma-separated)"
                />
              </label>
            </div>

            <button
              onClick={handleSave}
              disabled={loading}
              className="w-full bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
            >
              {loading ? 'Saving...' : 'Save Settings'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 