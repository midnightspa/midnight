'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Metadata } from 'next';
import MetaTagsAnalyzer from './components/MetaTagsAnalyzer';
import SitemapManager from './components/SitemapManager';
import SeoStats from './components/SeoStats';
import IndexingManager from './components/IndexingManager';
import StaticPagesSeo from './components/StaticPagesSeo';

interface SeoSettings {
  path: string;
  title: string;
  description: string;
  keywords: string;
}

export const metadata: Metadata = {
  title: 'SEO Dashboard - Midnight Spa',
  description: 'Manage your website\'s SEO settings and monitor performance',
};

export default function SEODashboard() {
  const [settings, setSettings] = useState<SeoSettings[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedPage, setSelectedPage] = useState('/');
  const [currentSettings, setCurrentSettings] = useState<SeoSettings>({
    path: '/',
    title: '',
    description: '',
    keywords: '',
  });

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/seo/static-pages');
      if (!response.ok) throw new Error('Failed to load settings');
      const data = await response.json();
      setSettings(data);
      if (data.length > 0) {
        setCurrentSettings(data[0]);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load settings');
    } finally {
      setLoading(false);
    }
  };

  const handlePageSelect = (path: string) => {
    const pageSettings = settings.find(s => s.path === path) || {
      path,
      title: '',
      description: '',
      keywords: '',
    };
    setSelectedPage(path);
    setCurrentSettings(pageSettings);
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/seo/static-pages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(currentSettings),
      });
      
      if (!response.ok) throw new Error('Failed to save settings');
      
      await loadSettings();
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save settings');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field: keyof SeoSettings, value: string) => {
    setCurrentSettings(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const pages = [
    { path: '/', label: 'Home' },
    { path: '/about', label: 'About' },
    { path: '/services', label: 'Services' },
    { path: '/contact', label: 'Contact' },
    { path: '/blog', label: 'Blog' },
    { path: '/categories', label: 'Categories' },
    { path: '/videos', label: 'Videos' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">SEO Dashboard</h2>
        <p className="text-muted-foreground">
          Manage your website's SEO settings and monitor performance
        </p>
      </div>

      <div className="grid gap-6">
        <SeoStats />
        <StaticPagesSeo />
        <IndexingManager />
        <MetaTagsAnalyzer />
        <SitemapManager />
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-2xl font-semibold mb-4">SEO Management</h2>
        
        {error && (
          <div className="mb-4 p-4 bg-red-50 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Page Selection */}
          <div className="lg:col-span-1">
            <h3 className="text-lg font-medium mb-4">Pages</h3>
            <div className="space-y-2">
              {pages.map(page => (
                <button
                  key={page.path}
                  onClick={() => handlePageSelect(page.path)}
                  className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${
                    selectedPage === page.path
                      ? 'bg-blue-50 text-blue-700'
                      : 'hover:bg-gray-50'
                  }`}
                >
                  {page.label}
                </button>
              ))}
            </div>
          </div>

          {/* Settings Form */}
          <div className="lg:col-span-3">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Meta Title
                </label>
                <input
                  type="text"
                  value={currentSettings.title}
                  onChange={(e) => handleChange('title', e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter meta title"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Meta Description
                </label>
                <textarea
                  value={currentSettings.description}
                  onChange={(e) => handleChange('description', e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  rows={4}
                  placeholder="Enter meta description"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Keywords
                </label>
                <input
                  type="text"
                  value={currentSettings.keywords}
                  onChange={(e) => handleChange('keywords', e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter keywords (comma-separated)"
                />
              </div>

              <div className="flex justify-end">
                <button
                  onClick={handleSave}
                  disabled={loading}
                  className={`px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors ${
                    loading ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  {loading ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 