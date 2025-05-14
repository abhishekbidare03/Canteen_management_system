"use client"; // Make it a client component

import React, { useState, useEffect } from 'react';
// Remove Header and Sidebar imports
// import Header from '@/components/Header';
// import Sidebar from '@/components/Sidebar';
import MenuItemCard from '@/components/MenuItemCard';
import Loader from '@/components/Loader'; // Assuming you have a Loader component

// Remove the hardcoded sample data
// const sampleMenuItems = [...];

export default function EmployeeDashboard() {
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  // Removed userName state

  useEffect(() => {
    // Reverted to only fetch specials
    const fetchSpecials = async () => {
      setLoading(true);
      setError(null);
      try {
        // Fetch specials
        const specialsRes = await fetch('/api/menu/specials'); 
        if (!specialsRes.ok) {
          throw new Error(`HTTP error fetching specials! status: ${specialsRes.status}`);
        }
        const specialsData = await specialsRes.json();
        setMenuItems(specialsData);

        // Removed user name fetching logic

      } catch (err) {
        console.error("Failed to fetch specials:", err); // Updated error message
        setError('Failed to load menu items. Please try again later.'); // Updated error message
      } finally {
        setLoading(false);
      }
    };

    fetchSpecials(); // Call the reverted function
  }, []); // Empty dependency array ensures this runs only once on mount

  // Return only the main content, without the outer layout divs, Header, or Sidebar
  return (
    <>
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-1">Todays Specials</h2>
        <p className="text-gray-600">
          {/* Reverted to original static message */}
          🧑‍🍳Discover our chef <strong className="font-semibold text-blue-700">Sanji 🍳</strong> special selections for today, featuring the freshest ingredients and unique flavors 😋.
        </p>
      </div>

      {/* Conditional Rendering based on loading/error state */}
      {loading ? (
        <Loader /> // Display loader while fetching
      ) : error ? (
        <div className="text-center text-red-500">{error}</div> // Display error message
      ) : menuItems.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {menuItems.map((item) => (
            <MenuItemCard key={item.id || item._id} item={item} /> // Use item.id or item._id
          ))}
        </div>
      ) : (
        <div className="text-center text-gray-500">No specials available today.</div> // Message if no items
      )}
    </>
  );
}

// Remove commented out duplicate export
// export default EmployeeDashboard;
