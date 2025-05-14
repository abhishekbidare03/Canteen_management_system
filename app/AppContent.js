"use client";

import React, { useState, useEffect } from 'react';
import { useLoading } from '../context/LoadingContext';
import InitialLoader from '../components/InitialLoader'; // Initial loader
import Loader from '../components/Loader'; // Transition loader
import { usePathname } from 'next/navigation';

const AppContent = ({ children }) => {
  const { isLoading, setIsLoading } = useLoading();
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const pathname = usePathname();

  // Simulate initial load completion
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsInitialLoading(false);
    }, 1500); // Adjust time as needed for initial load simulation
    return () => clearTimeout(timer);
  }, []);

  // Handle route changes for transition loader
  useEffect(() => {
    // Set loading true immediately on path change
    setIsLoading(true);

    // Set loading false after a short delay to allow transition
    const transitionTimer = setTimeout(() => {
      setIsLoading(false);
    }, 500); // Adjust time for transition visibility

    return () => clearTimeout(transitionTimer);
  }, [pathname, setIsLoading]); // Rerun effect when pathname changes

  if (isInitialLoading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white z-50">
        <InitialLoader />
      </div>
    );
  }

  return (
    <>
      {/* Show Loader2 only if NOT initial loading AND isLoading is true */}
      {!isInitialLoading && isLoading && (
        <div className="fixed inset-0 flex items-center justify-center bg-white/80 backdrop-blur-sm z-40">
          <Loader />
        </div>
      )}
      {/* Render children only when not initial loading */}
      {!isInitialLoading && children}
    </>
  );
};

export default AppContent;