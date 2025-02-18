import { Suspense } from 'react';
import IndexingManager from './components/IndexingManager';
import SeoStats from './components/SeoStats';
import SitemapManager from './components/SitemapManager';
import MetaTagsAnalyzer from './components/MetaTagsAnalyzer';

export default function SEODashboard() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">SEO Management</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Suspense fallback={<div>Loading stats...</div>}>
          <SeoStats />
        </Suspense>
      </div>

      <div className="grid gap-6">
        <div className="bg-white rounded-lg shadow">
          <div className="p-6">
            <h2 className="text-xl font-semibold mb-4">Sitemap Management</h2>
            <Suspense fallback={<div>Loading sitemap manager...</div>}>
              <SitemapManager />
            </Suspense>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow">
          <div className="p-6">
            <h2 className="text-xl font-semibold mb-4">Google Search Console Integration</h2>
            <Suspense fallback={<div>Loading indexing manager...</div>}>
              <IndexingManager />
            </Suspense>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow">
          <div className="p-6">
            <h2 className="text-xl font-semibold mb-4">Meta Tags Analysis</h2>
            <Suspense fallback={<div>Loading meta tags analyzer...</div>}>
              <MetaTagsAnalyzer />
            </Suspense>
          </div>
        </div>
      </div>
    </div>
  );
} 