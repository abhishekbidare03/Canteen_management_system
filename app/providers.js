'use client';

import { CartProvider } from '@/context/CartContext';
import { useEffect, useState } from 'react';
import Loader from '@/components/Loader'; // Import the Loader component

export function Providers({ children }) {
  const [loading, setLoading] = useState(true); // Start with loading true
  const [loaderShown, setLoaderShown] = useState(false); // Track if loader has been shown this session

  useEffect(() => {
    // Check sessionStorage only on the client
    if (typeof window !== 'undefined') {
      const hasLoaderBeenShown = sessionStorage.getItem('loaderShown');
      if (hasLoaderBeenShown) {
        setLoading(false); // If shown before in this session, don't show loader
        setLoaderShown(true);
      } else {
        // If not shown, keep loading true initially
        setLoading(true);
      }
    }
  }, []);

  const handleLoadingComplete = () => {
    setLoading(false);
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('loaderShown', 'true'); // Mark as shown for this session
    }
    setLoaderShown(true);
  };

  // Conditionally render Loader or children based on loading state
  return (
    <CartProvider>
      {loading && !loaderShown ? (
        <Loader type="fullscreen" onLoadingComplete={handleLoadingComplete} />
      ) : (
        children
      )}
    </CartProvider>
  );
}