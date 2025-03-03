'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Poppins } from 'next/font/google';
import { useCart } from '../contexts/CartContext';
import { FiChevronRight, FiCheck, FiCreditCard, FiLock } from 'react-icons/fi';
import { loadStripe } from '@stripe/stripe-js';
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
});

function CheckoutForm({ clientSecret, onSuccess }: { clientSecret: string; onSuccess: () => void }) {
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setProcessing(true);
    const { error: submitError } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/checkout/success`,
      },
    });

    if (submitError) {
      setError(submitError.message || 'An error occurred');
      setProcessing(false);
    } else {
      onSuccess();
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <PaymentElement />
      {error && <div className="text-red-600 mt-4">{error}</div>}
      <button
        type="submit"
        disabled={!stripe || processing}
        className="w-full mt-6 px-6 py-4 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors disabled:bg-neutral-200 disabled:cursor-not-allowed"
      >
        {processing ? 'Processing...' : 'Pay Now'}
      </button>
    </form>
  );
}

export default function CheckoutPage() {
  const { state } = useCart();
  const [formStep, setFormStep] = useState(1);
  const [formData, setFormData] = useState({
    email: '',
    firstName: '',
    lastName: '',
    phoneNumber: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'United States',
  });
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [orderComplete, setOrderComplete] = useState(false);

  // Check if any items are physical products
  const hasPhysicalProducts = state.items.some((item) => {
    console.log(`Item ${item.title} has type: ${item.type}`);
    return String(item.type).toUpperCase() === 'PHYSICAL';
  });
  
  // Debug cart items
  console.log('Cart items:', state.items);
  console.log('Has physical products:', hasPhysicalProducts);
  console.log('Item types:', state.items.map(item => item.type));

  // Determine the total number of steps based on product type
  const totalSteps = hasPhysicalProducts ? 3 : 2;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formStep < totalSteps) {
      // For digital products, skip from step 1 to payment (step 2)
      if (formStep === 1 && !hasPhysicalProducts) {
        setFormStep(2); // Skip to payment step
      } else {
        setFormStep(formStep + 1);
      }
      return;
    }

    try {
      console.log('Submitting checkout form with hasPhysicalProducts:', hasPhysicalProducts);
      
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          formData,
          items: state.items,
          isDigital: !hasPhysicalProducts,
          total: state.items.reduce((sum, item) => sum + item.price * item.quantity, 0),
        }),
      });

      const data = await response.json();
      if (data.error) {
        throw new Error(data.error);
      }

      setClientSecret(data.clientSecret);
    } catch (error) {
      console.error('Checkout error:', error);
    }
  };

  if (state.items.length === 0 && !orderComplete) {
    return (
      <div className={`min-h-screen bg-neutral-50 ${poppins.className}`}>
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-2xl mx-auto text-center bg-white rounded-xl shadow-sm p-8">
            <h1 className="text-2xl font-bold text-neutral-900 mb-4">Your cart is empty</h1>
            <p className="text-neutral-600 mb-6">
              You need to add items to your cart before proceeding to checkout.
            </p>
            <Link
              href="/shop"
              className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              Browse Products
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (orderComplete) {
    return (
      <div className={`min-h-screen bg-neutral-50 ${poppins.className}`}>
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-2xl mx-auto text-center bg-white rounded-xl shadow-sm p-8">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <FiCheck className="w-8 h-8 text-green-600" />
            </div>
            <h1 className="text-2xl font-bold text-neutral-900 mb-4">Order Confirmed!</h1>
            <p className="text-neutral-600 mb-6">
              Thank you for your purchase. We've sent a confirmation email to {formData.email}.
            </p>
            <p className="text-sm text-neutral-500 mb-8">
              Order #: {Math.floor(Math.random() * 1000000).toString().padStart(6, '0')}
            </p>
            <Link
              href="/shop"
              className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-neutral-50 ${poppins.className}`}>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold text-neutral-900 mb-8">Checkout</h1>

          {/* Progress Steps */}
          <div className="mb-8">
            <div className="flex items-center justify-between max-w-3xl mx-auto">
              {/* Step 1: Information */}
              <div className="flex flex-col items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  formStep >= 1 ? 'bg-blue-600 text-white' : 'bg-neutral-200 text-neutral-500'
                }`}>
                  {formStep > 1 ? <FiCheck className="w-5 h-5" /> : 1}
                </div>
                <span className="mt-2 text-sm font-medium text-neutral-700">Information</span>
              </div>
              
              {/* Line between Information and next step */}
              <div className="flex-1 h-1 mx-4 bg-neutral-200">
                <div className={`h-full ${formStep >= 2 ? 'bg-blue-600' : 'bg-neutral-200'}`} style={{ width: formStep > 1 ? '100%' : '0%' }}></div>
              </div>
              
              {/* Step 2: Shipping (only for physical products) */}
              {hasPhysicalProducts ? (
                <>
                  <div className="flex flex-col items-center">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      formStep >= 2 ? 'bg-blue-600 text-white' : 'bg-neutral-200 text-neutral-500'
                    }`}>
                      {formStep > 2 ? <FiCheck className="w-5 h-5" /> : 2}
                    </div>
                    <span className="mt-2 text-sm font-medium text-neutral-700">Shipping</span>
                  </div>
                  <div className="flex-1 h-1 mx-4 bg-neutral-200">
                    <div className={`h-full ${formStep >= 3 ? 'bg-blue-600' : 'bg-neutral-200'}`} style={{ width: formStep > 2 ? '100%' : '0%' }}></div>
                  </div>
                </>
              ) : null}
              
              {/* Step 3/2: Payment */}
              <div className="flex flex-col items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  formStep >= totalSteps ? 'bg-blue-600 text-white' : 'bg-neutral-200 text-neutral-500'
                }`}>
                  {hasPhysicalProducts ? 3 : 2}
                </div>
                <span className="mt-2 text-sm font-medium text-neutral-700">Payment</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Checkout Form */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-xl shadow-sm p-6">
                {!clientSecret ? (
                  <form onSubmit={handleSubmit}>
                    {/* Step 1: Contact Information */}
                    {formStep === 1 && (
                      <div>
                        <h2 className="text-xl font-semibold text-neutral-900 mb-6">Contact Information</h2>
                        <div className="space-y-4">
                          <div>
                            <label htmlFor="email" className="block text-sm font-medium text-neutral-700 mb-1">
                              Email Address
                            </label>
                            <input
                              type="email"
                              id="email"
                              name="email"
                              value={formData.email}
                              onChange={handleInputChange}
                              required
                              className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                              placeholder="your@email.com"
                            />
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <label htmlFor="firstName" className="block text-sm font-medium text-neutral-700 mb-1">
                                First Name
                              </label>
                              <input
                                type="text"
                                id="firstName"
                                name="firstName"
                                value={formData.firstName}
                                onChange={handleInputChange}
                                required
                                className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                                placeholder="John"
                              />
                            </div>
                            <div>
                              <label htmlFor="lastName" className="block text-sm font-medium text-neutral-700 mb-1">
                                Last Name
                              </label>
                              <input
                                type="text"
                                id="lastName"
                                name="lastName"
                                value={formData.lastName}
                                onChange={handleInputChange}
                                required
                                className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                                placeholder="Doe"
                              />
                            </div>
                          </div>
                          {hasPhysicalProducts && (
                            <>
                              <div>
                                <label htmlFor="phoneNumber" className="block text-sm font-medium text-neutral-700 mb-1">
                                  Phone Number
                                </label>
                                <input
                                  type="tel"
                                  id="phoneNumber"
                                  name="phoneNumber"
                                  value={formData.phoneNumber}
                                  onChange={handleInputChange}
                                  required
                                  className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                                  placeholder="+1 (555) 123-4567"
                                />
                              </div>
                              <div>
                                <label htmlFor="country" className="block text-sm font-medium text-neutral-700 mb-1">
                                  Country
                                </label>
                                <select
                                  id="country"
                                  name="country"
                                  value={formData.country}
                                  onChange={handleInputChange}
                                  required
                                  className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                                >
                                  <option value="United States">United States</option>
                                  <option value="Canada">Canada</option>
                                  <option value="United Kingdom">United Kingdom</option>
                                  <option value="Australia">Australia</option>
                                  <option value="Germany">Germany</option>
                                  <option value="France">France</option>
                                  <option value="Japan">Japan</option>
                                  <option value="China">China</option>
                                  <option value="India">India</option>
                                  <option value="Brazil">Brazil</option>
                                  {/* Add more countries as needed */}
                                </select>
                              </div>
                            </>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Step 2: Shipping Information (only for physical products) */}
                    {hasPhysicalProducts && formStep === 2 && (
                      <div>
                        <h2 className="text-xl font-semibold text-neutral-900 mb-6">Shipping Address</h2>
                        <div className="space-y-4">
                          <div>
                            <label htmlFor="city" className="block text-sm font-medium text-neutral-700 mb-1">
                              City
                            </label>
                            <input
                              type="text"
                              id="city"
                              name="city"
                              value={formData.city}
                              onChange={handleInputChange}
                              required
                              className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                              placeholder="New York"
                            />
                          </div>
                          <div>
                            <label htmlFor="address" className="block text-sm font-medium text-neutral-700 mb-1">
                              Street Address
                            </label>
                            <input
                              type="text"
                              id="address"
                              name="address"
                              value={formData.address}
                              onChange={handleInputChange}
                              required
                              className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                              placeholder="123 Main St, Apt 4B"
                            />
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label htmlFor="state" className="block text-sm font-medium text-neutral-700 mb-1">
                                State / Province
                              </label>
                              <input
                                type="text"
                                id="state"
                                name="state"
                                value={formData.state}
                                onChange={handleInputChange}
                                required
                                className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                                placeholder="NY"
                              />
                            </div>
                            <div>
                              <label htmlFor="zipCode" className="block text-sm font-medium text-neutral-700 mb-1">
                                ZIP / Postal Code
                              </label>
                              <input
                                type="text"
                                id="zipCode"
                                name="zipCode"
                                value={formData.zipCode}
                                onChange={handleInputChange}
                                required
                                className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                                placeholder="10001"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="mt-8 flex justify-end">
                      <button
                        type="submit"
                        className="px-6 py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors flex items-center gap-2"
                      >
                        {formStep < totalSteps ? (
                          <>
                            {formStep === 1 && !hasPhysicalProducts ? 'Proceed to Payment' : 'Continue'}
                            <FiChevronRight className="w-5 h-5" />
                          </>
                        ) : (
                          <>
                            Proceed to Payment
                            <FiCreditCard className="w-5 h-5" />
                          </>
                        )}
                      </button>
                    </div>
                  </form>
                ) : (
                  <Elements stripe={stripePromise} options={{ clientSecret }}>
                    <CheckoutForm
                      clientSecret={clientSecret}
                      onSuccess={() => setOrderComplete(true)}
                    />
                  </Elements>
                )}
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h2 className="text-lg font-semibold text-neutral-900 mb-4">Order Summary</h2>
                <div className="space-y-4">
                  {state.items.map((item) => (
                    <div key={item.id} className="flex gap-4">
                      <div className="relative w-16 h-16">
                        <Image
                          src={item.thumbnail || '/placeholder.jpg'}
                          alt={item.title}
                          fill
                          className="object-cover rounded-lg"
                        />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-sm font-medium text-neutral-900">{item.title}</h3>
                        <p className="text-sm text-neutral-500">Quantity: {item.quantity}</p>
                        <p className="text-sm font-medium text-neutral-900">
                          ${(item.price * item.quantity).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="border-t border-neutral-200 mt-6 pt-6 space-y-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-neutral-600">Subtotal</span>
                    <span className="font-medium text-neutral-900">
                      ${state.items.reduce((sum, item) => sum + item.price * item.quantity, 0).toFixed(2)}
                    </span>
                  </div>
                  {hasPhysicalProducts && (
                    <>
                      <div className="flex justify-between text-sm">
                        <span className="text-neutral-600">Shipping</span>
                        <span className="font-medium text-neutral-900">$5.00</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-neutral-600">Tax</span>
                        <span className="font-medium text-neutral-900">
                          ${(state.items.reduce((sum, item) => sum + item.price * item.quantity, 0) * 0.1).toFixed(2)}
                        </span>
                      </div>
                    </>
                  )}
                  <div className="flex justify-between text-lg font-semibold">
                    <span className="text-neutral-900">Total</span>
                    <span className="text-blue-600">
                      ${(
                        state.items.reduce((sum, item) => sum + item.price * item.quantity, 0) +
                        (hasPhysicalProducts ? 5 + state.items.reduce((sum, item) => sum + item.price * item.quantity, 0) * 0.1 : 0)
                      ).toFixed(2)}
                    </span>
                  </div>
                </div>
                <div className="mt-6 flex items-center gap-2 text-sm text-neutral-600">
                  <FiLock className="w-4 h-4" />
                  <span>Secure checkout powered by Stripe</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 