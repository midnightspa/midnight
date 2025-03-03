'use client';

import React, { Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Poppins } from 'next/font/google';
import { FiCheck } from 'react-icons/fi';
import { useCart } from '@/app/contexts/CartContext';

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
});

// Component that uses useSearchParams wrapped in Suspense
function SuccessContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { clearCart } = useCart();
  const paymentIntent = searchParams.get('payment_intent');

  React.useEffect(() => {
    if (!paymentIntent) {
      router.push('/shop');
      return;
    }

    // Clear the cart after successful payment
    clearCart();

    // After 5 seconds, redirect to the customer dashboard
    const timeout = setTimeout(() => {
      router.push('/dashboard');
    }, 5000);

    return () => clearTimeout(timeout);
  }, [paymentIntent, router, clearCart]);

  if (!paymentIntent) return null;

  return (
    <div className={`min-h-screen bg-neutral-50 ${poppins.className}`}>
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto text-center">
          <div className="bg-white rounded-xl shadow-sm p-8">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <FiCheck className="w-8 h-8 text-green-600" />
            </div>
            <h1 className="text-2xl font-bold text-neutral-900 mb-4">
              Thank you for your purchase!
            </h1>
            <p className="text-neutral-600 mb-6">
              Your order has been confirmed and will be processed shortly.
              We've sent you an email with your order details.
            </p>
            <div className="text-sm text-neutral-500 mb-8">
              Order ID: {paymentIntent}
            </div>
            <div className="space-y-4">
              <Link
                href="/dashboard"
                className="inline-block w-full bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
              >
                Go to Dashboard
              </Link>
              <Link
                href="/shop"
                className="inline-block w-full bg-neutral-900 text-white px-6 py-3 rounded-lg font-medium hover:bg-neutral-800 transition-colors"
              >
                Continue Shopping
              </Link>
            </div>
            <p className="text-sm text-neutral-500 mt-6">
              You will be redirected to your dashboard in 5 seconds...
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// Main component with Suspense boundary
export default function SuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-neutral-900"></div>
      </div>
    }>
      <SuccessContent />
    </Suspense>
  );
} 