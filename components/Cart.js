"use client";

import React, { useState, useEffect } from 'react'; // Added useEffect
import { useCart } from '../context/CartContext';
import CartItem from './CartItem';
import { XMarkIcon, ShoppingCartIcon, ArrowRightIcon } from '@heroicons/react/24/outline';
import { useRouter } from 'next/navigation'; 

const Cart = () => {
  const { cartItems, totalAmount, itemCount, toggleCart, clearCart } = useCart();
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [orderError, setOrderError] = useState(null);
  const [userId, setUserId] = useState(null); // State to hold userId
  const router = useRouter(); 

  // Fetch userId from localStorage on component mount
  useEffect(() => {
    const storedUserId = localStorage.getItem('userId'); // Assuming userId is stored here after login
    if (storedUserId) {
      setUserId(storedUserId);
    }
  }, []);

  const handlePlaceOrder = async () => {
    if (!userId) {
      setOrderError('User not identified. Please log in again.');
      return;
    }
    
    setIsPlacingOrder(true);
    setOrderError(null);

    const orderData = {
      cartItems: cartItems.map(item => ({ 
        _id: item._id, 
        name: item.name,
        quantity: item.quantity, 
        price: item.price 
      })),
      totalAmount: totalAmount,
      userId: userId // Use the actual userId from state
    };

    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to place order');
      }

      const result = await response.json();
      console.log('Order placed successfully:', result);
      
      // Clear cart and close panel FIRST
      clearCart(); 
      toggleCart(); 

      // THEN Redirect to order summary page
      router.push(`/order-summary?orderId=${result.orderId}`);
      // Removed alert

    } catch (error) {
      console.error('Error placing order:', error);
      setOrderError(error.message || 'An unexpected error occurred.');
    } finally {
      setIsPlacingOrder(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex pointer-events-none">
      {/* Overlay with blur only */}
      <div className="fixed inset-0 backdrop-blur-md transition-opacity pointer-events-auto" onClick={toggleCart}></div>
      {/* Slide-in Cart Panel - 40% width, right side, with spring motion */}
      <aside className="relative ml-auto h-full bg-white shadow-2xl flex flex-col animate-cart-slide-in pointer-events-auto" style={{width: '40vw', minWidth: 320, maxWidth: 700}}>
        {/* Header */}
        <div className="flex items-center justify-between px-8 py-6 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <ShoppingCartIcon className="h-7 w-7 text-blue-600" />
            <span className="text-2xl font-bold text-gray-800">Cart</span>
            <span className="ml-2 text-sm bg-blue-100 text-blue-700 rounded-full px-3 py-1 font-semibold">{itemCount}</span>
          </div>
          <button onClick={toggleCart} className="p-2 rounded-full hover:bg-gray-100 transition-colors">
            <XMarkIcon className="h-7 w-7 text-gray-500" />
          </button>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto px-8 py-6 bg-gray-50">
          {cartItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-400">
              <ShoppingCartIcon className="h-14 w-14 mb-2" />
              <span>Your cart is empty.</span>
            </div>
          ) : (
            cartItems.map(item => (
              <CartItem key={item._id} item={item} />
            ))
          )}
        </div>

        {/* Order Summary */}
        <div className="px-8 py-6 border-t border-gray-200 bg-white">
          {orderError && (
            <div className="mb-3 p-3 bg-red-100 text-red-700 rounded-md text-sm">
              Error: {orderError}
            </div>
          )}
          <div className="flex justify-between items-center mb-4">
            <span className="text-xl text-gray-600">Subtotal</span>
            <span className="text-2xl font-bold text-gray-800">₹{totalAmount.toFixed(2)}</span>
          </div>
          <button 
            onClick={handlePlaceOrder}
            disabled={cartItems.length === 0 || isPlacingOrder}
            className="w-full flex items-center justify-center bg-blue-600 text-white font-bold py-4 px-8 rounded-lg transition-all hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-lg"
          >
            {isPlacingOrder ? 'Placing Order...' : 'Place Order'}
            {!isPlacingOrder && <ArrowRightIcon className="h-6 w-6 ml-2" />}
          </button>
        </div>
      </aside>
      <style jsx global>{`
        @keyframes cart-slide-in {
          0% { transform: translateX(100%) scale(0.98); opacity: 0.7; }
          60% { transform: translateX(-2%) scale(1.03); opacity: 1; }
          80% { transform: translateX(0%) scale(0.98); }
          100% { transform: translateX(0%) scale(1); }
        }
        .animate-cart-slide-in {
          animation: cart-slide-in 0.45s cubic-bezier(0.22, 1, 0.36, 1) both;
        }
      `}</style>
    </div>
  );
};

export default Cart;