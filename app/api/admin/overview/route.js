// app/api/admin/overview/route.js
import { NextResponse } from 'next/server';
import clientPromise from '@/lib/db';
import { ObjectId } from 'mongodb';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const dateParam = searchParams.get('date'); // Expecting date in 'YYYY-MM-DD' format

  if (!dateParam) {
    return NextResponse.json({ error: 'Date parameter is required' }, { status: 400 });
  }

  let selectedDate;
  try {
    selectedDate = new Date(dateParam + 'T00:00:00Z'); // Ensure parsing as UTC start of day
    if (isNaN(selectedDate.getTime())) {
      throw new Error('Invalid date format');
    }
  } catch (e) {
    return NextResponse.json({ error: 'Invalid date format. Use YYYY-MM-DD.' }, { status: 400 });
  }

  // Set start and end of the selected day (UTC)
  const startOfDay = new Date(selectedDate);
  startOfDay.setUTCHours(0, 0, 0, 0);

  const endOfDay = new Date(selectedDate);
  endOfDay.setUTCHours(23, 59, 59, 999);

  try {
    const client = await clientPromise;
    const dbName = process.env.MONGODB_DB || 'baratieDB';
    const db = client.db(dbName);
    const ordersCollection = db.collection('orders');
    const usersCollection = db.collection('users'); // Assuming 'users' collection name

    // --- Aggregation for Stats and Items --- 
    const aggregationResult = await ordersCollection.aggregate([
      {
        $match: {
          orderDate: { $gte: startOfDay, $lte: endOfDay }
        }
      },
      {
        $unwind: "$items" // Deconstruct the items array
      },
      {
        $group: {
          _id: null, // Group all documents for the day together
          totalRevenue: { $sum: "$totalAmount" }, // Sum totalAmount (Note: This sums per item unwind, needs adjustment)
          totalOrdersSet: { $addToSet: "$_id" }, // Collect unique order IDs
          allItems: { $push: "$items" } // Collect all items
        }
      }
    ]).toArray();

    let totalRevenue = 0;
    let totalOrders = 0;
    let topSoldItems = [];

    if (aggregationResult.length > 0) {
      const dailyData = aggregationResult[0];
      totalOrders = dailyData.totalOrdersSet.length;

      // Recalculate totalRevenue based on unique orders
      const uniqueOrderIds = dailyData.totalOrdersSet;
      const revenueOrders = await ordersCollection.find({ _id: { $in: uniqueOrderIds } }).project({ totalAmount: 1 }).toArray();
      totalRevenue = revenueOrders.reduce((sum, order) => sum + order.totalAmount, 0);

      // Calculate Top Sold Items from allItems
      const itemCounts = {};
      dailyData.allItems.forEach(item => {
        if (item && item.name && typeof item.quantity === 'number') {
          itemCounts[item.name] = (itemCounts[item.name] || 0) + item.quantity;
        }
      });
      topSoldItems = Object.entries(itemCounts)
        .map(([name, quantity]) => ({ id: name, label: name, value: quantity })) // Format for Nivo Pie
        .sort((a, b) => b.value - a.value)
        .slice(0, 7); // Limit to top 7 items
    }

    // --- Fetch Detailed Orders with User Info --- 
    const detailedOrders = await ordersCollection.aggregate([
      {
        $match: {
          orderDate: { $gte: startOfDay, $lte: endOfDay }
        }
      },
      {
        // Convert userId string to ObjectId for lookup
        $addFields: {
          convertedUserId: {
            $cond: {
              if: {
                $and: [
                  { $ne: ["$userId", null] },
                  { $eq: [{ $strLenBytes: "$userId" }, 24] }, 
                  { $regexMatch: { input: "$userId", regex: /^[0-9a-fA-F]{24}$/ } } 
                ]
              },
              then: { $toObjectId: "$userId" }, 
              else: null 
            }
          }
        }
      },
      {
        $lookup: {
          from: 'employees', // Changed from 'users' to 'employees'
          localField: 'convertedUserId', 
          foreignField: '_id',
          as: 'userDetails'
        }
      },
      // Log after lookup
      {
        $addFields: {
          log_userDetails: "$userDetails" // Add userDetails to log
        }
      },
      {
        $unwind: {
          path: "$userDetails",
          preserveNullAndEmptyArrays: true 
        }
      },
      {
        $project: {
          _id: 0,
          orderId: "$_id",
          // Log values before assignment
          log_name: { $ifNull: ["$userDetails.name", "N/A_Log"] },
          log_email: { $ifNull: ["$userDetails.email", "N/A_Log"] },
          log_status: { $ifNull: ["$orderStatus", "Status_Missing_Log"] }, // Read from orderStatus
          // Actual projected fields
          employeeName: { $ifNull: ["$userDetails.name", "N/A"] },
          employeeEmail: { $ifNull: ["$userDetails.email", "N/A"] },
          orderDate: 1,
          totalAmount: 1,
          status: { $ifNull: ["$orderStatus", "Unknown"] } // Read from orderStatus, project as status
        }
      },
      { $sort: { orderDate: -1 } } 
    ]).toArray();

    // Log the final detailedOrders array
    console.log('Final detailedOrders:', JSON.stringify(detailedOrders, null, 2));

    return NextResponse.json({
      totalRevenue,
      totalOrders,
      topSoldItems, 
      detailedOrders
    });

  } catch (error) {
    console.error('Error fetching overview data:', error);
    return NextResponse.json({ error: `Failed to fetch overview data: ${error.message}` }, { status: 500 });
  }
}

// Ensure the route is treated as dynamic
export const dynamic = 'force-dynamic';