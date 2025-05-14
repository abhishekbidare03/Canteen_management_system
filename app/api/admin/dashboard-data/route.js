// app/api/admin/dashboard-data/route.js
import { NextResponse } from 'next/server';
import clientPromise from '@/lib/db';
import { ObjectId } from 'mongodb'; // Assuming you use ObjectId for user IDs if needed

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const dateParam = searchParams.get('date'); // Expecting date in 'YYYY-MM-DD' format

  if (!dateParam) {
    return NextResponse.json({ error: 'Date parameter is required' }, { status: 400 });
  }

  try {
    const selectedDate = new Date(dateParam);
    if (isNaN(selectedDate.getTime())) {
      return NextResponse.json({ error: 'Invalid date format. Use YYYY-MM-DD.' }, { status: 400 });
    }

    // Set start and end of the selected day for querying
    const startOfDay = new Date(selectedDate);
    startOfDay.setUTCHours(0, 0, 0, 0);

    const endOfDay = new Date(selectedDate);
    endOfDay.setUTCHours(23, 59, 59, 999);

    const client = await clientPromise;
    // Ensure the database name is correct, fallback to 'baratieDB' if not set in .env
    const dbName = process.env.MONGODB_DB || 'baratieDB'; 
    const db = client.db(dbName);
    const ordersCollection = db.collection('orders');

    // Fetch orders within the selected date range
    const orders = await ordersCollection.find({
      orderDate: {
        $gte: startOfDay,
        $lte: endOfDay
      }
    }).toArray();

    // --- Calculate Total Revenue --- 
    const totalRevenue = orders.reduce((sum, order) => sum + order.totalAmount, 0);

    // --- Calculate Most Sold Items --- 
    const itemCounts = {};
    orders.forEach(order => {
      if (order.items && Array.isArray(order.items)) { // Add check for items array
        order.items.forEach(item => {
          if (item && item.name && typeof item.quantity === 'number') { // Add check for item structure
            itemCounts[item.name] = (itemCounts[item.name] || 0) + item.quantity;
          }
        });
      }
    });

    // Convert itemCounts to an array format suitable for Nivo Bar chart
    const mostSoldItemsData = Object.entries(itemCounts)
      .map(([name, quantity]) => ({ item: name, quantity }))
      .sort((a, b) => b.quantity - a.quantity); // Sort descending by quantity
      // Optionally limit the number of items shown: .slice(0, 10);

    // --- Prepare Revenue Data for Nivo Line Chart --- 
    // For a single day, the line chart only shows one point. 
    // Consider fetching data for a range (e.g., 7 days) for a more useful line chart.
    const revenueData = [
      {
        id: 'revenue',
        data: [
          { x: dateParam, y: totalRevenue } 
        ]
      }
    ];

    return NextResponse.json({
      revenueData,
      mostSoldItemsData
    });

  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    // Provide a more specific error message if possible
    return NextResponse.json({ error: `Failed to fetch dashboard data: ${error.message}` }, { status: 500 });
  }
}

// Ensure the route is treated as dynamic
export const dynamic = 'force-dynamic';