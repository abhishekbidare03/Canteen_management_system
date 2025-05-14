"use client";

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation'; // Use next/navigation for App Router
// Remove Header and Sidebar imports
// import Header from '@/components/Header';
// import Sidebar from '@/components/Sidebar';
import MenuItemCard from '@/components/MenuItemCard';
import Loader from '@/components/Loader';

export default function CategoryPage() {
  const params = useParams(); // Get route parameters
  const category = params?.category ? decodeURIComponent(params.category) : null; // Decode category name

  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!category) {
      setError('Category not found.');
      setLoading(false);
      return;
    }

    const fetchCategoryItems = async () => {
      setLoading(true);
      setError(null);
      try {
        // Fetch items for the specific category
        const res = await fetch(`/api/food-items?category=${encodeURIComponent(category)}`); 
        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.message || `HTTP error! status: ${res.status}`);
        }
        const data = await res.json();
        setMenuItems(data);
      } catch (err) {
        console.error(`Failed to fetch ${category} items:`, err);
        setError(`Failed to load ${category} menu items. ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchCategoryItems();
  }, [category]); // Re-run effect when category changes

  // Return only the main content, without the outer layout divs, Header, or Sidebar
  return (
    <>
      <div className="text-center mb-8">
        {/* Display category name dynamically */}
        <h2 className="text-3xl font-bold text-gray-800 mb-2">
          {category ? `${category} Menu` : 'Food Menu'}
        </h2>
        <p className="text-gray-600">
          Explore our delicious selection of {category ? category.toLowerCase() : 'dishes'}.
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
            // Ensure MenuItemCard receives the full item object
            <MenuItemCard key={item._id} item={item} /> 
          ))}
        </div>
      ) : (
        <div className="text-center text-gray-500">
          No items found for the {category ? category.toLowerCase() : 'selected'} category.
        </div> // Message if no items
      )}
    </>
  );
}