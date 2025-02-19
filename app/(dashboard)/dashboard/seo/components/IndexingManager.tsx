'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Loader2, CheckCircle, XCircle, RefreshCw } from 'lucide-react';

interface IndexingStatus {
  url: string;
  status: 'PENDING' | 'INDEXED' | 'NOT_INDEXED' | 'ERROR';
  lastChecked?: Date;
  details?: any;
}

export default function IndexingManager() {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [indexingStatus, setIndexingStatus] = useState<IndexingStatus | null>(null);

  const submitForIndexing = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch('/api/seo/index-url', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ urls: [url] }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to submit URL for indexing');
      }

      await checkIndexingStatus();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const checkIndexingStatus = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch('/api/seo/check-indexing', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to check indexing status');
      }

      const data = await response.json();
      
      setIndexingStatus({
        url,
        status: data.data?.indexStatusResult?.verdict === 'PASS' ? 'INDEXED' : 'NOT_INDEXED',
        lastChecked: new Date(),
        details: data.data
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setIndexingStatus({
        url,
        status: 'ERROR',
        lastChecked: new Date(),
        details: err
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>URL Indexing Manager</CardTitle>
        <CardDescription>Submit URLs to Google for indexing and monitor their status</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex gap-4">
            <Input
              placeholder="Enter URL (e.g., https://themidnightspa.com/categories)"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              disabled={loading}
            />
            <Button onClick={submitForIndexing} disabled={loading || !url}>
              {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              Submit for Indexing
            </Button>
            {indexingStatus && (
              <Button variant="outline" onClick={checkIndexingStatus} disabled={loading}>
                <RefreshCw className="mr-2 h-4 w-4" />
                Check Status
              </Button>
            )}
          </div>

          {error && (
            <Alert variant="destructive">
              <XCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {indexingStatus && (
            <Alert variant={indexingStatus.status === 'INDEXED' ? 'default' : 'warning'}>
              {indexingStatus.status === 'INDEXED' ? (
                <CheckCircle className="h-4 w-4" />
              ) : (
                <XCircle className="h-4 w-4" />
              )}
              <AlertTitle>Indexing Status</AlertTitle>
              <AlertDescription>
                <div className="space-y-2">
                  <p>URL: {indexingStatus.url}</p>
                  <p>Status: {indexingStatus.status}</p>
                  {indexingStatus.lastChecked && (
                    <p>Last Checked: {indexingStatus.lastChecked.toLocaleString()}</p>
                  )}
                  {indexingStatus.details?.indexStatusResult?.verdict === 'FAIL' && (
                    <p>Reason: {indexingStatus.details.indexStatusResult.message}</p>
                  )}
                </div>
              </AlertDescription>
            </Alert>
          )}
        </div>
      </CardContent>
    </Card>
  );
} 