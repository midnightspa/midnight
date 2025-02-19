import { generateMetadata as generateSiteMetadata } from '@/lib/seo';
import { SEODashboard } from './components/SEODashboard';

export async function generateMetadata() {
  return generateSiteMetadata(
    'SEO Dashboard - Midnight Spa',
    'Manage your website\'s SEO settings and monitor performance'
  );
}

export default function Page() {
  return <SEODashboard />;
} 