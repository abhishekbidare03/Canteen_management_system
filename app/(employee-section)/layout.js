"use client";

import React, { useEffect, useState, useCallback } from 'react';
// import io from 'socket.io-client'; // Removed Socket.IO client
// import toast, { Toaster } from 'react-hot-toast'; // Removed toast
import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';
import FloatingBackground from '@/components/FloatingBackground'; // Import the background component
import { useCart } from '@/context/CartContext'; // Import useCart
import Cart from '@/components/Cart'; // Import Cart component

// let socket; // Removed socket variable

export default function EmployeeSectionLayout({ children }) {
  // Removed state and effects related to userId fetching and notifications
  const { isCartOpen } = useCart(); // Get cart visibility state

  // Removed Socket.IO connection logic and related useEffect hooks

  return (
    <div className="flex h-screen"> {/* Removed bg-gray-100 */} 
      <Sidebar />
      {/* Added relative positioning to this div */}
      <div className="flex-1 flex flex-col overflow-hidden relative"> 
        <Header />
        {/* Moved FloatingBackground here, before main */}
        <FloatingBackground /> 
        {/* Removed bg-gray-100 from main */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto p-6 z-10">
          {/* Ensure content is above the background */}
          <div className="relative z-10"> {/* This inner z-10 might be redundant now, but keep for safety */}
            {/* <Toaster position="top-right" /> */} {/* Removed Toaster */}
            {children}
          </div>
        </main>
      </div>
      {/* Conditionally render the Cart modal */}
      {isCartOpen && <Cart />}

      {/* Removed notification related comments */}
    </div>
  );
}