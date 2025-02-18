'use client';

import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';

interface MetaTagIssue {
  url: string;
  type: string;
  message: string;
}

export default function MetaTagsAnalyzer() {
  const [loading, setLoading] = useState(false);
  const [issues, setIssues] = useState<MetaTagIssue[]>([]);

  useEffect(() => {
    analyzeTags();
  }, []);

  const analyzeTags = async () => {
    try {
      setLoading(true);
      
      // Fetch all content
      const [posts, products, videos] = await Promise.all([
        fetch('/api/posts').then(res => res.json()),
        fetch('/api/products').then(res => res.json()),
        fetch('/api/videos').then(res => res.json())
      ]);

      const newIssues: MetaTagIssue[] = [];

      // Analyze posts
      posts.forEach((post: any) => {
        if (!post.seoTitle) {
          newIssues.push({
            url: `/posts/${post.slug}`,
            type: 'Missing SEO Title',
            message: `Post "${post.title}" is missing SEO title`
          });
        }
        if (!post.seoDescription) {
          newIssues.push({
            url: `/posts/${post.slug}`,
            type: 'Missing Meta Description',
            message: `Post "${post.title}" is missing meta description`
          });
        }
      });

      // Analyze products
      products.forEach((product: any) => {
        if (!product.seoTitle) {
          newIssues.push({
            url: `/products/${product.slug}`,
            type: 'Missing SEO Title',
            message: `Product "${product.title}" is missing SEO title`
          });
        }
        if (!product.seoDescription) {
          newIssues.push({
            url: `/products/${product.slug}`,
            type: 'Missing Meta Description',
            message: `Product "${product.title}" is missing meta description`
          });
        }
      });

      // Analyze videos
      videos.forEach((video: any) => {
        if (!video.seoTitle) {
          newIssues.push({
            url: `/videos/${video.slug}`,
            type: 'Missing SEO Title',
            message: `Video "${video.title}" is missing SEO title`
          });
        }
        if (!video.seoDescription) {
          newIssues.push({
            url: `/videos/${video.slug}`,
            type: 'Missing Meta Description',
            message: `Video "${video.title}" is missing meta description`
          });
        }
      });

      setIssues(newIssues);
    } catch (error) {
      console.error('Error analyzing meta tags:', error);
      toast.error('Failed to analyze meta tags');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500">
            Found {issues.length} issues
          </p>
        </div>
        <button
          onClick={analyzeTags}
          disabled={loading}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? 'Analyzing...' : 'Analyze Meta Tags'}
        </button>
      </div>

      {issues.length > 0 ? (
        <div className="mt-4 space-y-2">
          {issues.map((issue, index) => (
            <div
              key={index}
              className="p-3 bg-yellow-50 border border-yellow-200 rounded-md"
            >
              <div className="flex items-start">
                <div className="flex-1">
                  <p className="text-sm font-medium text-yellow-800">
                    {issue.type}
                  </p>
                  <p className="mt-1 text-sm text-yellow-700">
                    {issue.message}
                  </p>
                  <p className="mt-1 text-xs text-yellow-600">
                    URL: {issue.url}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-4">
          <p className="text-sm text-gray-500">No meta tag issues found</p>
        </div>
      )}
    </div>
  );
} 