'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Loader2, Save } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface PageSeoSettings {
  path: string;
  title: string;
  description: string;
  keywords: string;
  ogTitle: string;
  ogDescription: string;
  ogImage: string;
  twitterTitle: string;
  twitterDescription: string;
  twitterImage: string;
}

const STATIC_PAGES = [
  { path: '/', label: 'Home' },
  { path: '/about', label: 'About' },
  { path: '/services', label: 'Services' },
  { path: '/contact', label: 'Contact' },
  { path: '/blog', label: 'Blog' },
  { path: '/categories', label: 'Categories' },
  { path: '/videos', label: 'Videos' },
];

export default function StaticPagesSeo() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [selectedPage, setSelectedPage] = useState(STATIC_PAGES[0].path);
  const [settings, setSettings] = useState<PageSeoSettings[]>([]);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch('/api/seo/static-pages');
      if (!response.ok) {
        throw new Error('Failed to load SEO settings');
      }
      const data = await response.json();
      setSettings(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load settings');
    } finally {
      setLoading(false);
    }
  };

  const saveSettings = async () => {
    try {
      setLoading(true);
      setError(null);
      setSuccess(null);

      const currentSettings = settings.find(s => s.path === selectedPage);
      if (!currentSettings) return;

      const response = await fetch('/api/seo/static-pages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(currentSettings),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to save settings');
      }

      setSuccess('Settings saved successfully');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save settings');
    } finally {
      setLoading(false);
    }
  };

  const updateSettings = (path: string, field: keyof PageSeoSettings, value: string) => {
    setSettings(prev => prev.map(setting => {
      if (setting.path === path) {
        return { ...setting, [field]: value };
      }
      return setting;
    }));
  };

  const currentSettings = settings.find(s => s.path === selectedPage) || {
    path: selectedPage,
    title: '',
    description: '',
    keywords: '',
    ogTitle: '',
    ogDescription: '',
    ogImage: '',
    twitterTitle: '',
    twitterDescription: '',
    twitterImage: '',
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Static Pages SEO</CardTitle>
        <CardDescription>Manage SEO settings for static pages</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <TabsList>
              {STATIC_PAGES.map(page => (
                <TabsTrigger
                  key={page.path}
                  value={page.path}
                  onClick={() => setSelectedPage(page.path)}
                >
                  {page.label}
                </TabsTrigger>
              ))}
            </TabsList>
            <Button onClick={saveSettings} disabled={loading}>
              {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
              Save Changes
            </Button>
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {success && (
            <Alert>
              <AlertTitle>Success</AlertTitle>
              <AlertDescription>{success}</AlertDescription>
            </Alert>
          )}

          <Tabs value={selectedPage} className="space-y-4">
            {STATIC_PAGES.map(page => (
              <TabsContent key={page.path} value={page.path}>
                <div className="grid gap-4">
                  <div className="grid gap-2">
                    <label className="text-sm font-medium">Meta Title</label>
                    <Input
                      value={currentSettings.title}
                      onChange={e => updateSettings(page.path, 'title', e.target.value)}
                      placeholder="Enter meta title"
                    />
                  </div>

                  <div className="grid gap-2">
                    <label className="text-sm font-medium">Meta Description</label>
                    <Textarea
                      value={currentSettings.description}
                      onChange={e => updateSettings(page.path, 'description', e.target.value)}
                      placeholder="Enter meta description"
                    />
                  </div>

                  <div className="grid gap-2">
                    <label className="text-sm font-medium">Keywords</label>
                    <Input
                      value={currentSettings.keywords}
                      onChange={e => updateSettings(page.path, 'keywords', e.target.value)}
                      placeholder="Enter keywords (comma-separated)"
                    />
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <Card>
                      <CardHeader>
                        <CardTitle>Open Graph</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="grid gap-2">
                          <label className="text-sm font-medium">OG Title</label>
                          <Input
                            value={currentSettings.ogTitle}
                            onChange={e => updateSettings(page.path, 'ogTitle', e.target.value)}
                            placeholder="Enter Open Graph title"
                          />
                        </div>
                        <div className="grid gap-2">
                          <label className="text-sm font-medium">OG Description</label>
                          <Textarea
                            value={currentSettings.ogDescription}
                            onChange={e => updateSettings(page.path, 'ogDescription', e.target.value)}
                            placeholder="Enter Open Graph description"
                          />
                        </div>
                        <div className="grid gap-2">
                          <label className="text-sm font-medium">OG Image URL</label>
                          <Input
                            value={currentSettings.ogImage}
                            onChange={e => updateSettings(page.path, 'ogImage', e.target.value)}
                            placeholder="Enter Open Graph image URL"
                          />
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle>Twitter Card</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="grid gap-2">
                          <label className="text-sm font-medium">Twitter Title</label>
                          <Input
                            value={currentSettings.twitterTitle}
                            onChange={e => updateSettings(page.path, 'twitterTitle', e.target.value)}
                            placeholder="Enter Twitter title"
                          />
                        </div>
                        <div className="grid gap-2">
                          <label className="text-sm font-medium">Twitter Description</label>
                          <Textarea
                            value={currentSettings.twitterDescription}
                            onChange={e => updateSettings(page.path, 'twitterDescription', e.target.value)}
                            placeholder="Enter Twitter description"
                          />
                        </div>
                        <div className="grid gap-2">
                          <label className="text-sm font-medium">Twitter Image URL</label>
                          <Input
                            value={currentSettings.twitterImage}
                            onChange={e => updateSettings(page.path, 'twitterImage', e.target.value)}
                            placeholder="Enter Twitter image URL"
                          />
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </CardContent>
    </Card>
  );
} 