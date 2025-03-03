import React from 'react';
import { Metadata } from 'next';
import CartStats from './CartStats';

export const metadata: Metadata = {
  title: 'Admin Dashboard | Midnight Spa',
  description: 'Admin dashboard for Midnight Spa',
};

export default function AdminDashboardPage() {
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <CartStats />
        {/* Add more dashboard widgets here */}
      </div>
    </div>
  );
} 