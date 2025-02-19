'use client';

import { useState, ChangeEvent } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Loader2 } from 'lucide-react';

interface MetaTagsResult {
  title: string;
  description: string;
  keywords: string;
  ogTitle: string;
  ogDescription: string;
  ogImage: string;
  twitterCard: string;
  twitterTitle: string;
  twitterDescription: string;
  twitterImage: string;
  canonical: string;
}

export default function MetaTagsAnalyzer() {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<MetaTagsResult | null>(null);

  const handleUrlChange = (e: ChangeEvent<HTMLInputElement>) => {
    setUrl(e.target.value);
    setError(null);
  };

  const validateUrl = (url: string): boolean => {
    try {
      const parsedUrl = new URL(url);
      return parsedUrl.hostname === 'themidnightspa.com';
    } catch {
      return false;
    }
  };

  const analyzeMetaTags = async () => {
    try {
      if (!validateUrl(url)) {
        setError('Please enter a valid URL from themidnightspa.com domain');
        return;
      }

      setLoading(true);
      setError(null);
      setResult(null);

      const response = await fetch('/api/seo/analyze-meta', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || data.details || 'Failed to analyze meta tags');
      }

      setResult(data);
    } catch (err) {
      console.error('Error analyzing meta tags:', err);
      setError(err instanceof Error ? err.message : 'An error occurred while analyzing meta tags');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Meta Tags Analyzer</CardTitle>
        <CardDescription>Analyze meta tags of any page on your website</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex gap-4">
            <Input
              placeholder="Enter URL (e.g., https://themidnightspa.com/categories)"
              value={url}
              onChange={handleUrlChange}
              disabled={loading}
            />
            <Button onClick={analyzeMetaTags} disabled={loading || !url}>
              {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              Analyze
            </Button>
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {result && (
            <div className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Basic Meta Tags</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <dl className="space-y-2">
                      <div>
                        <dt className="font-medium">Title</dt>
                        <dd className="text-sm text-muted-foreground">{result.title}</dd>
                      </div>
                      <div>
                        <dt className="font-medium">Description</dt>
                        <dd className="text-sm text-muted-foreground">{result.description}</dd>
                      </div>
                      <div>
                        <dt className="font-medium">Keywords</dt>
                        <dd className="text-sm text-muted-foreground">{result.keywords}</dd>
                      </div>
                      <div>
                        <dt className="font-medium">Canonical URL</dt>
                        <dd className="text-sm text-muted-foreground">{result.canonical}</dd>
                      </div>
                    </dl>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Open Graph Tags</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <dl className="space-y-2">
                      <div>
                        <dt className="font-medium">OG Title</dt>
                        <dd className="text-sm text-muted-foreground">{result.ogTitle}</dd>
                      </div>
                      <div>
                        <dt className="font-medium">OG Description</dt>
                        <dd className="text-sm text-muted-foreground">{result.ogDescription}</dd>
                      </div>
                      <div>
                        <dt className="font-medium">OG Image</dt>
                        <dd className="text-sm text-muted-foreground">{result.ogImage}</dd>
                      </div>
                    </dl>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Twitter Card Tags</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <dl className="space-y-2">
                      <div>
                        <dt className="font-medium">Card Type</dt>
                        <dd className="text-sm text-muted-foreground">{result.twitterCard}</dd>
                      </div>
                      <div>
                        <dt className="font-medium">Title</dt>
                        <dd className="text-sm text-muted-foreground">{result.twitterTitle}</dd>
                      </div>
                      <div>
                        <dt className="font-medium">Description</dt>
                        <dd className="text-sm text-muted-foreground">{result.twitterDescription}</dd>
                      </div>
                      <div>
                        <dt className="font-medium">Image</dt>
                        <dd className="text-sm text-muted-foreground">{result.twitterImage}</dd>
                      </div>
                    </dl>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
} 