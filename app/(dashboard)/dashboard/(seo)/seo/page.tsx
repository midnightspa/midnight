'use client';

import React, { useState, useEffect } from 'react';
import { FiRefreshCw, FiDownload, FiCheck, FiAlertTriangle } from 'react-icons/fi';

interface SEOMetrics {
  totalPages: number;
  indexedPages: number;
  missingMetaTags: {
    title: number;
    description: number;
    ogImage: number;
  };
  performance: {
    mobile: number;
    desktop: number;
  };
}

export default function SEODashboard() {
  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [metrics, setMetrics] = useState<SEOMetrics>({
    totalPages: 0,
    indexedPages: 0,
    missingMetaTags: {
      title: 0,
      description: 0,
      ogImage: 0,
    },
    performance: {
      mobile: 0,
      desktop: 0,
    },
  });

  useEffect(() => {
    const fetchMetrics = async () => {
      setLoading(true);
      try {
        const response = await fetch('/api/seo/metrics');
        if (!response.ok) throw new Error('Failed to fetch metrics');
        const data = await response.json();
        setMetrics(data);
      } catch (error) {
        console.error('Error fetching SEO metrics:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMetrics();
  }, []);

  const generateSitemap = async () => {
    setGenerating(true);
    try {
      const response = await fetch('/api/sitemap/generate', {
        method: 'POST',
      });
      if (!response.ok) throw new Error('Failed to generate sitemap');
      // Show success message
      alert('Sitemap generated successfully!');
    } catch (error) {
      console.error('Error generating sitemap:', error);
      alert('Failed to generate sitemap');
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">SEO Dashboard</h1>
        <button
          onClick={() => window.location.reload()}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900"
        >
          <FiRefreshCw className="w-4 h-4" />
          Refresh
        </button>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-sm font-medium text-gray-500">Total Pages</h3>
          <p className="mt-2 text-3xl font-semibold">{metrics.totalPages}</p>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-sm font-medium text-gray-500">Indexed Pages</h3>
          <p className="mt-2 text-3xl font-semibold">{metrics.indexedPages}</p>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-sm font-medium text-gray-500">Mobile Score</h3>
          <p className="mt-2 text-3xl font-semibold">{metrics.performance.mobile}%</p>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-sm font-medium text-gray-500">Desktop Score</h3>
          <p className="mt-2 text-3xl font-semibold">{metrics.performance.desktop}%</p>
        </div>
      </div>

      {/* Meta Tags Section */}
      <div className="bg-white rounded-lg shadow-sm">
        <div className="p-6">
          <h2 className="text-lg font-semibold mb-4">Meta Tags Analysis</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className={`w-2 h-2 rounded-full ${metrics.missingMetaTags.title === 0 ? 'bg-green-500' : 'bg-red-500'}`} />
                <span className="font-medium">Meta Titles</span>
              </div>
              <span className="text-sm text-gray-500">
                {metrics.missingMetaTags.title} pages missing
              </span>
            </div>
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className={`w-2 h-2 rounded-full ${metrics.missingMetaTags.description === 0 ? 'bg-green-500' : 'bg-red-500'}`} />
                <span className="font-medium">Meta Descriptions</span>
              </div>
              <span className="text-sm text-gray-500">
                {metrics.missingMetaTags.description} pages missing
              </span>
            </div>
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className={`w-2 h-2 rounded-full ${metrics.missingMetaTags.ogImage === 0 ? 'bg-green-500' : 'bg-red-500'}`} />
                <span className="font-medium">OG Images</span>
              </div>
              <span className="text-sm text-gray-500">
                {metrics.missingMetaTags.ogImage} pages missing
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Sitemap Section */}
      <div className="bg-white rounded-lg shadow-sm">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-semibold">Sitemap Management</h2>
            <div className="flex gap-3">
              <button
                onClick={generateSitemap}
                disabled={generating}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                {generating ? (
                  <>
                    <FiRefreshCw className="w-4 h-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <FiRefreshCw className="w-4 h-4" />
                    Generate Sitemap
                  </>
                )}
              </button>
              <a
                href="/sitemap.xml"
                target="_blank"
                className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                <FiDownload className="w-4 h-4" />
                Download Sitemap
              </a>
            </div>
          </div>

          <div className="space-y-4">
            <div className="p-4 bg-blue-50 text-blue-700 rounded-lg">
              <h3 className="font-medium mb-2">Sitemap Information</h3>
              <ul className="list-disc list-inside space-y-1 text-sm">
                <li>Last generated: <span className="font-medium">Not available</span></li>
                <li>Total URLs: <span className="font-medium">{metrics.totalPages}</span></li>
                <li>Location: <code className="bg-blue-100 px-2 py-1 rounded">public/sitemap.xml</code></li>
              </ul>
            </div>

            <div className="p-4 bg-yellow-50 text-yellow-700 rounded-lg">
              <h3 className="font-medium mb-2">Recommendations</h3>
              <ul className="list-disc list-inside space-y-1 text-sm">
                <li>Submit your sitemap to Google Search Console</li>
                <li>Keep your sitemap up to date by regenerating after content changes</li>
                <li>Ensure all important pages are included in the sitemap</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* SEO Checklist */}
      <div className="bg-white rounded-lg shadow-sm">
        <div className="p-6">
          <h2 className="text-lg font-semibold mb-4">SEO Checklist</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <FiCheck className="w-5 h-5 text-green-500" />
                <span className="font-medium">SSL Certificate</span>
              </div>
              <span className="text-sm text-green-500">Active</span>
            </div>
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <FiCheck className="w-5 h-5 text-green-500" />
                <span className="font-medium">Mobile Responsiveness</span>
              </div>
              <span className="text-sm text-green-500">Optimized</span>
            </div>
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <FiAlertTriangle className="w-5 h-5 text-yellow-500" />
                <span className="font-medium">Image Alt Tags</span>
              </div>
              <span className="text-sm text-yellow-500">Partial</span>
            </div>
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <FiCheck className="w-5 h-5 text-green-500" />
                <span className="font-medium">Robots.txt</span>
              </div>
              <span className="text-sm text-green-500">Configured</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

