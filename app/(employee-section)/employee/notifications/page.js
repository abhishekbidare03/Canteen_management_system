"use client";

import React from 'react';
import { BellIcon, SparklesIcon } from '@heroicons/react/24/outline';

// This component might receive notifications via props or context in the future
// For now, it's a placeholder showing how notifications *could* be displayed
const NotificationsPage = ({ notifications = [] }) => {

  // Placeholder data if not passed via props/context
  const displayNotifications = notifications.length > 0 ? notifications : [
    {
      id: 1,
      type: 'motivation',
      message: "☀️ Welcome! Let's make today great! 💪",
      timestamp: new Date(Date.now() - 60000 * 5), // 5 minutes ago
    },
    {
      id: 2,
      type: 'order',
      message: '🎉 Order #12 is ready! Please collect it. 🍽️',
      timestamp: new Date(Date.now() - 60000 * 2), // 2 minutes ago
    },
  ];

  const getIcon = (type) => {
    switch (type) {
      case 'order':
        return <BellIcon className="h-6 w-6 text-blue-500" />;
      case 'motivation':
        return <SparklesIcon className="h-6 w-6 text-yellow-500" />;
      default:
        return <BellIcon className="h-6 w-6 text-gray-500" />;
    }
  };

  const formatTime = (timestamp) => {
    return timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-6 border-b pb-4">Notifications</h1>
      
      {displayNotifications.length === 0 ? (
        <div className="text-center text-gray-500 py-10">
          <BellIcon className="h-12 w-12 mx-auto text-gray-400 mb-4" />
          <p>No notifications yet.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {displayNotifications.map((notif) => (
            <div 
              key={notif.id} 
              className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 flex items-start space-x-4"
            >
              <div className="flex-shrink-0 pt-1">
                {getIcon(notif.type)}
              </div>
              <div className="flex-grow">
                <p className="text-gray-800">{notif.message}</p>
                <p className="text-xs text-gray-500 mt-1">
                  {formatTime(notif.timestamp)}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default NotificationsPage;