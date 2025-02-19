'use client';

import { useState, useEffect, ChangeEvent } from 'react';
import { toast } from 'sonner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface SeoSettings {
  path: string;
  title: string;
  description: string;
  keywords: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  twitterTitle?: string;
  twitterDescription?: string;
  twitterImage?: string;
}

interface IndexingResult {
  url: string;
  status: 'success' | 'error';
  message: string;
  timestamp: string;
}

export function SEODashboard() {
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
  const [urls, setUrls] = useState<string[]>([]);
  const [selectedUrls, setSelectedUrls] = useState<string[]>([]);
  const [fetchingUrls, setFetchingUrls] = useState(false);
  const [indexingResults, setIndexingResults] = useState<IndexingResult[]>([]);
  const [sitemapStatus, setSitemapStatus] = useState<{ lastUpdated: string; urlCount: number } | null>(null);
  const [activeTab, setActiveTab] = useState('static-pages');

  useEffect(() => {
    loadSettings();
    loadIndexingHistory();
    checkSitemapStatus();
  }, []);

  const loadSettings = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/seo/static-pages');
      if (!response.ok) throw new Error('Failed to load SEO settings');
      const data = await response.json();
      setSettings(data);
      if (data.length > 0) {
        const homePage = data.find((s: SeoSettings) => s.path === '/') || data[0];
        setCurrentSettings(homePage);
      }
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      toast.error('Failed to load SEO settings');
    } finally {
      setLoading(false);
    }
  };

  const loadIndexingHistory = async () => {
    try {
      const response = await fetch('/api/seo/index-url');
      if (!response.ok) throw new Error('Failed to load indexing history');
      const data = await response.json();
      setIndexingResults(data);
    } catch (err) {
      toast.error('Failed to load indexing history');
    }
  };

  const checkSitemapStatus = async () => {
    try {
      const response = await fetch('/api/sitemap/status');
      if (!response.ok) throw new Error('Failed to check sitemap status');
      const data = await response.json();
      setSitemapStatus(data);
    } catch (err) {
      toast.error('Failed to check sitemap status');
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

  const handleChange = (field: keyof SeoSettings, value: string) => {
    setCurrentSettings(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/seo/static-pages', {
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

  const fetchAllUrls = async () => {
    try {
      setFetchingUrls(true);
      const [postsRes, videosRes, productsRes] = await Promise.all([
        fetch('/api/posts?published=true'),
        fetch('/api/videos?published=true'),
        fetch('/api/products?published=true')
      ]);

      const [posts, videos, products] = await Promise.all([
        postsRes.json(),
        videosRes.json(),
        productsRes.json()
      ]);

      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://themidnightspa.com';
      
      const allUrls = [
        `${baseUrl}`,
        `${baseUrl}/about`,
        `${baseUrl}/contact`,
        `${baseUrl}/services`,
        `${baseUrl}/blog`,
        `${baseUrl}/videos`,
        `${baseUrl}/shop`,
        ...posts.map((post: any) => `${baseUrl}/posts/${post.slug}`),
        ...videos.map((video: any) => `${baseUrl}/videos/${video.slug}`),
        ...products.map((product: any) => `${baseUrl}/shop/${product.slug}`)
      ];

      setUrls(allUrls);
      alert(`Found ${allUrls.length} URLs`);
    } catch (err) {
      console.error('Error fetching URLs:', err);
      alert('Failed to fetch URLs');
    } finally {
      setFetchingUrls(false);
    }
  };

  const handleUrlSelect = (url: string) => {
    setSelectedUrls(prev => 
      prev.includes(url) 
        ? prev.filter(u => u !== url)
        : [...prev, url]
    );
  };

  const handleSelectAll = () => {
    setSelectedUrls(urls.length === selectedUrls.length ? [] : [...urls]);
  };

  const handleIndexSelected = async () => {
    if (selectedUrls.length === 0) {
      alert('Please select URLs to index');
      return;
    }

    try {
      setLoading(true);
      const response = await fetch('/api/seo/index-url', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ urls: selectedUrls }),
      });

      if (!response.ok) throw new Error('Failed to submit URLs for indexing');
      
      const result = await response.json();
      await loadIndexingHistory();
      setSelectedUrls([]);
      alert(`Successfully submitted ${selectedUrls.length} URLs for indexing`);
    } catch (err) {
      alert('Failed to submit URLs for indexing');
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateSitemap = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/sitemap/generate', {
        method: 'POST',
      });

      if (!response.ok) throw new Error('Failed to generate sitemap');
      
      await checkSitemapStatus();
      alert('Sitemap generated successfully');
    } catch (err) {
      alert('Failed to generate sitemap');
    } finally {
      setLoading(false);
    }
  };

  if (loading && !currentSettings.path) return <div className="flex justify-center items-center h-screen">Loading...</div>;
  if (error) return <div className="text-red-500">Error: {error}</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">SEO Dashboard</h1>
      
      <Tabs defaultValue="static-pages" className="space-y-4">
        <TabsList>
          <TabsTrigger value="static-pages">Static Pages</TabsTrigger>
          <TabsTrigger value="indexing">Search Console</TabsTrigger>
          <TabsTrigger value="sitemap">Sitemap</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
        </TabsList>

        <TabsContent value="static-pages">
          <Card>
            <CardHeader>
              <CardTitle>Page SEO Settings</CardTitle>
              <CardDescription>Manage SEO settings for static pages</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
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
                    <option value="/blog">Blog Page</option>
                    <option value="/videos">Videos Page</option>
                    <option value="/shop">Shop Page</option>
                  </select>
                </label>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Meta Title
                    <input
                      type="text"
                      value={currentSettings.title}
                      onChange={(e: ChangeEvent<HTMLInputElement>) => handleChange('title', e.target.value)}
                      placeholder="Enter meta title"
                      className="w-full p-2 border rounded"
                    />
                  </label>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Meta Description
                    <textarea
                      value={currentSettings.description}
                      onChange={(e: ChangeEvent<HTMLTextAreaElement>) => handleChange('description', e.target.value)}
                      rows={4}
                      placeholder="Enter meta description"
                      className="w-full p-2 border rounded"
                    />
                  </label>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Keywords
                    <input
                      type="text"
                      value={currentSettings.keywords || ''}
                      onChange={(e: ChangeEvent<HTMLInputElement>) => handleChange('keywords', e.target.value)}
                      placeholder="Enter keywords (comma-separated)"
                      className="w-full p-2 border rounded"
                    />
                  </label>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Open Graph Title
                    <input
                      type="text"
                      value={currentSettings.ogTitle || ''}
                      onChange={(e: ChangeEvent<HTMLInputElement>) => handleChange('ogTitle', e.target.value)}
                      placeholder="Enter Open Graph title"
                      className="w-full p-2 border rounded"
                    />
                  </label>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Open Graph Description
                    <textarea
                      value={currentSettings.ogDescription || ''}
                      onChange={(e: ChangeEvent<HTMLTextAreaElement>) => handleChange('ogDescription', e.target.value)}
                      rows={4}
                      placeholder="Enter Open Graph description"
                      className="w-full p-2 border rounded"
                    />
                  </label>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Open Graph Image URL
                    <input
                      value={currentSettings.ogImage || ''}
                      onChange={(e) => handleChange('ogImage', e.target.value)}
                      placeholder="Enter Open Graph image URL"
                    />
                  </label>
                </div>

                <Button
                  onClick={handleSave}
                  disabled={loading}
                  className="w-full"
                >
                  {loading ? 'Saving...' : 'Save Settings'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="indexing">
          <Card>
            <CardHeader>
              <CardTitle>Google Search Console</CardTitle>
              <CardDescription>Submit URLs for indexing and monitor status</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex gap-4">
                <button
                  onClick={fetchAllUrls}
                  disabled={fetchingUrls}
                  className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50"
                >
                  {fetchingUrls ? 'Fetching URLs...' : 'Fetch All URLs'}
                </button>
                <button
                  onClick={handleSelectAll}
                  disabled={urls.length === 0}
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
                >
                  {urls.length === selectedUrls.length ? 'Deselect All' : 'Select All'}
                </button>
                <button
                  onClick={handleIndexSelected}
                  disabled={selectedUrls.length === 0 || loading}
                  className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600 disabled:opacity-50"
                >
                  {loading ? 'Indexing...' : `Index Selected (${selectedUrls.length})`}
                </button>
              </div>

              <div className="border rounded-lg p-4">
                <h3 className="font-semibold mb-4">Available URLs ({urls.length})</h3>
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {urls.map((url, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={selectedUrls.includes(url)}
                        onChange={() => handleUrlSelect(url)}
                        className="h-4 w-4"
                      />
                      <span className="text-sm">{url}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-8">
                <h3 className="font-semibold mb-4">Recent Indexing Results</h3>
                <div className="space-y-2">
                  {indexingResults.map((result, index) => (
                    <div key={index} className={`p-4 border rounded ${result.status === 'success' ? 'border-green-500' : 'border-red-500'}`}>
                      <p>{result.url}</p>
                      <p className="text-sm text-gray-600">{result.message}</p>
                      <p className="text-xs text-gray-500">{result.timestamp}</p>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="sitemap">
          <Card>
            <CardHeader>
              <CardTitle>Sitemap Management</CardTitle>
              <CardDescription>Generate and monitor your sitemap</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Last Updated: {sitemapStatus?.lastUpdated || 'Never'}</p>
                  <p className="text-sm text-gray-600">URLs in Sitemap: {sitemapStatus?.urlCount || 0}</p>
                </div>
                <Button onClick={handleGenerateSitemap} disabled={loading}>
                  Generate Sitemap
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="performance">
          <Card>
            <CardHeader>
              <CardTitle>Performance Metrics</CardTitle>
              <CardDescription>Monitor your website's performance and SEO health</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">Performance monitoring coming soon...</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
} 