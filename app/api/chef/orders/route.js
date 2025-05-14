import { NextResponse } from 'next/server';
import clientPromise from '@/lib/db';
import { ObjectId } from 'mongodb';

export async function GET(request) {
  try {
    const client = await clientPromise;
    const db = client.db(); // Use your default DB configured in MONGO_URI
    const ordersCollection = db.collection('orders');

    // Fetch all orders, sorted by orderDate descending (newest first)
    const orders = await ordersCollection.find({}).sort({ orderDate: -1 }).toArray();

    // Convert ObjectId to string for client-side compatibility
    const ordersWithStringIds = orders.map(order => ({
      ...order,
      _id: order._id.toString(),
      // Ensure items also have string IDs if they are ObjectIds (adjust if needed based on your schema)
      items: order.items.map(item => ({
        ...item,
        // Assuming itemId might be an ObjectId, convert if necessary
        // itemId: item.itemId instanceof ObjectId ? item.itemId.toString() : item.itemId,
      }))
    }));

    return NextResponse.json(ordersWithStringIds, { status: 200 });
  } catch (error) {
    console.error('Error fetching chef orders:', error);
    return NextResponse.json({ message: 'Failed to fetch orders', error: error.message }, { status: 500 });
  }
}