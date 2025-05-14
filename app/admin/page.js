'use client'
import React, { useState, useEffect } from "react";
import { ResponsivePie } from '@nivo/pie';
import { CalendarIcon } from '@heroicons/react/24/outline'; // For date picker icon
import { motion } from 'framer-motion'; // Import motion
import AdminFloatingBackground from "../../components/AdminFloatingBackground"; // Import AdminFloatingBackground

// Simple Table Component (can be moved to components folder later)
const OrdersTable = ({ orders }) => {
  if (!orders || orders.length === 0) {
    return <p className="text-center text-gray-500">No orders found for this date.</p>; // Removed dark:text-gray-400
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
      className="overflow-x-auto relative shadow-lg sm:rounded-lg bg-white"
    >
      <table className="w-full text-sm text-left text-gray-600">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50">
          <tr>
            <th scope="col" className="py-3 px-6">Order ID</th><th scope="col" className="py-3 px-6">Employee Name</th><th scope="col" className="py-3 px-6">Employee Email</th><th scope="col" className="py-3 px-6">Order Date</th><th scope="col" className="py-3 px-6">Status</th><th scope="col" className="py-3 px-6">Total Amount</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order, index) => (
            <motion.tr 
              key={order.orderId} 
              className="border-b hover:bg-gray-50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
            >
              <td className="py-4 px-6 font-medium text-gray-900 whitespace-nowrap">{order.orderId.toString().slice(-6)}...</td><td className="py-4 px-6">{order.employeeName}</td><td className="py-4 px-6">{order.employeeEmail}</td><td className="py-4 px-6">{new Date(order.orderDate).toLocaleString()}</td><td className="py-4 px-6"><span className={`px-2 py-1 rounded-full text-xs font-medium ${order.status === 'Completed' ? 'bg-green-100 text-green-800' : order.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-800'}`}>{order.status || 'N/A'}</span></td><td className="py-4 px-6 font-semibold">₹{order.totalAmount.toFixed(2)}</td>
            </motion.tr>
          ))}
        </tbody>
      </table>
    </motion.div>
  );
};

export default function AdminDashboard() {
  const [selectedDate, setSelectedDate] = useState(() => {
    const today = new Date();
    return today.toISOString().slice(0, 10);
  });

  const [overviewData, setOverviewData] = useState({ 
    totalRevenue: 0, 
    totalOrders: 0, 
    topSoldItems: [], 
    detailedOrders: [] 
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`/api/admin/overview?date=${selectedDate}`); 
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setOverviewData({
          totalRevenue: data.totalRevenue || 0,
          totalOrders: data.totalOrders || 0,
          topSoldItems: data.topSoldItems || [],
          detailedOrders: data.detailedOrders || []
        });
      } catch (e) {
        console.error("Failed to fetch overview data:", e);
        setError(`Failed to load data: ${e.message}`);
        setOverviewData({ totalRevenue: 0, totalOrders: 0, topSoldItems: [], detailedOrders: [] }); 
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [selectedDate]);

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <div className="min-h-screen"> 
      {/* Main content wrapper */}
      <div className="min-h-screen flex flex-col items-center py-8 px-4 sm:px-6 lg:px-8">
        {/* Background inside wrapper, before card */}
        <AdminFloatingBackground /> {/* Use AdminFloatingBackground */} 
        {/* Inner content card - add relative z-10 back */}
        <div className="bg-white p-6 rounded-xl shadow-xl w-full max-w-7xl relative z-10">
          {/* Header section */}
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 gap-4"
          >
            {/* Removed dark:text-white */} 
            <h1 className="text-3xl font-bold text-gray-800">Admin Dashboard</h1>
            <div className="relative">
              <input
                type="date"
                value={selectedDate}
                onChange={e => setSelectedDate(e.target.value)}
                // Removed dark mode classes from date input
                className="border border-gray-300 rounded-md pl-10 pr-3 py-2 text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 shadow-sm"
              />
              {/* Removed dark:text-gray-500 */} 
              <CalendarIcon className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2 pointer-events-none" />
            </div>
          </motion.div>

          {/* Loading and Error States */}
          {loading && (
            // Removed dark:text-gray-400
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center text-gray-500 py-10">
              Loading data...
            </motion.div>
          )}
          {error && (
            // Removed dark mode classes from error message
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center text-red-600 py-10 bg-red-100 rounded-md shadow">
              Error: {error}
            </motion.div>
          )}

          {/* Data Display Section */}
          {!loading && !error && (
            <motion.div 
              className="space-y-8"
              initial="hidden"
              animate="visible"
              variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
            >
              {/* Stats Cards */}
              <motion.div 
                className="grid grid-cols-1 sm:grid-cols-2 gap-6"
                variants={cardVariants}
              >
                <motion.div 
                  // Removed dark mode gradient classes
                  className="bg-gradient-to-r from-cyan-500 to-blue-500 rounded-lg p-6 shadow-lg text-white transform hover:scale-105 transition-transform duration-300"
                  variants={cardVariants}
                >
                  <h2 className="text-lg font-semibold mb-1">Total Revenue</h2>
                  <p className="text-3xl font-bold">₹{overviewData.totalRevenue.toFixed(2)}</p>
                </motion.div>
                <motion.div 
                  // Removed dark mode gradient classes
                  className="bg-gradient-to-r from-violet-500 to-purple-500 rounded-lg p-6 shadow-lg text-white transform hover:scale-105 transition-transform duration-300"
                  variants={cardVariants}
                >
                  <h2 className="text-lg font-semibold mb-1">Total Orders</h2>
                  <p className="text-3xl font-bold">{overviewData.totalOrders}</p>
                </motion.div>
              </motion.div>

              {/* Top Sold Items Pie Chart */}
              <motion.div 
                // Removed dark:bg-gray-800
                className="bg-white rounded-lg p-6 shadow-lg"
                variants={cardVariants}
              >
                {/* Removed dark:text-gray-200 */} 
                <h2 className="text-xl font-semibold mb-4 text-gray-700">Top Sold Items</h2>
                <div style={{ height: 350 }}>
                  {overviewData.topSoldItems.length > 0 ? (
                    <ResponsivePie
                      data={overviewData.topSoldItems}
                      margin={{ top: 40, right: 80, bottom: 80, left: 80 }}
                      innerRadius={0.5}
                      padAngle={0.7}
                      cornerRadius={3}
                      activeOuterRadiusOffset={8}
                      colors={{ scheme: 'nivo' }} // Use a predefined color scheme
                      borderWidth={1}
                      borderColor={{ from: 'color', modifiers: [ [ 'darker', 0.2 ] ] }}
                      arcLinkLabelsSkipAngle={10}
                      arcLinkLabelsTextColor="#333333" // Keep as is for light mode
                      arcLinkLabelsThickness={2}
                      arcLinkLabelsColor={{ from: 'color' }}
                      arcLabelsSkipAngle={10}
                      arcLabelsTextColor={{ from: 'color', modifiers: [ [ 'darker', 3 ] ] }}
                      theme={{
                        // Removed dark mode theme adjustments
                        legends: {
                          text: {
                            fill: '#333' // Adjusted legend text color for light mode
                          }
                        }
                      }}
                      defs={[
                          {
                              id: 'dots',
                              type: 'patternDots',
                              background: 'inherit',
                              color: 'rgba(0, 0, 0, 0.1)', // Adjusted pattern color for light bg
                              size: 4,
                              padding: 1,
                              stagger: true
                          },
                          {
                              id: 'lines',
                              type: 'patternLines',
                              background: 'inherit',
                              color: 'rgba(0, 0, 0, 0.1)', // Adjusted pattern color for light bg
                              rotation: -45,
                              lineWidth: 6,
                              spacing: 10
                          }
                      ]}
                      fill={[
                          // Example pattern fill - adjust based on actual data/preference
                          { match: { id: overviewData.topSoldItems[0]?.id }, id: 'dots' }, 
                          { match: { id: overviewData.topSoldItems[1]?.id }, id: 'lines' },
                      ]}
                      legends={[
                          {
                              anchor: 'bottom',
                              direction: 'row',
                              justify: false,
                              translateX: 0,
                              translateY: 56,
                              itemsSpacing: 0,
                              itemWidth: 100,
                              itemHeight: 18,
                              // itemTextColor: '#333', // Set via theme
                              itemDirection: 'left-to-right',
                              itemOpacity: 1,
                              symbolSize: 18,
                              symbolShape: 'circle',
                              effects: [
                                  {
                                      on: 'hover',
                                      style: {
                                          itemTextColor: '#000' // Hover color
                                      }
                                  }
                              ]
                          }
                      ]}
                    />
                  ) : (
                    // Removed dark:text-gray-400
                    <p className="text-center text-gray-500 pt-10">No items sold data for this date.</p>
                  )}
                </div>
              </motion.div>

              {/* Detailed Orders Table */} 
              <motion.div variants={cardVariants}>
                {/* Removed dark:text-gray-200 */} 
                <h2 className="text-xl font-semibold mb-4 text-gray-700">Detailed Orders</h2>
                <OrdersTable orders={overviewData.detailedOrders} />
              </motion.div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}