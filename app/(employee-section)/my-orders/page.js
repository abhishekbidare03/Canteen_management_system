"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Loader from '@/components/Loader';
import { ChevronDownIcon, ChevronUpIcon, AdjustmentsHorizontalIcon, XMarkIcon } from '@heroicons/react/24/outline';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css'; // Import datepicker CSS

// Helper function to format date
const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  try {
    return new Date(dateString).toLocaleDateString('en-GB', { 
      day: '2-digit', month: '2-digit', year: 'numeric' 
    });
  } catch (error) {
    return 'Invalid Date';
  }
};

// Helper function to format currency (assuming INR)
const formatCurrency = (amount) => {
  return `₹${amount.toFixed(2)}`;
};

// Component for a single order row
function OrderRow({ order }) {
  const [isOpen, setIsOpen] = useState(false);

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'placed':
        return 'text-blue-600 bg-blue-100';
      case 'processing':
        return 'text-yellow-600 bg-yellow-100';
      case 'delivered':
        return 'text-green-600 bg-green-100';
      case 'cancelled':
      case 'expired': // Treat expired like cancelled for styling
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg mb-3 overflow-hidden shadow-sm">
      {/* Collapsed Row */}
      {/* Increased horizontal padding (px-6), kept vertical padding (py-4) */}
      {/* Restructured to have 5 direct children for justify-between */}
      <div 
        className="flex items-center justify-between px-6 py-4 cursor-pointer hover:bg-gray-50 transition-colors duration-150" 
        onClick={() => setIsOpen(!isOpen)}
      >
        {/* Element 1: Order Number */}
        <span className="font-medium text-gray-800 text-sm">Order #{order.dailyOrderNumber}</span>
        
        {/* Element 2: Status */}
        <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${getStatusColor(order.orderStatus)}`}>
          {order.orderStatus || 'Unknown'}
        </span>
        
        {/* Element 3: Date */}
        <span className="text-sm text-gray-600">{formatDate(order.orderDate)}</span>
        
        {/* Element 4: Price */}
        <span className="font-medium text-gray-800 text-sm">{formatCurrency(order.totalAmount)}</span>
        
        {/* Element 5: Icon */}
        {isOpen ? <ChevronUpIcon className="h-5 w-5 text-gray-500" /> : <ChevronDownIcon className="h-5 w-5 text-gray-500" />}
      </div>

      {/* Expanded Details */}
      {isOpen && (
        // Increased horizontal padding from p-4 to px-6, kept vertical py-4
        <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
          <h4 className="text-sm font-semibold mb-3 text-gray-700">Items:</h4>
          <div className="space-y-3">
            {order.items && order.items.length > 0 ? (
              order.items.map((item, index) => (
                // Added justify-between to the item row itself
                <div key={index} className="flex items-center justify-between text-sm">
                  {/* Left side: Image and Name */}
                  <div className="flex items-center space-x-4"> {/* Increased space-x-3 to space-x-4 */}
                    <div className="w-10 h-10 bg-gray-100 rounded overflow-hidden relative flex-shrink-0">
                      <Image 
                        src={item.imageUrl || '/assets/placeholder.png'} 
                        alt={item.name}
                        layout="fill"
                        objectFit="cover"
                        onError={(e) => { e.target.src = '/assets/placeholder.png'; }} 
                      />
                    </div>
                    <span className="text-gray-800 font-medium">{item.name}</span>
                  </div>
                  {/* Right side: Quantity and Price */}
                  <div className="flex items-center space-x-8"> {/* Increased space-x-6 to space-x-8 */}
                    <span className="text-gray-500">x{item.quantity}</span>
                    <span className="text-gray-700 w-20 text-right">{formatCurrency(item.price)}</span> {/* Increased width w-16 to w-20 */}
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-500">No items found in this order.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// Main Page Component
export default function MyOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      setError(null);
      let response;
      try {
        // Get the userId from localStorage
        const userId = localStorage.getItem('userId');
        if (!userId) {
          setError('User not authenticated. Please log in again.');
          setLoading(false);
          return;
        }

        response = await fetch(`/api/my-orders?timestamp=${new Date().getTime()}&userId=${userId}`, {
          cache: 'no-store',
        });

        if (!response.ok) {
          let errorData = { message: `HTTP error! Status: ${response.status}` };
          try {
            // Attempt to parse error response body
            const body = await response.json();
            errorData = { ...errorData, ...body }; 
          } catch (e) {
            // If parsing fails, use the text content if available
            try {
                const text = await response.text();
                errorData.responseText = text;
            } catch (textErr) {
                // Ignore if text also fails
            }
            console.warn('Could not parse error response as JSON:', e);
          }
          console.error('Fetch error details:', {
            status: response.status,
            statusText: response.statusText,
            headers: Object.fromEntries(response.headers.entries()),
            errorData: errorData
          });
          throw new Error(errorData.message || 'Failed to fetch orders');
        }
        const data = await response.json();
        console.log('Raw data from /api/my-orders:', data); // Added debug log
        setOrders(data);
      } catch (err) {
        console.error('Full error in fetchOrders:', err);
        // If err already has details from the !response.ok block, use them
        let detailedMessage = err.message || 'An unexpected error occurred while fetching orders.';
        if (err.errorData && err.errorData.message) {
            detailedMessage = err.errorData.message;
        } else if (err.errorData && err.errorData.responseText) {
            detailedMessage = `${detailedMessage} Server response: ${err.errorData.responseText.substring(0, 100)}...`;
        }
        setError(detailedMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  // Debug: Log orders and filter dates
  // console.log('All orders:', orders);
  // console.log('Filter startDate:', startDate, 'endDate:', endDate);
  // Filter orders based on selected date range
  const filteredOrders = (!startDate && !endDate)
    ? orders // No filter: show all orders
    : orders.filter(order => {
        if (!startDate || !endDate) return true;
        try {
          const orderDateObj = new Date(order.orderDate);
          const orderLocal = new Date(orderDateObj.getFullYear(), orderDateObj.getMonth(), orderDateObj.getDate());
          const startLocal = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate());
          const endLocal = new Date(endDate.getFullYear(), endDate.getMonth(), endDate.getDate());
          // Debug: Log each comparison
          // console.log('Order:', order, 'orderLocal:', orderLocal, 'startLocal:', startLocal, 'endLocal:', endLocal);
          return orderLocal >= startLocal && orderLocal <= endLocal;
        } catch (e) {
          console.error("Error parsing/filtering order date:", order.orderDate, e);
          return false;
        }
      });

  const clearDates = () => {
    setStartDate(null);
    setEndDate(null);
    setShowDatePicker(false);
  };

  return (
    // Removed bg-gray-100, as it's handled by the layout's <main> tag
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl md:text-3xl font-semibold text-gray-900">My Orders</h1>
          <div className="relative">
            <button 
              onClick={() => setShowDatePicker(!showDatePicker)}
              className="flex items-center space-x-2 px-4 py-2 bg-white border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <AdjustmentsHorizontalIcon className="h-5 w-5 text-gray-500" />
              <span>{startDate && endDate ? `Filtered: ${formatDate(startDate)} - ${formatDate(endDate)}` : 'Filter by Date'}</span>
            </button>
            {showDatePicker && (
              <div className="absolute right-0 mt-2 w-72 bg-white border border-gray-300 rounded-md shadow-lg z-10 p-4">
                <p className="text-sm font-medium mb-2">Select Date Range:</p>
                <div className="mb-2">
                  <DatePicker
                    selected={startDate}
                    onChange={(date) => setStartDate(date)}
                    selectsStart
                    startDate={startDate}
                    endDate={endDate}
                    placeholderText="Start Date"
                    className="w-full border border-gray-300 rounded px-2 py-1 text-sm"
                    dateFormat="dd/MM/yyyy"
                  />
                </div>
                <div className="mb-3">
                  <DatePicker
                    selected={endDate}
                    onChange={(date) => setEndDate(date)}
                    selectsEnd
                    startDate={startDate}
                    endDate={endDate}
                    minDate={startDate} // Prevent selecting end date before start date
                    placeholderText="End Date"
                    className="w-full border border-gray-300 rounded px-2 py-1 text-sm"
                    dateFormat="dd/MM/yyyy"
                  />
                </div>
                <div className="flex justify-end space-x-2">
                  <button 
                    onClick={clearDates}
                    className="px-3 py-1 text-sm text-gray-600 hover:bg-gray-100 rounded-md border border-gray-300"
                  >
                    Clear
                  </button>
                  <button 
                    onClick={() => setShowDatePicker(false)} 
                    className="px-3 py-1 text-sm bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                  >
                    Apply
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {loading && <Loader />}
        {error && <div className="text-center text-red-500 bg-red-100 p-4 rounded-md">Error: {error}</div>}
        {!loading && !error && filteredOrders.length === 0 && (
          <div className="text-center text-gray-500 py-10">
            <Image src="/empty-box.svg" alt="No orders found" width={128} height={128} className="mx-auto mb-4 opacity-70" />
            <p className="text-xl">No orders found.</p>
            <p className="text-sm text-gray-400">Looks like you havent placed any orders {startDate && endDate ? 'in this period' : 'yet'}.</p>
          </div>
        )}
        {!loading && !error && filteredOrders.length > 0 && (
          <div className="space-y-3">
            {filteredOrders.map(order => (
              <OrderRow key={order._id} order={order} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}