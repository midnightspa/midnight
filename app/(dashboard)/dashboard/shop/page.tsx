'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Poppins } from 'next/font/google';
import { FiPackage, FiDownload, FiUser, FiCreditCard, FiMapPin } from 'react-icons/fi';

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
});

interface Order {
  id: string;
  orderNumber: string;
  items: {
    id: string;
    title: string;
    price: number;
    quantity: number;
    thumbnail: string | null;
    type: 'PHYSICAL' | 'DIGITAL';
  }[];
  total: number;
  status: string;
  createdAt: string;
}

interface Customer {
  email: string;
  firstName: string;
  lastName: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  country?: string;
}

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState<'orders' | 'downloads' | 'profile'>('orders');
  const [orders, setOrders] = useState<Order[]>([]);
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCustomerData = async () => {
      try {
        const response = await fetch('/api/customer');
        const data = await response.json();
        if (data.error) throw new Error(data.error);
        setCustomer(data.customer);
        setOrders(data.orders);
      } catch (error) {
        console.error('Error fetching customer data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCustomerData();
  }, []);

  if (loading) {
    return (
      <div className={`min-h-screen bg-neutral-50 ${poppins.className}`}>
        <div className="container mx-auto px-4 py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-neutral-900 mx-auto"></div>
        </div>
      </div>
    );
  }

  if (!customer) {
    return (
      <div className={`min-h-screen bg-neutral-50 ${poppins.className}`}>
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-2xl mx-auto text-center">
            <h1 className="text-2xl font-bold text-neutral-900 mb-4">
              Please sign in to access your dashboard
            </h1>
            <Link
              href="/login"
              className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              Sign In
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-neutral-50 ${poppins.className}`}>
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row gap-8">
            {/* Sidebar */}
            <div className="md:w-1/4">
              <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="text-center mb-6">
                  <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl font-bold text-blue-600">
                      {customer.firstName[0]}
                      {customer.lastName[0]}
                    </span>
                  </div>
                  <h2 className="text-lg font-semibold text-neutral-900">
                    {customer.firstName} {customer.lastName}
                  </h2>
                  <p className="text-sm text-neutral-500">{customer.email}</p>
                </div>
                <nav className="space-y-2">
                  <button
                    onClick={() => setActiveTab('orders')}
                    className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg transition-colors ${
                      activeTab === 'orders'
                        ? 'bg-blue-600 text-white'
                        : 'hover:bg-neutral-100 text-neutral-700'
                    }`}
                  >
                    <FiPackage className="w-5 h-5" />
                    <span>Orders</span>
                  </button>
                  <button
                    onClick={() => setActiveTab('downloads')}
                    className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg transition-colors ${
                      activeTab === 'downloads'
                        ? 'bg-blue-600 text-white'
                        : 'hover:bg-neutral-100 text-neutral-700'
                    }`}
                  >
                    <FiDownload className="w-5 h-5" />
                    <span>Downloads</span>
                  </button>
                  <button
                    onClick={() => setActiveTab('profile')}
                    className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg transition-colors ${
                      activeTab === 'profile'
                        ? 'bg-blue-600 text-white'
                        : 'hover:bg-neutral-100 text-neutral-700'
                    }`}
                  >
                    <FiUser className="w-5 h-5" />
                    <span>Profile</span>
                  </button>
                </nav>
              </div>
            </div>

            {/* Main Content */}
            <div className="md:w-3/4">
              <div className="bg-white rounded-xl shadow-sm p-6">
                {activeTab === 'orders' && (
                  <div>
                    <h2 className="text-xl font-semibold text-neutral-900 mb-6">Order History</h2>
                    <div className="space-y-6">
                      {orders.length > 0 ? (
                        orders.map((order) => (
                          <div
                            key={order.id}
                            className="border border-neutral-200 rounded-lg p-4"
                          >
                            <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
                              <div>
                                <p className="text-sm text-neutral-500">
                                  Order #{order.orderNumber}
                                </p>
                                <p className="text-sm text-neutral-500">
                                  {new Date(order.createdAt).toLocaleDateString()}
                                </p>
                              </div>
                              <div className="flex items-center gap-4">
                                <span className="text-sm font-medium text-neutral-900">
                                  ${order.total.toFixed(2)}
                                </span>
                                <span
                                  className={`px-2 py-1 text-xs font-medium rounded-full ${
                                    order.status === 'paid'
                                      ? 'bg-green-100 text-green-800'
                                      : order.status === 'pending'
                                      ? 'bg-yellow-100 text-yellow-800'
                                      : 'bg-neutral-100 text-neutral-800'
                                  }`}
                                >
                                  {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                                </span>
                              </div>
                            </div>
                            <div className="space-y-4">
                              {order.items.map((item) => (
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
                                    <h3 className="text-sm font-medium text-neutral-900">
                                      {item.title}
                                    </h3>
                                    <p className="text-sm text-neutral-500">
                                      Quantity: {item.quantity}
                                    </p>
                                    <p className="text-sm font-medium text-neutral-900">
                                      ${(item.price * item.quantity).toFixed(2)}
                                    </p>
                                  </div>
                                  {item.type === 'DIGITAL' && (
                                    <button className="px-4 py-2 text-sm text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                                      Download
                                    </button>
                                  )}
                                </div>
                              ))}
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="text-center py-12">
                          <FiPackage className="w-12 h-12 text-neutral-300 mx-auto mb-4" />
                          <h3 className="text-lg font-semibold text-neutral-900 mb-2">
                            No orders yet
                          </h3>
                          <p className="text-neutral-600 mb-6">
                            Start shopping to see your orders here.
                          </p>
                          <Link
                            href="/shop"
                            className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
                          >
                            Browse Products
                          </Link>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {activeTab === 'downloads' && (
                  <div>
                    <h2 className="text-xl font-semibold text-neutral-900 mb-6">Downloads</h2>
                    <div className="space-y-4">
                      {orders
                        .flatMap((order) =>
                          order.items.filter((item) => item.type === 'DIGITAL')
                        )
                        .map((item) => (
                          <div
                            key={item.id}
                            className="flex items-center justify-between p-4 border border-neutral-200 rounded-lg"
                          >
                            <div className="flex items-center gap-4">
                              <div className="relative w-12 h-12">
                                <Image
                                  src={item.thumbnail || '/placeholder.jpg'}
                                  alt={item.title}
                                  fill
                                  className="object-cover rounded-lg"
                                />
                              </div>
                              <div>
                                <h3 className="text-sm font-medium text-neutral-900">
                                  {item.title}
                                </h3>
                                <p className="text-sm text-neutral-500">Digital Product</p>
                              </div>
                            </div>
                            <button className="px-4 py-2 text-sm text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                              Download
                            </button>
                          </div>
                        ))}
                    </div>
                  </div>
                )}

                {activeTab === 'profile' && (
                  <div>
                    <h2 className="text-xl font-semibold text-neutral-900 mb-6">Profile</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h3 className="text-sm font-medium text-neutral-700 mb-4 flex items-center gap-2">
                          <FiUser className="w-4 h-4" />
                          Personal Information
                        </h3>
                        <div className="space-y-4">
                          <div>
                            <label className="block text-sm text-neutral-500 mb-1">
                              Full Name
                            </label>
                            <p className="text-neutral-900">
                              {customer.firstName} {customer.lastName}
                            </p>
                          </div>
                          <div>
                            <label className="block text-sm text-neutral-500 mb-1">
                              Email Address
                            </label>
                            <p className="text-neutral-900">{customer.email}</p>
                          </div>
                        </div>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-neutral-700 mb-4 flex items-center gap-2">
                          <FiMapPin className="w-4 h-4" />
                          Shipping Address
                        </h3>
                        {customer.address ? (
                          <div className="space-y-2">
                            <p className="text-neutral-900">{customer.address}</p>
                            <p className="text-neutral-900">
                              {customer.city}, {customer.state} {customer.zipCode}
                            </p>
                            <p className="text-neutral-900">{customer.country}</p>
                          </div>
                        ) : (
                          <p className="text-neutral-500">No shipping address added yet.</p>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 