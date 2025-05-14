import { NextResponse } from 'next/server';
import clientPromise from '@/lib/db';
import { ObjectId } from 'mongodb';
// import { getIO, getEmployeeSockets } from '@/lib/socket'; // Removed Socket.IO import

// Define allowed order statuses
const ALLOWED_STATUSES = ['Placed', 'Preparing', 'Ready', 'Delivered', 'Cancelled'];

export async function PATCH(request, { params }) {
  // Await params before accessing properties
  const { orderId } = await params; 
  let newStatus;

  try {
    const body = await request.json();
    newStatus = body.status;

    if (!orderId) {
      return NextResponse.json({ message: 'Order ID is required' }, { status: 400 });
    }

    if (!newStatus || !ALLOWED_STATUSES.includes(newStatus)) {
      return NextResponse.json({ message: `Invalid status provided. Allowed statuses are: ${ALLOWED_STATUSES.join(', ')}` }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db();
    const ordersCollection = db.collection('orders');

    // Validate if orderId is a valid ObjectId
    let objectId;
    try {
      objectId = new ObjectId(orderId);
    } catch (error) {
      return NextResponse.json({ message: 'Invalid Order ID format' }, { status: 400 });
    }

    const result = await ordersCollection.updateOne(
      { _id: objectId },
      { $set: { orderStatus: newStatus } }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json({ message: 'Order not found' }, { status: 404 });
    }

    if (result.modifiedCount > 0) {
      // If status updated successfully, fetch the order to get userId
      const updatedOrder = await ordersCollection.findOne({ _id: objectId });

      // Removed Socket.IO notification emission logic
    } else {
      // Status was not changed (potentially already the same)
      // Potentially the status was already the same
      return NextResponse.json({ message: 'Order status was not changed (it might already be the requested status)' }, { status: 200 });
    }

    // Optionally fetch and return the updated order
    // const updatedOrder = await ordersCollection.findOne({ _id: objectId });
    // updatedOrder._id = updatedOrder._id.toString(); // Convert ID for response

    return NextResponse.json({ message: `Order ${orderId} status updated to ${newStatus}` }, { status: 200 });

  } catch (error) {
    console.error(`Error updating order ${orderId} status to ${newStatus}:`, error);
    // Distinguish between JSON parsing errors and other errors
    if (error instanceof SyntaxError) {
        return NextResponse.json({ message: 'Invalid JSON body provided' }, { status: 400 });
    }
    return NextResponse.json({ message: 'Failed to update order status', error: error.message }, { status: 500 });
  }
}