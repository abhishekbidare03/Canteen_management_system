"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { UserCircleIcon, BellIcon, ShoppingCartIcon } from '@heroicons/react/24/outline'; // Added ShoppingCartIcon
import FloatingPirateIcons from './FloatingPirateIcons.js'; // Import the new component
import { useCart } from '../context/CartContext'; // Import useCart

// Accept hideCart prop
const Header = ({ hideCart = false }) => {
  const { toggleCart, itemCount } = useCart(); // Get toggleCart and itemCount

  return (
    <motion.header 
      className="bg-white/90 backdrop-blur-sm p-2 shadow-md sticky top-0 z-30 overflow-hidden" // Reduced padding from p-4 to p-2
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: 'spring', stiffness: 50, damping: 15 }}
    >
      <FloatingPirateIcons /> {/* Add the floating icons background */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10"> {/* Ensure content is above icons */}
        {/* Reduced height from h-16 to h-12 */}
        <div className="flex justify-between items-center h-12">
          {/* Left side - Logo/Title Placeholder */}
          <div className="flex-shrink-0">
            <span className="text-4xl font-bold "style={{ color: '#db3b25', letterSpacing: '8px' }}>THE BARATIE</span>
          </div>

          {/* Center - Search Bar Placeholder (Optional) */}
          <div className="hidden md:block">
            {/* <input type="text" placeholder="Search menu..." className="..." /> */}
          </div>

          {/* Right side - Icons */}
          <div className="flex items-center space-x-4">
            {/* <button className="p-1 rounded-full text-gray-500 hover:text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
              <BellIcon className="h-6 w-6" />
            </button> */} 
            
            {/* Cart Button - Conditionally render based on hideCart prop */}
            {!hideCart && (
              <button 
                onClick={toggleCart} 
                className="relative p-1 rounded-full text-gray-500 hover:text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                <ShoppingCartIcon className="h-6 w-6" />
                {itemCount > 0 && (
                  <span className="absolute -top-1 -right-1 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-red-100 transform translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full">
                    {itemCount}
                  </span>
                )}
              </button>
            )}

            {/* <button className="p-1 rounded-full text-gray-500 hover:text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
              <UserCircleIcon className="h-6 w-6" />
            </button> */} 
          </div>
        </div>
      </div>
    </motion.header>
  );
};

export default Header;