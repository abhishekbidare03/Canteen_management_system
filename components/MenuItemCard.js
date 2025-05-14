"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { useCart } from '../context/CartContext'; // Import useCart hook
import { ShoppingCartIcon } from '@heroicons/react/24/solid'; // Import an icon

const MenuItemCard = ({ item }) => {
  const { addToCart } = useCart(); // Get addToCart function from context
  const [isAdding, setIsAdding] = useState(false);

  const handleAddToCart = () => {
    addToCart(item);
    setIsAdding(true);
    setTimeout(() => setIsAdding(false), 1000); // Reset after 1 second
  };

  // Fallback image if imageSrc is missing or invalid
  const imageSource = item.imageSrc || '/assets/placeholder.png'; // Adjust placeholder path if needed

  return (
    <motion.div
      className="bg-white rounded-xl shadow-lg overflow-hidden transform transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 flex flex-col h-full"
      whileHover={{ scale: 1.03 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="relative w-full h-48">
        <Image
          src={imageSource} 
          alt={item.name}
          layout="fill"
          objectFit="cover"
          className="transition-transform duration-300 group-hover:scale-110"
         
          onError={(e) => { e.target.src = '/assets/placeholder.png'; }}
        />
      </div>
      <div className="p-5 flex flex-col flex-grow">
        <div className="flex items-center mb-2">
          {/* Moved Veg/Non-Veg Indicator (Text) after the name */}
          <h3 className="text-xl font-semibold text-gray-800 truncate">{item.name}</h3>
          {typeof item.isVegetarian === 'boolean' && (
            <span 
              className={`text-xs font-semibold ml-2 px-1.5 py-0.5 rounded ${item.isVegetarian ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}
            >
              {item.isVegetarian ? 'Veg' : 'Non-Veg'}
            </span>
          )}
        </div>
        <p className="text-gray-600 text-sm mb-4 flex-grow">{item.description}</p>
        <div className="flex justify-between items-center mt-auto pt-4 border-t border-gray-100">
          <span className="text-lg font-bold text-green-600">₹{item.price}</span>
          <button 
            onClick={handleAddToCart}
            disabled={isAdding}
            className={`flex items-center justify-center px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ease-in-out ${isAdding ? 'bg-green-200 text-green-800' : 'bg-black text-white hover:bg-gray-800'}`}
          >
            {isAdding ? (
              <>
                <motion.span
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  Added!
                </motion.span>
              </>
            ) : (
              <>
                <ShoppingCartIcon className="h-4 w-4 mr-1.5" />
                Add to Cart
              </>
            )}
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default MenuItemCard;