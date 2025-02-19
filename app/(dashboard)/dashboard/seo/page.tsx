import { Metadata } from 'next';
import MetaTagsAnalyzer from './components/MetaTagsAnalyzer';
import SitemapManager from './components/SitemapManager';
import SeoStats from './components/SeoStats';
import IndexingManager from './components/IndexingManager';
import StaticPagesSeo from './components/StaticPagesSeo';

export const metadata: Metadata = {
  title: 'SEO Dashboard - Midnight Spa',
  description: 'Manage your website\'s SEO settings and monitor performance',
};

export default function SEODashboard() {
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
    </div>
  );
} 