'use client';

import { useState, useEffect } from 'react';
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
  const [urlToIndex, setUrlToIndex] = useState('');
  const [indexingResults, setIndexingResults] = useState<IndexingResult[]>([]);
  const [sitemapStatus, setSitemapStatus] = useState<{ lastUpdated: string; urlCount: number } | null>(null);

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

  const handleSubmitUrl = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/seo/index-url', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ urls: [urlToIndex] }),
      });

      if (!response.ok) throw new Error('Failed to submit URL for indexing');
      
      const result = await response.json();
      await loadIndexingHistory();
      setUrlToIndex('');
      toast.success('URL submitted for indexing');
    } catch (err) {
      toast.error('Failed to submit URL for indexing');
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
      toast.success('Sitemap generated successfully');
    } catch (err) {
      toast.error('Failed to generate sitemap');
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
                    <Input
                      value={currentSettings.title}
                      onChange={(e) => handleChange('title', e.target.value)}
                      placeholder="Enter meta title"
                    />
                  </label>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Meta Description
                    <Textarea
                      value={currentSettings.description}
                      onChange={(e) => handleChange('description', e.target.value)}
                      rows={4}
                      placeholder="Enter meta description"
                    />
                  </label>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Keywords
                    <Input
                      value={currentSettings.keywords || ''}
                      onChange={(e) => handleChange('keywords', e.target.value)}
                      placeholder="Enter keywords (comma-separated)"
                    />
                  </label>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Open Graph Title
                    <Input
                      value={currentSettings.ogTitle || ''}
                      onChange={(e) => handleChange('ogTitle', e.target.value)}
                      placeholder="Enter Open Graph title"
                    />
                  </label>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Open Graph Description
                    <Textarea
                      value={currentSettings.ogDescription || ''}
                      onChange={(e) => handleChange('ogDescription', e.target.value)}
                      rows={4}
                      placeholder="Enter Open Graph description"
                    />
                  </label>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Open Graph Image URL
                    <Input
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
                <Input
                  value={urlToIndex}
                  onChange={(e) => setUrlToIndex(e.target.value)}
                  placeholder="Enter URL to index"
                  className="flex-1"
                />
                <Button onClick={handleSubmitUrl} disabled={loading || !urlToIndex}>
                  Submit URL
                </Button>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Recent Indexing Results</h3>
                <div className="space-y-2">
                  {indexingResults.map((result, index) => (
                    <div key={index} className={`p-4 rounded-lg ${result.status === 'success' ? 'bg-green-50' : 'bg-red-50'}`}>
                      <p className="font-medium">{result.url}</p>
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