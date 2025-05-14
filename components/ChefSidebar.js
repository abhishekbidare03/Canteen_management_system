"use client";

import React from 'react';
import Link from 'next/link';
import Image from 'next/image'; // Import Image for user avatar
import { usePathname, useRouter } from 'next/navigation';
import { 
  HomeIcon, 
  PlusCircleIcon, 
  QueueListIcon, 
  ArrowLeftStartOnRectangleIcon,
  ClipboardDocumentListIcon, // Added import
  Cog6ToothIcon // Added import
} from '@heroicons/react/24/outline';
import { toast, Toaster } from 'react-hot-toast';
import { motion } from 'framer-motion'; // Import motion
import FloatingPirateIcons from './FloatingPirateIcons'; // Import the floating icons

const ChefSidebar = () => {
  const pathname = usePathname();
  const router = useRouter();

  // Placeholder user info - replace with actual data fetching later
  const chefInfo = {
    name: 'Sanji', // Placeholder name
    avatar: '/Profile_pic.png' // Updated avatar path
  };

  const navItems = [
    { name: 'Orders', href: '/chef/orders', icon: ClipboardDocumentListIcon }, // Changed icon
    { name: 'Add Item', href: '/chef/add-item', icon: PlusCircleIcon }, // Corrected name and href
    // { name: 'Product List', href: '/chef/product-list', icon: QueueListIcon }, // Removed Product List
    // Add Menu Management here if needed, or remove the placeholder below
    { name: 'Menu Management', href: '/chef/menu-management', icon: Cog6ToothIcon }, 
    // Logout is handled by a button below
  ];

  const handleLogout = () => {
    // Simulate logout (replace with actual logic if needed)
    console.log('Chef logging out...');
    toast.success('Logout successful!');
    setTimeout(() => {
      router.push('/'); // Redirect to home/login page
    }, 1000); // Delay for toast visibility
  };

  // Animation variants
  const sidebarVariants = {
    hidden: { x: '-100%' }, // Start off-screen to the left
    visible: { 
      x: 0, // Slide in to position 0
      transition: { type: 'spring', stiffness: 50, damping: 20 } // Smooth spring animation
    }
  };

  return (
    // Wrap with motion.aside and apply variants
    <motion.aside 
      // Removed relative, kept fixed, overflow-hidden, bg-white/90, backdrop-blur
      className="w-56 bg-white/90 backdrop-blur-sm flex flex-col h-screen fixed top-0 left-0 z-30 shadow-lg border-r border-gray-200 overflow-hidden"
      variants={sidebarVariants}
      initial="hidden"
      animate="visible"
    >
      <FloatingPirateIcons /> {/* Add the floating icons background */}
      {/* Ensure main content is above icons */}
      <div className="relative z-10 flex flex-col flex-grow">
      <Toaster position="top-center" reverseOrder={false} />
      {/* User Info Section - Added subtle gradient, increased size & font */}
      <div className="flex items-center p-5 border-b border-gray-200 bg-gradient-to-r from-white/90 to-gray-50/90">
        {/* Increased avatar size (w-12 h-12), increased margin (mr-4) */}
        <div className="relative w-18 h-16 rounded-full overflow-hidden mr-4 flex-shrink-0 shadow-md border-2 border-white">
          <Image 
            src={chefInfo.avatar}
            alt={chefInfo.name}
            layout="fill"
            objectFit="cover"
            onError={(e) => { e.target.src = '/assets/placeholder.png'; }} // Fallback
          />
        </div>
        <div>
          {/* Increased name font size (text-lg) */}
          <p className="text-xl font-semibold text-gray-900">{chefInfo.name}</p>
          {/* Increased role font size (text-sm) */}
          <p className="text-sm text-gray-600">Chef</p> {/* Role */} 
        </div>
      </div>
      {/* Navigation */}
      <nav className="flex-grow p-4 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname.startsWith(item.href);
          return (
            <Link
              key={item.name}
              href={item.href}
              // Use employee sidebar active style: bg-indigo-100, text-indigo-700, font-semibold
              // Enhanced hover state: hover:bg-indigo-50 hover:text-indigo-700
              className={`flex items-center px-3 py-2.5 rounded-lg transition-colors duration-200 group ${ 
                isActive
                  ? 'bg-indigo-100 text-indigo-700 font-semibold' 
                  : 'text-gray-700 hover:bg-indigo-50 hover:text-indigo-700'
              }`}
            >
              
              {isActive && (
                <span className="absolute left-0 top-0 bottom-0 w-1 bg-indigo-600 rounded-r-full"></span>
              )}
              
              <item.icon className={`h-5 w-5 mr-3 flex-shrink-0 ${isActive ? 'text-indigo-600' : 'text-gray-500 group-hover:text-indigo-600'}`} />
              
              <span className="text-lg font-medium">{item.name}</span>
            </Link>
          );
        })}
        {/* Remove the duplicate Navigation Links section below */}
        {/* 
        <nav className="mt-6">
          <ul>
            {/* Remove commented out Dashboard Link */}
            {/* 
            <li>
              <Link href="/chef" className={`flex items-center px-4 py-2.5 rounded-lg transition-colors duration-200 ${pathname === '/chef' ? activeLinkClasses : inactiveLinkClasses}`}>
                {pathname === '/chef' && <span className="absolute left-0 w-1 bg-indigo-600 h-full rounded-r-full"></span>}
                <HomeIcon className={`h-5 w-5 mr-3 ${pathname === '/chef' ? 'text-indigo-600' : 'text-gray-500'}`} />
                <span className={pathname === '/chef' ? 'font-semibold text-gray-900' : 'text-gray-700'}>Dashboard</span>
              </Link>
            </li> 
            */}
        
            {/* Orders Link - Apply consistent active/inactive styling */}
            {/* 
            <li>
              <Link 
                href="/chef/orders" 
                className={`flex items-center px-4 py-2.5 rounded-lg transition-colors duration-200 relative group ${ 
                  pathname.startsWith('/chef/orders')
                    ? 'font-semibold text-gray-900' 
                    : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                }`}
              >
                {pathname.startsWith('/chef/orders') && <span className="absolute left-0 top-0 bottom-0 w-1 bg-indigo-600 rounded-r-full"></span>}
                <ClipboardDocumentListIcon className={`h-5 w-5 mr-3 flex-shrink-0 ${pathname.startsWith('/chef/orders') ? 'text-indigo-600 ml-2' : 'text-gray-500 group-hover:text-gray-700'}`} />
                <span className={`flex-1 ${pathname.startsWith('/chef/orders') ? 'ml-2' : ''}`}>Orders</span>
              </Link>
            </li>
            */}
        
            {/* Add Food Item Link - Apply consistent active/inactive styling */}
            {/* 
            <li>
              <Link 
                href="/chef/add-item" 
                className={`flex items-center px-4 py-2.5 rounded-lg transition-colors duration-200 relative group ${ 
                  pathname.startsWith('/chef/add-item')
                    ? 'font-semibold text-gray-900' 
                    : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                }`}
              >
                {pathname.startsWith('/chef/add-item') && <span className="absolute left-0 top-0 bottom-0 w-1 bg-indigo-600 rounded-r-full"></span>}
                <PlusCircleIcon className={`h-5 w-5 mr-3 flex-shrink-0 ${pathname.startsWith('/chef/add-item') ? 'text-indigo-600 ml-2' : 'text-gray-500 group-hover:text-gray-700'}`} />
                <span className={`flex-1 ${pathname.startsWith('/chef/add-item') ? 'ml-2' : ''}`}>Add Item</span>
              </Link>
            </li>
            */}
        
            {/* Menu Management Link (Placeholder) - Apply consistent active/inactive styling */}
            {/* 
            <li>
              <Link 
                href="/chef/menu-management" 
                className={`flex items-center px-4 py-2.5 rounded-lg transition-colors duration-200 relative group ${ 
                  pathname.startsWith('/chef/menu-management')
                    ? 'font-semibold text-gray-900' 
                    : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                }`}
              >
                {pathname.startsWith('/chef/menu-management') && <span className="absolute left-0 top-0 bottom-0 w-1 bg-indigo-600 rounded-r-full"></span>}
                <Cog6ToothIcon className={`h-5 w-5 mr-3 flex-shrink-0 ${pathname.startsWith('/chef/menu-management') ? 'text-indigo-600 ml-2' : 'text-gray-500 group-hover:text-gray-700'}`} />
                <span className={`flex-1 ${pathname.startsWith('/chef/menu-management') ? 'ml-2' : ''}`}>Menu Management</span>
              </Link>
            </li>
            */}
          {/* </ul>
        </nav> */}
      </nav> {/* Add closing tag for the outer nav */}
      {/* Logout Button */}
      <div className="p-4 border-t border-gray-200 mt-auto">
        <button
          onClick={handleLogout}
          // Apply styling similar to employee sidebar: red hover state
          className="flex items-center w-full px-3 py-2.5 rounded-lg text-sm font-medium text-gray-700 hover:bg-red-100 hover:text-red-700 transition-colors duration-200 group"
        >
          <ArrowLeftStartOnRectangleIcon className="h-5 w-5 mr-3 flex-shrink-0 text-gray-500 group-hover:text-red-600" />
          {/* Increase text size from default to text-lg */}
          <span className="text-lg font-medium">Logout</span>
        </button>
      </div>
      </div> {/* End of z-10 content wrapper */}
    </motion.aside> // Correct closing tag
  );
};

export default ChefSidebar;
// Remove the duplicate import block below
/*
import { 
  HomeIcon, 
  ClipboardDocumentListIcon, 
  Cog6ToothIcon, 
  ArrowLeftOnRectangleIcon, 
  UserCircleIcon,
  PlusCircleIcon // Added PlusCircleIcon
} from '@heroicons/react/24/outline';
*/
