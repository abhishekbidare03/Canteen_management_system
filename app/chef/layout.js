import React from 'react';
import Header from '@/components/Header'; // Assuming Header is in components
import ChefSidebar from '@/components/ChefSidebar'; // The sidebar we just created
import FloatingBackground from '@/components/FloatingBackground'; // Import the background component

export default function ChefLayout({ children }) {
  return (
    <div className="flex h-screen"> {/* Removed bg-gray-100 */} 
      <ChefSidebar />
      {/* Adjust margin-left to match new sidebar width (w-56) */}
      <div className="flex-1 flex flex-col overflow-hidden ml-56 relative"> {/* Added relative */} 
        {/* Pass hideCart prop to Header */}
        {/* NOTE: Added usePirateIcons=true based on the failed block's context */}
        <Header hideCart={true} usePirateIcons={true} /> 
        {/* Add FloatingBackground here, before main */}
        <FloatingBackground /> 
        {/* Removed bg-gray-100 from main */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto px-6 pb-6 z-10">
          {/* Ensure content is above background */}
          {children} {/* Page content will be rendered here */}
        </main>
      </div>
    </div>
  );
}