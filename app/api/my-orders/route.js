import { NextResponse } from 'next/server';
import clientPromise from '@/lib/db';
import { cookies } from 'next/headers';

export async function GET(request) {
  // Get the userId from the request cookies or query parameters
  const cookieStore = cookies();
  const authCookie = cookieStore.get('userId');
  
  // Extract userId from URL query params as fallback
  const { searchParams } = new URL(request.url);
  const queryUserId = searchParams.get('userId');
  
  // Use cookie value, query param, or null if neither exists
  const userId = authCookie?.value || queryUserId || null;
  
  console.log(`Fetching orders for userId: ${userId}`);
  
  if (!userId) {
    return NextResponse.json({ message: 'User not authenticated' }, { status: 401 });
  }

  try {
    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB || 'baratieDB');
    const ordersCollection = db.collection('orders');
    const menuItemsCollection = db.collection('menuItems'); // Need access to menuItems

    // Use aggregation pipeline to fetch orders and populate item details
    console.log(`[API /my-orders] Starting aggregation for userId: ${userId}`);
    const pipeline = [
      { $match: { userId: userId } }, // Filter by user
      { $sort: { orderDate: -1 } }, // Sort by date
      { $unwind: '$items' }, // Deconstruct the items array
      {
        $lookup: { // Join with menuItems collection
          from: 'menuItems',
          localField: 'items.itemId', // Field from orders.items
          foreignField: '_id',      // Field from menuItems
          as: 'itemDetails'         // Output array field name
        }
      },
      { 
        $unwind: { // Use preserveNullAndEmptyArrays to keep orders even if lookup fails
          path: '$itemDetails', 
          preserveNullAndEmptyArrays: true 
        } 
      },
      {
        $addFields: { // Add imageUrl and potentially overwrite name/price from menuItem
          'items.imageUrl': { $ifNull: ['$itemDetails.imageUrl', null] }, // Use null if lookup failed
          'items.name': { $ifNull: ['$itemDetails.name', '$items.name'] }, // Keep original name if lookup failed
          // 'items.price': { $ifNull: ['$itemDetails.price', '$items.price'] }, // Keep original price if lookup failed
        }
      },
      {
        $group: { // Group back by order ID
          _id: '$_id',
          userId: { $first: '$userId' },
          orderDate: { $first: '$orderDate' },
          totalAmount: { $first: '$totalAmount' },
          orderStatus: { $first: '$orderStatus' },
          dailyOrderNumber: { $first: '$dailyOrderNumber' }, // Keep other order fields
          items: { $push: '$items' } // Push the enriched items back into an array
        }
      },
      { $sort: { orderDate: -1 } }, // Re-sort after grouping
      {
        $project: { // Convert _id to string in the final output
          _id: { $toString: '$_id' },
          userId: 1,
          orderDate: 1,
          totalAmount: 1,
          orderStatus: 1,
          dailyOrderNumber: 1,
          items: 1
        }
      }
    ];
    
    console.log('[API /my-orders] Aggregation Pipeline:', JSON.stringify(pipeline, null, 2));
    const ordersWithDetails = await ordersCollection.aggregate(pipeline).toArray();

    console.log(`[API /my-orders] Aggregation completed. Found ${ordersWithDetails.length} orders for userId: ${userId}`);
    // Optional: Log the first order details to check structure
    if (ordersWithDetails.length > 0) {
      console.log('[API /my-orders] First order details:', JSON.stringify(ordersWithDetails[0], null, 2));
    }

    return NextResponse.json(ordersWithDetails, { status: 200 });

  } catch (error) {
    console.error(`Error fetching orders for userId ${userId}:`, error);
    return NextResponse.json({ message: 'Failed to fetch orders', error: error.message }, { status: 500 });
  }
}