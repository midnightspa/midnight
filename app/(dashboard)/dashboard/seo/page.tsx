import { Metadata } from 'next';
import { SEODashboard } from './components/SEODashboard';

export const metadata: Metadata = {
  title: 'SEO Dashboard - Midnight Spa',
  description: 'Manage your website\'s SEO settings and monitor performance',
};

export default function Page() {
  return <SEODashboard />;
} 