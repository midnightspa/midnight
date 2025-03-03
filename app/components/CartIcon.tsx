'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '../contexts/CartContext';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiShoppingBag } from 'react-icons/fi';

export default function CartIcon() {
  const { state, removeItem, updateQuantity } = useCart();
  const itemCount = state.items.reduce((total, item) => total + item.quantity, 0);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 hover:bg-neutral-100 rounded-full transition-colors"
        aria-label="Shopping cart"
      >
        <FiShoppingBag className="w-6 h-6 text-neutral-900" />
        {itemCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
            {itemCount}
          </span>
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.2 }}
            className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-xl z-50 overflow-hidden"
          >
            <div className="p-4 border-b border-neutral-100">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-neutral-900">Your Cart</h3>
                <span className="text-sm text-neutral-500">{itemCount} items</span>
              </div>
            </div>

            <div className="max-h-80 overflow-y-auto">
              {state.items.length === 0 ? (
                <div className="p-6 text-center">
                  <div className="flex justify-center mb-3">
                    <FiShoppingBag className="w-10 h-10 text-neutral-300" />
                  </div>
                  <p className="text-neutral-500">Your cart is empty</p>
                </div>
              ) : (
                <div className="p-2">
                  {state.items.map((item) => (
                    <div key={item.id} className="flex items-center p-2 hover:bg-neutral-50 rounded-lg">
                      <div className="relative w-14 h-14 flex-shrink-0 rounded-md overflow-hidden">
                        <Image
                          src={item.thumbnail || '/placeholder.jpg'}
                          alt={item.title}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="ml-3 flex-1">
                        <p className="text-sm font-medium text-neutral-900 line-clamp-1">{item.title}</p>
                        <div className="flex items-center justify-between mt-1">
                          <div className="flex items-center">
                            <button 
                              onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                              className="w-5 h-5 flex items-center justify-center text-neutral-500 hover:text-neutral-700"
                            >
                              -
                            </button>
                            <span className="mx-2 text-xs text-neutral-900">{item.quantity}</span>
                            <button 
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="w-5 h-5 flex items-center justify-center text-neutral-500 hover:text-neutral-700"
                            >
                              +
                            </button>
                          </div>
                          <div className="flex items-center">
                            <span className="text-sm font-medium text-neutral-900">
                              ${((item.salePrice || item.price) * item.quantity).toFixed(2)}
                            </span>
                            <button 
                              onClick={() => removeItem(item.id)}
                              className="ml-2 text-neutral-400 hover:text-red-500"
                            >
                              <FiX className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="p-4 border-t border-neutral-100">
              <div className="flex justify-between mb-4">
                <span className="font-medium text-neutral-900">Total:</span>
                <span className="font-semibold text-neutral-900">${state.total.toFixed(2)}</span>
              </div>
              <div className="space-y-2">
                <Link
                  href="/cart"
                  onClick={() => setIsOpen(false)}
                  className="block w-full py-2 px-4 bg-neutral-100 hover:bg-neutral-200 text-neutral-900 text-center font-medium rounded-lg transition-colors"
                >
                  View Cart
                </Link>
                <Link
                  href="/checkout"
                  onClick={() => setIsOpen(false)}
                  className="block w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white text-center font-medium rounded-lg transition-colors"
                >
                  Checkout
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
} 