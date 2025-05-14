"use client";

import React, { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation'; 
import Image from 'next/image'; 
import Loader from '@/components/Loader';
import FloatingBackground from '@/components/FloatingBackground'; 

import { motion } from 'framer-motion';


const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  try {
    return new Date(dateString).toLocaleDateString('en-US', { 
      year: 'numeric', month: 'short', day: 'numeric' 
    });
  } catch (error) {
    return 'Invalid Date';
  }
};

function OrderSummaryContent() {
  const searchParams = useSearchParams();
  const router = useRouter(); 
  const orderId = searchParams.get('orderId');
  const [orderDetails, setOrderDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!orderId) {
      setError('Order ID not found.');
      setLoading(false);
      return;
    }

    const fetchOrder = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`/api/orders/${orderId}`);
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Failed to fetch order');
        }
        const data = await response.json();
        setOrderDetails(data); // Use renamed state setter
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderId]);


  return (
    <div className="bg-gray-100 min-h-screen p-4 md:p-8 flex items-center justify-center relative overflow-hidden">
      <FloatingBackground /> 
      
      
      <div className="relative z-10 w-full max-w-md">
        {loading && (
          
          <div className="flex justify-center items-center p-10 bg-white rounded-lg shadow-xl">
            <Loader />
          </div>
        )}

        {error && (
          <div className="bg-red-50 text-red-700 p-4 rounded-lg shadow-md border border-red-200 text-center">
            <p>Error loading order summary: {error}</p>
            <button 
              onClick={() => router.push('/employee')} 
              className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
            >
              Go to Home
            </button>
          </div>
        )}

        {!loading && !error && orderDetails && (
          <div className="bg-white rounded-lg shadow-xl overflow-hidden">
            <div className="p-6 bg-gradient-to-r from-green-500 to-emerald-600 text-white text-center">
              <Image 
                src="/assets/order_confirmed.svg" 
                alt="Order Confirmed" 
                width={80} 
                height={80} 
                className="mx-auto mb-3"
              />
              <h1 className="text-2xl font-bold mb-1">Order Confirmed!</h1>
              <p className="text-sm opacity-90">Thank you for your order.</p>
            </div>
            
            <div className="p-6">
              <div className="mb-4">
                <p className="text-xs text-gray-500 uppercase tracking-wider">Order Number</p>
                <p className="text-lg font-semibold text-gray-800">#{orderDetails.dailyOrderNumber}</p>
              </div>
             
              <div className="mb-6">
                <p className="text-xs text-gray-500 uppercase tracking-wider mb-2">Items</p>
                <div className="space-y-3 max-h-48 overflow-y-auto pr-2"> {/* Added scroll */} 
                  {orderDetails.items.map((item, index) => (
                    <div key={index} className="flex justify-between items-center text-sm">
                      <span className="text-gray-700">{item.name} x {item.quantity}</span>
                      <span className="text-gray-800 font-medium">₹{(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="border-t border-gray-200 pt-4">
                <div className="flex justify-between items-center text-lg font-semibold text-gray-900">
                  <span>Total Amount</span>
                  <span>₹{orderDetails.totalAmount.toFixed(2)}</span>
                </div>
              </div>

              <div className="mt-6 text-center">
                <button 
                  onClick={() => router.push('/employee')} 
                  className="w-full px-6 py-3 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                >
                  Continue Shopping
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function OrderSummaryPage() {
  return (
    <Suspense fallback={<div className="flex justify-center items-center min-h-screen bg-gray-50"><Loader /></div>}>
      <OrderSummaryContent /> {/* Render the content component here */}
    </Suspense>
  );
}