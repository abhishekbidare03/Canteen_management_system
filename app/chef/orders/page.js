"use client";

import React, { useState, useEffect, useMemo } from 'react';
import Image from 'next/image';
import { toast, Toaster } from 'react-hot-toast';
import { ClockIcon, CurrencyRupeeIcon, CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/outline';
import Loader from '@/components/Loader'; // Assuming you have a Loader component

const ORDER_STATUSES = ['Placed', 'Preparing', 'Ready', 'Delivered', 'Cancelled'];

const ChefOrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [statusFilter, setStatusFilter] = useState('Placed'); // Default filter

  // Fetch orders on component mount
  useEffect(() => {
    const fetchOrders = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch('/api/chef/orders');
        if (!response.ok) {
          throw new Error(`Failed to fetch orders: ${response.statusText}`);
        }
        const data = await response.json();
        setOrders(data);
        // -- Remove initial selection logic from here --
        // const firstMatchingOrder = data.find(order => order.orderStatus === statusFilter);
        // setSelectedOrder(firstMatchingOrder || (data.length > 0 ? data[0] : null)); 
      } catch (err) {
        console.error(err);
        setError(err.message);
        toast.error(`Error fetching orders: ${err.message}`);
      } finally {
        setIsLoading(false);
      }
    };
    fetchOrders();
  }, []); // Fetch only once on mount

  // Effect to update selected order when orders or filter change
  useEffect(() => {
    if (orders.length > 0) {
      const firstMatchingOrder = orders.find(order => order.orderStatus === statusFilter);
      // Select the first matching order, or the very first order if no match for the current filter
      setSelectedOrder(firstMatchingOrder || orders[0]); 
    }
  }, [orders, statusFilter]); // Re-run when orders are fetched or filter changes

  // Filter orders based on selected status
  const filteredOrders = useMemo(() => {
    return orders.filter(order => order.orderStatus === statusFilter);
  }, [orders, statusFilter]);

  // Handle selecting an order from the list
  const handleSelectOrder = (order) => {
    setSelectedOrder(order);
  };

  // Handle updating order status
  const handleUpdateStatus = async (orderId, newStatus) => {
    if (!selectedOrder || selectedOrder._id !== orderId) {
        toast.error("Please select the order you wish to update.");
        return;
    }
    if (selectedOrder.orderStatus === newStatus) {
        toast.info(`Order is already marked as ${newStatus}.`);
        return;
    }

    const loadingToastId = toast.loading(`Updating status to ${newStatus}...`);
    try {
      const response = await fetch(`/api/chef/orders/${orderId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Failed to update status');
      }

      toast.success(`Order status updated to ${newStatus}!`, { id: loadingToastId });

      // Update local state
      setOrders(prevOrders =>
        prevOrders.map(order =>
          order._id === orderId ? { ...order, orderStatus: newStatus } : order
        )
      );
      // Update the selected order view as well
      setSelectedOrder(prevSelected => 
        prevSelected && prevSelected._id === orderId ? { ...prevSelected, orderStatus: newStatus } : prevSelected
      );

    } catch (err) {
      console.error('Error updating order status:', err);
      toast.error(`Update failed: ${err.message}`, { id: loadingToastId });
    }
  };

  // Function to get status color - adjust colors as needed for your theme
  const getStatusColor = (status) => {
    switch (status) {
      case 'Placed': return 'bg-blue-100 text-blue-700';
      case 'Preparing': return 'bg-yellow-100 text-yellow-700';
      case 'Ready': return 'bg-green-100 text-green-700';
      case 'Delivered': return 'bg-gray-100 text-gray-700';
      case 'Cancelled': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="flex"> {/* Removed h-[calc(100vh-theme(space.16))] */} 
      <Toaster position="top-center" reverseOrder={false} />
      {/* Left Column: Order List */}
      <div className="w-1/3 border-r border-gray-200 overflow-y-auto flex flex-col h-screen sticky top-0"> {/* Added h-screen and sticky top-0 */} 
        <div className="p-4 border-b border-gray-200 sticky top-0 bg-white z-10">
          <h2 className="text-xl font-semibold text-gray-800 mb-3">Orders</h2>
          {/* Status Filter Buttons - Ensure wrapping with w-full */}
          {/* Added w-full to reinforce container width */}
          <div className="flex flex-wrap gap-2 mb-3 w-full"> 
            {ORDER_STATUSES.map(status => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                // Ensure whitespace-nowrap is removed
                className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${ 
                  statusFilter === status
                    ? 'bg-indigo-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>

        {isLoading ? (
          <div className="flex-grow flex items-center justify-center">
            <Loader />
          </div>
        ) : error ? (
          <div className="flex-grow flex items-center justify-center p-4 text-red-600">
            Error: {error}
          </div>
        ) : filteredOrders.length === 0 ? (
            <div className="flex-grow flex items-center justify-center p-4 text-gray-500">
                No orders found with status {statusFilter}.
            </div>
        ) : (
          <ul className="divide-y divide-gray-200 flex-grow">
            {filteredOrders.map(order => (
              <li
                key={order._id}
                onClick={() => handleSelectOrder(order)}
                className={`p-4 cursor-pointer hover:bg-gray-50 ${selectedOrder?._id === order._id ? 'bg-indigo-50' : ''}`}
              >
                <div className="flex justify-between items-center mb-1">
                  <span className="font-semibold text-gray-800">Order #{order.dailyOrderNumber || order._id.slice(-6)}</span>
                  <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${getStatusColor(order.orderStatus)}`}>
                    {order.orderStatus}
                  </span>
                </div>
                <div className="flex justify-between items-center text-sm text-gray-500">
                  <span className="flex items-center">
                    <ClockIcon className="h-4 w-4 mr-1" />
                    {new Date(order.orderDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                  <span className="flex items-center font-medium text-gray-700">
                    <CurrencyRupeeIcon className="h-4 w-4 mr-0.5" />
                    {order.totalAmount.toFixed(2)}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Right Column: Order Details */}
      <div className="w-2/3 p-6 overflow-y-auto h-screen"> {/* Added h-screen */} 
        {selectedOrder ? (
          <div className="relative">
            {/* Decorative background */}
            <div className="absolute inset-0 pointer-events-none z-0">
              <div className="w-40 h-40 bg-indigo-100 rounded-full blur-2xl opacity-60 absolute -top-10 -left-10 animate-pulse"></div>
              <div className="w-32 h-32 bg-pink-100 rounded-full blur-2xl opacity-50 absolute bottom-0 right-0 animate-pulse delay-200"></div>
            </div>
            <div className="relative z-10">
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-2xl font-extrabold text-black tracking-tight flex items-center gap-2">
                  <span>Order Details</span>
                  <CheckCircleIcon className="h-6 w-6 text-green-400" />
                </h2>
                {/* Status Update Dropdown/Buttons */}
                <div className="flex items-center space-x-2 bg-white/80 px-3 py-2 rounded-lg shadow border border-gray-100">
                  <span className="text-sm text-gray-900 font-semibold">Update Status:</span>
                  <select 
                    value={selectedOrder.orderStatus} 
                    onChange={(e) => handleUpdateStatus(selectedOrder._id, e.target.value)}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 bg-white text-gray-900 font-semibold"
                  >
                    {ORDER_STATUSES.map(status => (
                      <option key={status} value={status} disabled={status === 'Placed' && selectedOrder.orderStatus !== 'Placed'}>
                        {status}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Order Info Summary */}
              <div className="bg-gradient-to-r from-indigo-50 via-white to-pink-50 p-6 rounded-xl border border-indigo-100 mb-6 shadow flex flex-col md:flex-row gap-6">
                <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <p className="text-gray-500">Order ID</p>
                    <p className="font-bold text-indigo-700 text-lg">#{selectedOrder.dailyOrderNumber || selectedOrder._id.slice(-6)}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Date & Time</p>
                    <p className="font-medium text-gray-800">{new Date(selectedOrder.orderDate).toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Current Status</p>
                    <p className={`font-semibold px-2 py-0.5 rounded-full inline-block text-xs ${getStatusColor(selectedOrder.orderStatus)}`}>{selectedOrder.orderStatus}</p>
                  </div>
                </div>
                {/* Optionally add customer info or other summary here */}
              </div>

              {/* Order Items */}
              <h3 className="text-lg font-bold text-indigo-700 mb-3 flex items-center gap-2">
                <span>Items</span>
                <span className="bg-indigo-100 text-black px-2 py-0.5 rounded-full text-xs font-semibold">{selectedOrder.items.length}</span>
              </h3>
              <ul className="divide-y divide-gray-200 border-t border-b border-gray-200 mb-4 bg-white/80 rounded-lg shadow">
                {selectedOrder.items.map((item, index) => (
                  <li key={item.itemId || index} className="flex items-center py-4 px-2 hover:bg-indigo-50 transition">
                    <Image
                      src={item.imageSrc || '/assets/placeholder.png'}
                      alt={item.name}
                      width={56}
                      height={56}
                      className="rounded-lg object-cover mr-5 flex-shrink-0 border border-gray-200 shadow-sm"
                      onError={(e) => { e.target.src = '/assets/placeholder.png'; }}
                    />
                    <div className="flex-grow">
                      <p className="font-semibold text-gray-800 text-base">{item.name}</p>
                    </div>
                    <div className="text-right min-w-[70px]">
                      <p className="text-sm text-gray-600">x {item.quantity}</p>
                      <p className="font-bold text-black">
                        <CurrencyRupeeIcon className="h-4 w-4 inline-block mr-0.5 relative -top-px" />
                        {(item.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>

              {/* Order Total */}
              <div className="text-right mt-2">
                <p className="text-xl font-extrabold text-indigo-800">
                  Total: <CurrencyRupeeIcon className="h-5 w-5 inline-block mr-0.5 relative -top-px" />{selectedOrder.totalAmount.toFixed(2)}
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center h-full text-gray-500">
            {isLoading ? <Loader /> : 'Select an order from the list to view details.'}
          </div>
        )}
      </div>
    </div>
  );
};

export default ChefOrdersPage;