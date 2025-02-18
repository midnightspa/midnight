import React from 'react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms and Conditions',
  description: 'Our terms and conditions of service',
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-white py-16">
      <div className="container mx-auto px-4 max-w-4xl">
        <h1 className="text-4xl font-bold text-neutral-900 mb-8">Terms and Conditions</h1>
        
        <div className="prose prose-neutral max-w-none">
          <p className="text-lg text-neutral-600 mb-8">
            Last updated: {new Date().toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </p>

          <section className="mb-8">
            <h2>Agreement to Terms</h2>
            <p>
              By accessing and using this website, you accept and agree to be bound by the terms and provision of this agreement.
            </p>
          </section>

          <section className="mb-8">
            <h2>Intellectual Property Rights</h2>
            <p>
              The content on this website, including but not limited to text, graphics, images, and software, is the property of Midnight Spa and is protected by copyright and other intellectual property laws.
            </p>
          </section>

          <section className="mb-8">
            <h2>User Content</h2>
            <p>
              By posting content on our website, you grant us a non-exclusive, worldwide, royalty-free license to use, modify, publicly perform, publicly display, reproduce, and distribute such content.
            </p>
          </section>

          <section className="mb-8">
            <h2>Prohibited Activities</h2>
            <p>You agree not to:</p>
            <ul>
              <li>Use the website for any unlawful purpose</li>
              <li>Attempt to gain unauthorized access to any portion of the website</li>
              <li>Interfere with the proper working of the website</li>
              <li>Engage in automated use of the system</li>
              <li>Introduce any viruses, trojans, or other harmful material</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2>Disclaimer</h2>
            <p>
              The website is provided on an AS-IS and AS-AVAILABLE basis. We make no warranties, expressed or implied, and hereby disclaim and negate all other warranties, including without limitation, implied warranties or conditions of merchantability.
            </p>
          </section>

          <section className="mb-8">
            <h2>Limitation of Liability</h2>
            <p>
              In no event shall Midnight Spa be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses.
            </p>
          </section>

          <section className="mb-8">
            <h2>Changes to Terms</h2>
            <p>
              We reserve the right to modify these terms at any time. We will notify users of any material changes by posting the new Terms and Conditions on this page.
            </p>
          </section>

          <section className="mb-8">
            <h2>Contact Information</h2>
            <p>
              If you have any questions about these Terms and Conditions, please contact us at:
              <br />
              Email: legal@themidnightspa.com
            </p>
          </section>
        </div>
      </div>
    </div>
  );
} 