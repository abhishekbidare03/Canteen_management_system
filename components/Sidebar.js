"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation'; 
import { motion } from 'framer-motion'; // Restore motion import
import toast, { Toaster } from 'react-hot-toast'; 
import {
  HomeIcon,
  BellIcon, 
  ClipboardDocumentListIcon, 
  ArrowLeftOnRectangleIcon, 
  CakeIcon, 
  SparklesIcon, 
  CubeIcon, 
  BeakerIcon, 
  FireIcon, 
  GlobeAltIcon
} from '@heroicons/react/24/outline';
import { ShoppingBagIcon } from '@heroicons/react/24/outline'; 
import FloatingPirateIcons from './FloatingPirateIcons.js'; 

const Sidebar = () => {
  const pathname = usePathname(); 
  const router = useRouter(); 

  // Hardcoded categories based on Prompt 6, pointing to new dynamic routes
  const foodCategories = [
    { name: 'Indian', href: '/food/Indian', icon: FireIcon },
    { name: 'Korean', href: '/food/Korean', icon: GlobeAltIcon },
    { name: 'Chinese', href: '/food/Chinese', icon: SparklesIcon },
    { name: 'Italian', href: '/food/Italian', icon: CakeIcon },
    { name: 'Desserts', href: '/food/Desserts', icon: CubeIcon },
    { name: 'Milkshake', href: '/food/Milkshake', icon: BeakerIcon },
    { name: 'Soft Drinks', href: '/food/Soft Drinks', icon: BeakerIcon }, // Reusing BeakerIcon
  ];

  const navItems = [
    { name: 'Home', href: '/employee', icon: HomeIcon },
    // Food categories will be inserted separately below
    { name: 'Notifications', href: '/employee/notifications', icon: BellIcon },
    // Corrected My Orders link path
    { name: 'My Orders', href: '/my-orders', icon: ClipboardDocumentListIcon }, // Corrected path
    // Logout is now handled by a button, removed from navItems
    // { name: 'Logout', href: '/logout', icon: ArrowLeftOnRectangleIcon },
  ];

  const handleLogout = () => {
    // Simulate logout (clear tokens, session, etc.)
    console.log("Logging out..."); 
    // In a real app, call an API endpoint here
    
    // Clear any client-side auth state if necessary
    // localStorage.removeItem('authToken');

    toast.success('Logout successful!');

    // Redirect to the root page after a short delay
    setTimeout(() => {
      router.push('/');
    }, 1000); // 1 second delay
  };

  // Restore variants
  const sidebarVariants = {
    hidden: { x: -250 },
    visible: { 
      x: 0,
      transition: { type: 'spring', stiffness: 50, damping: 15 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: { duration: 0.3 }
    }
  };

  const subMenuVariants = {
    hidden: { height: 0, opacity: 0 },
    visible: { 
      height: 'auto', 
      opacity: 1,
      transition: { duration: 0.3, ease: "easeInOut" }
    }
  };

  return (
    // Restore motion.aside and animation props
    <motion.aside 
      className="w-52 bg-white/90 backdrop-blur-sm flex flex-col min-h-screen p-4 shadow-lg relative overflow-hidden" 
      variants={sidebarVariants} // Restored
      initial="hidden" // Restored
      animate="visible" // Restored
    >
      <div className="relative z-10 flex flex-col flex-grow bg-white/90"> 
        <FloatingPirateIcons /> 
        <nav className="flex-grow mt-4">
          <ul className="space-y-2">
            {/* Standard Nav Items - Restore motion.li */}
            {navItems.map((item, index) => (
              <motion.li 
                key={item.name}
                variants={itemVariants} // Restored
                initial="hidden" // Restored
                animate="visible" // Restored
                transition={{ delay: 0.1 * index + 0.1 }} // Restored
              >
                <Link 
                  href={item.href} 
                  className={`flex items-center px-3 py-2.5 rounded-lg text-gray-700 hover:bg-gray-100 hover:text-gray-900 transition-colors duration-200 ease-in-out group ${pathname === item.href || (item.href !== '/employee' && pathname.startsWith(item.href)) ? 'bg-indigo-100 text-indigo-700 font-semibold' : ''}`}
                >
                  <item.icon className="h-5 w-5 mr-3 text-gray-500 group-hover:text-gray-700" />
                  <span className="text-lg font-medium group-hover:font-semibold">{item.name}</span>
                </Link>
              </motion.li>
            ))}
            
            {/* Logout Button - Restore motion.li */}
            <motion.li
              variants={itemVariants} // Restored
              initial="hidden" // Restored
              animate="visible" // Restored
              transition={{ delay: 0.1 * navItems.length + 0.1 }} // Restored
            >
              <button
                onClick={handleLogout}
                className={`flex items-center w-full px-3 py-2.5 rounded-lg text-gray-700 hover:bg-red-100 hover:text-red-700 transition-colors duration-200 ease-in-out group`}
              >
                <ArrowLeftOnRectangleIcon className="h-5 w-5 mr-3 text-gray-500 group-hover:text-red-600" />
                <span className="text-lg font-medium group-hover:font-semibold">Logout</span>
              </button>
            </motion.li>
          </ul>

          {/* Food Category Links - Restore motion.li */}
          <div className="pt-4 mt-4 border-t border-gray-200">
            <h3 className="px-3 mb-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">Food Menu</h3>
            <ul className="space-y-1">
              {foodCategories.map((category, index) => (
                <motion.li 
                  key={category.name}
                  variants={itemVariants} // Restored
                  initial="hidden" // Restored
                  animate="visible" // Restored
                  transition={{ delay: 0.1 * (navItems.length + index) + 0.1 }} // Restored
                >
                  <Link 
                    href={category.href} 
                    className={`flex items-center px-3 py-2 rounded-lg text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-colors duration-150 ease-in-out group ${pathname === category.href ? 'bg-indigo-100 text-indigo-700 font-semibold' : ''}`}
                  >
                    <category.icon className="h-5 w-5 mr-3 text-gray-500 group-hover:text-gray-700" />
                    <span className="text-base font-medium group-hover:font-semibold">{category.name}</span>
                  </Link>
                </motion.li>
              ))}
            </ul>
          </div>
        </nav>
        <div className="mt-auto">
          {/* Optional: Add content here if needed */}
        </div>
        <Toaster position="top-center" /> 
      </div> 
    </motion.aside>
  );
};

export default Sidebar;