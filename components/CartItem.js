"use client";

import React from 'react';
import Image from 'next/image';
import { useCart } from '../context/CartContext';
import { PlusIcon, MinusIcon, XMarkIcon } from '@heroicons/react/24/solid';

const CartItem = ({ item }) => {
  const { updateQuantity, removeFromCart } = useCart();

  // Fallback image
  const imageSource = item.imageSrc || '/assets/placeholder.png';

  return (
    <div className="flex items-center justify-between p-4 bg-white rounded-lg mb-3 shadow-sm border border-gray-200"> {/* Changed background to white, added border */}
      <div className="flex items-center space-x-4">
        <div className="relative w-16 h-16 rounded-md overflow-hidden flex-shrink-0">
          <Image 
            src={imageSource}
            alt={item.name}
            layout="fill"
            objectFit="cover"
            onError={(e) => { e.target.src = '/assets/placeholder.png'; }} // Fallback on error
          />
        </div>
        <span className="font-medium text-gray-800 truncate w-32 md:w-48">{item.name}</span> {/* Changed text to gray-800 */}
      </div>
      
      <div className="flex items-center space-x-3">
        {/* Quantity Controls */}
        <button 
          onClick={() => updateQuantity(item._id, -1)}
          className="p-1 rounded-full bg-gray-200 text-gray-700 hover:bg-gray-300 transition-colors disabled:opacity-50" /* Adjusted button colors */
          disabled={item.quantity <= 1}
        >
          <MinusIcon className="h-4 w-4" />
        </button>
        <span className="font-semibold text-gray-800 w-4 text-center">{item.quantity}</span> {/* Changed text to gray-800 */}
        <button 
          onClick={() => updateQuantity(item._id, 1)}
          className="p-1 rounded-full bg-gray-200 text-gray-700 hover:bg-gray-300 transition-colors" /* Adjusted button colors */
        >
          <PlusIcon className="h-4 w-4" />
        </button>
      </div>

      <div className="flex items-center space-x-4">
        <span className="font-semibold text-blue-600 w-16 text-right">₹{(item.price * item.quantity).toFixed(2)}</span> {/* Changed price color */}
        {/* Remove Button */}
        <button 
          onClick={() => removeFromCart(item._id)}
          className="p-1.5 rounded-full bg-red-100 text-red-600 hover:bg-red-200 transition-colors" /* Adjusted remove button colors */
        >
          <XMarkIcon className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};

export default CartItem;