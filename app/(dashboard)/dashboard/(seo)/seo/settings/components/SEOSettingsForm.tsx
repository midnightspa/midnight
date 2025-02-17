'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

interface SiteSettings {
  id?: string;
  // Basic SEO
  siteName: string;
  siteTitle: string;
  siteDescription: string;
  siteKeywords: string;
  // Social Media
  ogTitle: string;
  ogDescription: string;
  ogImage: string;
  twitterHandle: string;
  twitterCardType: string;
  // Organization
  organizationName: string;
  organizationLogo: string;
  // Contact
  contactEmail: string;
  contactPhone: string;
  contactAddress: string;
  // Analytics
  googleAnalyticsId: string;
  googleSiteVerification: string;
  // Additional
  robotsTxt: string;
  sitemapXml: string;
  favicon: string;
}

interface SEOSettingsFormProps {
  initialData?: SiteSettings | null;
}

export default function SEOSettingsForm({ initialData }: SEOSettingsFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<SiteSettings>(initialData || {
    siteName: '',
    siteTitle: '',
    siteDescription: '',
    siteKeywords: '',
    ogTitle: '',
    ogDescription: '',
    ogImage: '',
    twitterHandle: '',
    twitterCardType: 'summary_large_image',
    organizationName: '',
    organizationLogo: '',
    contactEmail: '',
    contactPhone: '',
    contactAddress: '',
    googleAnalyticsId: '',
    googleSiteVerification: '',
    robotsTxt: '',
    sitemapXml: '',
    favicon: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch('/api/seo/settings', {
        method: initialData ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error('Failed to save settings');

      router.refresh();
      alert('Settings saved successfully');
    } catch (error) {
      console.error('Error saving settings:', error);
      alert('Failed to save settings');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 p-6">
      {/* Basic SEO Settings */}
      <div className="space-y-6">
        <h2 className="text-lg font-medium text-gray-900 border-b pb-2">Basic SEO Settings</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="siteName" className="block text-sm font-medium text-gray-700">Site Name</label>
            <input
              type="text"
              id="siteName"
              name="siteName"
              value={formData.siteName}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
          <div>
            <label htmlFor="siteTitle" className="block text-sm font-medium text-gray-700">Default Meta Title</label>
            <input
              type="text"
              id="siteTitle"
              name="siteTitle"
              value={formData.siteTitle}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
          <div className="md:col-span-2">
            <label htmlFor="siteDescription" className="block text-sm font-medium text-gray-700">Default Meta Description</label>
            <textarea
              id="siteDescription"
              name="siteDescription"
              value={formData.siteDescription}
              onChange={handleChange}
              rows={3}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
          <div className="md:col-span-2">
            <label htmlFor="siteKeywords" className="block text-sm font-medium text-gray-700">Default Meta Keywords</label>
            <input
              type="text"
              id="siteKeywords"
              name="siteKeywords"
              value={formData.siteKeywords}
              onChange={handleChange}
              placeholder="keyword1, keyword2, keyword3"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      {/* Social Media Settings */}
      <div className="space-y-6">
        <h2 className="text-lg font-medium text-gray-900 border-b pb-2">Social Media Settings</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="ogTitle" className="block text-sm font-medium text-gray-700">Default OG Title</label>
            <input
              type="text"
              id="ogTitle"
              name="ogTitle"
              value={formData.ogTitle}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
          <div>
            <label htmlFor="ogImage" className="block text-sm font-medium text-gray-700">Default OG Image URL</label>
            <input
              type="text"
              id="ogImage"
              name="ogImage"
              value={formData.ogImage}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
          <div className="md:col-span-2">
            <label htmlFor="ogDescription" className="block text-sm font-medium text-gray-700">Default OG Description</label>
            <textarea
              id="ogDescription"
              name="ogDescription"
              value={formData.ogDescription}
              onChange={handleChange}
              rows={3}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
          <div>
            <label htmlFor="twitterHandle" className="block text-sm font-medium text-gray-700">Twitter Handle</label>
            <input
              type="text"
              id="twitterHandle"
              name="twitterHandle"
              value={formData.twitterHandle}
              onChange={handleChange}
              placeholder="@username"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
          <div>
            <label htmlFor="twitterCardType" className="block text-sm font-medium text-gray-700">Twitter Card Type</label>
            <select
              id="twitterCardType"
              name="twitterCardType"
              value={formData.twitterCardType}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="summary">Summary</option>
              <option value="summary_large_image">Summary Large Image</option>
              <option value="app">App</option>
              <option value="player">Player</option>
            </select>
          </div>
        </div>
      </div>

      {/* Organization Information */}
      <div className="space-y-6">
        <h2 className="text-lg font-medium text-gray-900 border-b pb-2">Organization Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="organizationName" className="block text-sm font-medium text-gray-700">Organization Name</label>
            <input
              type="text"
              id="organizationName"
              name="organizationName"
              value={formData.organizationName}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
          <div>
            <label htmlFor="organizationLogo" className="block text-sm font-medium text-gray-700">Organization Logo URL</label>
            <input
              type="text"
              id="organizationLogo"
              name="organizationLogo"
              value={formData.organizationLogo}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      {/* Contact Information */}
      <div className="space-y-6">
        <h2 className="text-lg font-medium text-gray-900 border-b pb-2">Contact Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="contactEmail" className="block text-sm font-medium text-gray-700">Contact Email</label>
            <input
              type="email"
              id="contactEmail"
              name="contactEmail"
              value={formData.contactEmail}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
          <div>
            <label htmlFor="contactPhone" className="block text-sm font-medium text-gray-700">Contact Phone</label>
            <input
              type="tel"
              id="contactPhone"
              name="contactPhone"
              value={formData.contactPhone}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
          <div className="md:col-span-2">
            <label htmlFor="contactAddress" className="block text-sm font-medium text-gray-700">Contact Address</label>
            <textarea
              id="contactAddress"
              name="contactAddress"
              value={formData.contactAddress}
              onChange={handleChange}
              rows={3}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      {/* Analytics and Verification */}
      <div className="space-y-6">
        <h2 className="text-lg font-medium text-gray-900 border-b pb-2">Analytics and Verification</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="googleAnalyticsId" className="block text-sm font-medium text-gray-700">Google Analytics ID</label>
            <input
              type="text"
              id="googleAnalyticsId"
              name="googleAnalyticsId"
              value={formData.googleAnalyticsId}
              onChange={handleChange}
              placeholder="G-XXXXXXXXXX"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
          <div>
            <label htmlFor="googleSiteVerification" className="block text-sm font-medium text-gray-700">Google Site Verification</label>
            <input
              type="text"
              id="googleSiteVerification"
              name="googleSiteVerification"
              value={formData.googleSiteVerification}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      {/* Additional Settings */}
      <div className="space-y-6">
        <h2 className="text-lg font-medium text-gray-900 border-b pb-2">Additional Settings</h2>
        <div className="grid grid-cols-1 gap-6">
          <div>
            <label htmlFor="favicon" className="block text-sm font-medium text-gray-700">Favicon URL</label>
            <input
              type="text"
              id="favicon"
              name="favicon"
              value={formData.favicon}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
          <div>
            <label htmlFor="robotsTxt" className="block text-sm font-medium text-gray-700">Robots.txt Content</label>
            <textarea
              id="robotsTxt"
              name="robotsTxt"
              value={formData.robotsTxt}
              onChange={handleChange}
              rows={4}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 font-mono text-sm"
            />
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={isLoading}
          className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
        >
          {isLoading ? 'Saving...' : 'Save Settings'}
        </button>
      </div>
    </form>
  );
} 