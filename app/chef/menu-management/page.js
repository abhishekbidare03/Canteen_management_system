"use client";

import React, { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { toast, Toaster } from 'react-hot-toast';
import Loader from '@/components/Loader';
import { TrashIcon, PencilSquareIcon } from '@heroicons/react/24/outline';
import { motion, AnimatePresence } from 'framer-motion';

const MenuManagementPage = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchMenuItems = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/chef/food-items'); // Use the existing GET route
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch menu items');
      }
      const data = await response.json();
      setMenuItems(data);
    } catch (err) {
      console.error('Error fetching menu items:', err);
      setError(`Failed to load menu items: ${err.message}`);
      toast.error(`Failed to load menu items: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMenuItems();
  }, [fetchMenuItems]);

  const handleDelete = async (itemId, category) => {
    // Basic confirmation
    if (!window.confirm('Are you sure you want to delete this item? This action cannot be undone.')) {
      return;
    }

    const loadingToastId = toast.loading('Deleting item...');
    
    try {
      // We need to pass the category to the DELETE API to find the correct collection
      const response = await fetch(`/api/chef/food-items/${itemId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ category }), // Send category in the body
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Failed to delete item');
      }

      toast.success('Item deleted successfully!', { id: loadingToastId });
      // Remove item from state for optimistic UI update with animation
      setMenuItems(prevItems => prevItems.filter(item => item._id !== itemId));

    } catch (err) {
      console.error('Error deleting item:', err);
      toast.error(`Error deleting item: ${err.message}`, { id: loadingToastId });
    } 
  };
  
  // Placeholder for edit functionality
  const handleEdit = (itemId) => {
    toast('Edit functionality not yet implemented.', { icon: '🚧' });
    // router.push(`/chef/edit-item/${itemId}`); // Example navigation
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Toaster position="top-center" reverseOrder={false} />
      <h1 className="text-3xl font-bold text-gray-900 mb-6 border-b pb-4">Menu Management</h1>

      {isLoading ? (
        <Loader />
      ) : error ? (
        <div className="text-center text-red-500 bg-red-100 p-4 rounded-md">{error}</div>
      ) : menuItems.length === 0 ? (
        <div className="text-center text-gray-500">No menu items found. Add some items first!</div>
      ) : (
        <div className="overflow-x-auto shadow-md rounded-lg">
          <table className="min-w-full divide-y divide-gray-200 bg-white">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Image</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              <AnimatePresence initial={false}>
                {menuItems.map((item) => (
                  <motion.tr 
                    key={item._id} 
                    layout
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0, x: -50, transition: { duration: 0.3 } }}
                    className="hover:bg-gray-50 transition-colors duration-150"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex-shrink-0 h-12 w-12 relative">
                        <Image 
                          src={item.imageSrc || '/assets/placeholder.png'} 
                          alt={item.name} 
                          layout="fill"
                          objectFit="cover"
                          className="rounded-md"
                          onError={(e) => { e.target.src = '/assets/placeholder.png'; }}
                        />
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.category}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">₹{item.price.toFixed(2)}</td>
                    <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate" title={item.description}>{item.description}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                      <button 
                        onClick={() => handleEdit(item._id)} 
                        className="text-indigo-600 hover:text-indigo-900 transition-colors duration-150 p-1 rounded-full hover:bg-indigo-100"
                        title="Edit Item"
                      >
                        <PencilSquareIcon className="h-5 w-5" />
                      </button>
                      <button 
                        onClick={() => handleDelete(item._id, item.category)} 
                        className="text-red-600 hover:text-red-900 transition-colors duration-150 p-1 rounded-full hover:bg-red-100"
                        title="Delete Item"
                      >
                        <TrashIcon className="h-5 w-5" />
                      </button>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default MenuManagementPage;