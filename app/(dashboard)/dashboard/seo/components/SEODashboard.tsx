'use client';

import { useState, useEffect, ChangeEvent } from 'react';
import { toast } from 'sonner';

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

interface UrlCategory {
  name: string;
  type: 'posts' | 'videos' | 'products' | 'categories' | 'static';
  urls: string[];
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
  const [urlCategories, setUrlCategories] = useState<UrlCategory[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionProgress, setSubmissionProgress] = useState<{ current: number; total: number }>({ current: 0, total: 0 });

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

  const fetchUrlsByCategory = async (type: UrlCategory['type']) => {
    try {
      setFetchingUrls(true);
      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://themidnightspa.com';
      let fetchedUrls: string[] = [];

      switch (type) {
        case 'posts':
          const postsRes = await fetch('/api/posts?published=true');
          if (!postsRes.ok) throw new Error('Failed to fetch posts');
          const posts = await postsRes.json();
          fetchedUrls = posts.map((post: any) => `${baseUrl}/posts/${post.slug}`);
          break;

        case 'videos':
          const videosRes = await fetch('/api/videos?published=true');
          if (!videosRes.ok) throw new Error('Failed to fetch videos');
          const videos = await videosRes.json();
          fetchedUrls = videos.map((video: any) => `${baseUrl}/videos/${video.slug}`);
          break;

        case 'products':
          const productsRes = await fetch('/api/products?published=true');
          if (!productsRes.ok) throw new Error('Failed to fetch products');
          const products = await productsRes.json();
          fetchedUrls = products.map((product: any) => `${baseUrl}/shop/${product.slug}`);
          break;

        case 'categories':
          const categoriesRes = await fetch('/api/categories');
          if (!categoriesRes.ok) throw new Error('Failed to fetch categories');
          const categories = await categoriesRes.json();
          fetchedUrls = categories.map((category: any) => `${baseUrl}/categories/${category.slug}`);
          break;

        case 'static':
          fetchedUrls = [
            `${baseUrl}`,
            `${baseUrl}/about`,
            `${baseUrl}/contact`,
            `${baseUrl}/services`,
            `${baseUrl}/blog`,
            `${baseUrl}/videos`,
            `${baseUrl}/shop`,
          ];
          break;
      }

      const category: UrlCategory = {
        name: type.charAt(0).toUpperCase() + type.slice(1),
        type,
        urls: fetchedUrls,
      };

      setUrlCategories(prev => {
        const filtered = prev.filter(c => c.type !== type);
        return [...filtered, category];
      });

      setSelectedCategory(type);
      setUrls(fetchedUrls);
      alert(`Found ${fetchedUrls.length} URLs for ${type}`);
    } catch (err) {
      console.error(`Error fetching ${type} URLs:`, err);
      alert(`Failed to fetch ${type} URLs`);
    } finally {
      setFetchingUrls(false);
    }
  };

  const submitUrlsInQueue = async (urls: string[]) => {
    setIsSubmitting(true);
    setSubmissionProgress({ current: 0, total: urls.length });

    for (let i = 0; i < urls.length; i++) {
      try {
        const response = await fetch('/api/seo/index-url', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ urls: [urls[i]] }),
        });

        if (!response.ok) throw new Error(`Failed to submit URL: ${urls[i]}`);
        
        setSubmissionProgress(prev => ({ ...prev, current: i + 1 }));
        await new Promise(resolve => setTimeout(resolve, 1000)); // Add delay between submissions
      } catch (err) {
        console.error('Error submitting URL:', urls[i], err);
      }
    }

    await loadIndexingHistory();
    setSelectedUrls([]);
    setIsSubmitting(false);
    alert('Finished submitting URLs');
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
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">SEO Dashboard</h1>
      
      <div className="mb-6">
        <div className="flex gap-4 mb-4">
          <button
            onClick={() => setActiveTab('static-pages')}
            className={`px-4 py-2 ${activeTab === 'static-pages' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
          >
            Static Pages
          </button>
          <button
            onClick={() => setActiveTab('indexing')}
            className={`px-4 py-2 ${activeTab === 'indexing' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
          >
            Search Console
          </button>
          <button
            onClick={() => setActiveTab('sitemap')}
            className={`px-4 py-2 ${activeTab === 'sitemap' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
          >
            Sitemap
          </button>
        </div>

        {activeTab === 'static-pages' && (
          <div className="space-y-4 bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Page SEO Settings</h2>
            <p className="text-gray-600 mb-6">Manage SEO settings for static pages</p>
            
            <div>
              <label className="block mb-2">
                Select Page
                <select
                  value={selectedPage}
                  onChange={(e: ChangeEvent<HTMLSelectElement>) => handlePageSelect(e.target.value)}
                  className="w-full p-2 border rounded"
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
                <label className="block mb-2">
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
                <label className="block mb-2">
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
                <label className="block mb-2">
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
                <label className="block mb-2">
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
                <label className="block mb-2">
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
                <label className="block mb-2">
                  Open Graph Image URL
                  <input
                    type="text"
                    value={currentSettings.ogImage || ''}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => handleChange('ogImage', e.target.value)}
                    placeholder="Enter Open Graph image URL"
                    className="w-full p-2 border rounded"
                  />
                </label>
              </div>

              <button
                onClick={handleSave}
                disabled={loading}
                className="w-full p-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
              >
                {loading ? 'Saving...' : 'Save Settings'}
              </button>
            </div>
          </div>
        )}

        {activeTab === 'indexing' && (
          <div className="bg-white p-6 rounded-lg shadow space-y-6">
            <div>
              <h2 className="text-xl font-semibold mb-2">Google Search Console</h2>
              <p className="text-gray-600">Submit URLs for indexing and monitor status</p>
            </div>

            <div className="flex flex-wrap gap-4">
              <button
                onClick={() => fetchUrlsByCategory('static')}
                disabled={fetchingUrls}
                className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 disabled:opacity-50"
              >
                Fetch Static Pages
              </button>
              <button
                onClick={() => fetchUrlsByCategory('posts')}
                disabled={fetchingUrls}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
              >
                Fetch Posts
              </button>
              <button
                onClick={() => fetchUrlsByCategory('videos')}
                disabled={fetchingUrls}
                className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600 disabled:opacity-50"
              >
                Fetch Videos
              </button>
              <button
                onClick={() => fetchUrlsByCategory('products')}
                disabled={fetchingUrls}
                className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50"
              >
                Fetch Products
              </button>
              <button
                onClick={() => fetchUrlsByCategory('categories')}
                disabled={fetchingUrls}
                className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600 disabled:opacity-50"
              >
                Fetch Categories
              </button>
            </div>

            {urlCategories.length > 0 && (
              <div className="flex gap-4 items-center">
                <select
                  value={selectedCategory}
                  onChange={(e) => {
                    setSelectedCategory(e.target.value);
                    const category = urlCategories.find(c => c.type === e.target.value);
                    if (category) setUrls(category.urls);
                  }}
                  className="flex-1 p-2 border rounded"
                >
                  <option value="">Select URL Category</option>
                  {urlCategories.map(category => (
                    <option key={category.type} value={category.type}>
                      {category.name} ({category.urls.length} URLs)
                    </option>
                  ))}
                </select>
                <button
                  onClick={handleSelectAll}
                  disabled={urls.length === 0}
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
                >
                  {urls.length === selectedUrls.length ? 'Deselect All' : 'Select All'}
                </button>
                <button
                  onClick={() => submitUrlsInQueue(selectedUrls)}
                  disabled={selectedUrls.length === 0 || isSubmitting}
                  className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600 disabled:opacity-50"
                >
                  {isSubmitting 
                    ? `Submitting (${submissionProgress.current}/${submissionProgress.total})`
                    : `Submit Selected (${selectedUrls.length})`
                  }
                </button>
              </div>
            )}

            {urls.length > 0 && (
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
            )}

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
          </div>
        )}

        {activeTab === 'sitemap' && (
          <div className="bg-white p-6 rounded-lg shadow">
            <div>
              <h2 className="text-xl font-semibold mb-2">Sitemap Management</h2>
              <p className="text-gray-600 mb-6">Generate and monitor your sitemap</p>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Last Updated: {sitemapStatus?.lastUpdated || 'Never'}</p>
                <p className="text-sm text-gray-600">URLs in Sitemap: {sitemapStatus?.urlCount || 0}</p>
              </div>
              <button
                onClick={handleGenerateSitemap}
                disabled={loading}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
              >
                Generate Sitemap
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 