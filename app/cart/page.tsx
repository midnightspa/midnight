'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useCart } from '../contexts/CartContext';
import { Poppins } from 'next/font/google';

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
});

export default function CartPage() {
  const { state, removeItem, updateQuantity, clearCart } = useCart();

  const handleQuantityChange = (id: string, quantity: number) => {
    if (quantity < 1) {
      removeItem(id);
    } else {
      updateQuantity(id, quantity);
    }
  };

  return (
    <div className={`min-h-screen bg-neutral-50 ${poppins.className}`}>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-neutral-900 mb-8">Shopping Cart</h1>

        {state.items.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl shadow-sm">
            <h2 className="text-xl font-semibold text-neutral-900 mb-4">
              Your cart is empty
            </h2>
            <p className="text-neutral-600 mb-8">
              Looks like you haven't added any items to your cart yet.
            </p>
            <Link
              href="/shop"
              className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              Continue Shopping
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {state.items.map((item) => (
                <div
                  key={item.id}
                  className="bg-white rounded-xl p-6 shadow-sm flex gap-6"
                >
                  <div className="relative w-24 h-24 flex-shrink-0">
                    <Image
                      src={item.thumbnail || '/placeholder.jpg'}
                      alt={item.title}
                      fill
                      className="object-cover rounded-lg"
                    />
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-lg font-semibold text-neutral-900">
                          {item.title}
                        </h3>
                        <p className="text-sm text-neutral-500">
                          {item.type === 'DIGITAL' ? 'Digital Product' : 'Physical Product'}
                        </p>
                      </div>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        Remove
                      </button>
                    </div>
                    <div className="mt-4 flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <label className="text-sm font-medium text-neutral-900">
                          Quantity
                        </label>
                        <div className="flex items-center">
                          <button
                            onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                            className="w-8 h-8 flex items-center justify-center border border-neutral-300 rounded-l-md hover:bg-neutral-50"
                          >
                            -
                          </button>
                          <input
                            type="number"
                            value={item.quantity}
                            onChange={(e) => handleQuantityChange(item.id, Number(e.target.value))}
                            className="w-16 h-8 border-y border-neutral-300 text-center"
                          />
                          <button
                            onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                            className="w-8 h-8 flex items-center justify-center border border-neutral-300 rounded-r-md hover:bg-neutral-50"
                          >
                            +
                          </button>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-semibold text-neutral-900">
                          ${((item.salePrice || item.price) * item.quantity).toFixed(2)}
                        </div>
                        {item.salePrice && (
                          <div className="text-sm text-neutral-500 line-through">
                            ${(item.price * item.quantity).toFixed(2)}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              <div className="flex justify-between items-center bg-white rounded-xl p-6 shadow-sm">
                <button
                  onClick={clearCart}
                  className="text-red-600 hover:text-red-800 font-medium"
                >
                  Clear Cart
                </button>
                <Link
                  href="/shop"
                  className="text-blue-600 hover:text-blue-800 font-medium"
                >
                  Continue Shopping
                </Link>
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl p-6 shadow-sm">
                <h2 className="text-xl font-semibold text-neutral-900 mb-6">
                  Order Summary
                </h2>
                <div className="space-y-4">
                  <div className="flex justify-between text-neutral-600">
                    <span>Subtotal</span>
                    <span>${state.total.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-neutral-600">
                    <span>Shipping</span>
                    <span>Calculated at checkout</span>
                  </div>
                  <div className="border-t border-neutral-200 pt-4">
                    <div className="flex justify-between text-lg font-semibold text-neutral-900">
                      <span>Total</span>
                      <span>${state.total.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
                <Link
                  href="/checkout"
                  className="w-full mt-6 bg-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-700 transition-colors"
                >
                  Proceed to Checkout
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 