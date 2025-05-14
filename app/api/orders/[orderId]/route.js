import { NextResponse } from 'next/server';
import { ObjectId } from 'mongodb'; // Import ObjectId
import clientPromise from '@/lib/db';

export async function GET(request, { params }) {
  // Await params before accessing properties (Next.js 15+)
  const awaitedParams = await params; 
  const { orderId } = awaitedParams;
  // const { orderId } = params; // Old synchronous access
  console.log(`--- Received GET request for orderId: ${orderId} ---`);

  if (!orderId || !ObjectId.isValid(orderId)) {
    console.error('Invalid Order ID received:', orderId);
    return NextResponse.json({ message: 'Invalid Order ID' }, { status: 400 });
  }

  try {
    console.log("Connecting to DB...");
    const client = await clientPromise;
    const dbName = process.env.MONGODB_DB || 'baratieDB';
    const db = client.db(dbName);
    console.log(`Connected to DB: ${dbName}`);
    const ordersCollection = db.collection('orders');
    console.log(`Using collection: orders`);

    // Find the order by its ObjectId
    const order = await ordersCollection.findOne({ _id: new ObjectId(orderId) });

    if (!order) {
      console.warn(`Order not found for ID: ${orderId}`);
      return NextResponse.json({ message: 'Order not found' }, { status: 404 });
    }

    console.log(`Order found:`, order);
    // Return the found order
    return NextResponse.json(order, { status: 200 });

  } catch (error) {
    console.error(`--- Error fetching order ${orderId} ---:`, error);
    return NextResponse.json({ message: 'Failed to fetch order', error: error.message }, { status: 500 });
  }
}