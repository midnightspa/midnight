import React from 'react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'Our privacy policy and data protection practices',
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-white py-16">
      <div className="container mx-auto px-4 max-w-4xl">
        <h1 className="text-4xl font-bold text-neutral-900 mb-8">Privacy Policy</h1>
        
        <div className="prose prose-neutral max-w-none">
          <p className="text-lg text-neutral-600 mb-8">
            Last updated: {new Date().toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </p>

          <section className="mb-8">
            <h2>Introduction</h2>
            <p>
              At Midnight Spa, we take your privacy seriously. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website.
            </p>
          </section>

          <section className="mb-8">
            <h2>Information We Collect</h2>
            <p>We collect information that you provide directly to us when you:</p>
            <ul>
              <li>Create an account</li>
              <li>Make a purchase</li>
              <li>Subscribe to our newsletter</li>
              <li>Contact us</li>
              <li>Participate in surveys or promotions</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2>How We Use Your Information</h2>
            <p>We use the information we collect to:</p>
            <ul>
              <li>Process your orders and payments</li>
              <li>Send you marketing communications (with your consent)</li>
              <li>Improve our website and services</li>
              <li>Respond to your inquiries</li>
              <li>Comply with legal obligations</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2>Information Sharing</h2>
            <p>
              We do not sell, trade, or otherwise transfer your personal information to third parties without your consent, except as described in this Privacy Policy.
            </p>
          </section>

          <section className="mb-8">
            <h2>Security</h2>
            <p>
              We implement appropriate technical and organizational measures to maintain the security of your personal information.
            </p>
          </section>

          <section className="mb-8">
            <h2>Your Rights</h2>
            <p>You have the right to:</p>
            <ul>
              <li>Access your personal information</li>
              <li>Correct inaccurate information</li>
              <li>Request deletion of your information</li>
              <li>Object to processing of your information</li>
              <li>Withdraw consent</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2>Contact Us</h2>
            <p>
              If you have any questions about this Privacy Policy, please contact us at:
              <br />
              Email: privacy@themidnightspa.com
            </p>
          </section>
        </div>
      </div>
    </div>
  );
} 