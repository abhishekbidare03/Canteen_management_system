import { NextResponse } from 'next/server';
import clientPromise from '@/lib/db';
import { ObjectId } from 'mongodb'; // Keep ObjectId for fetching by _id if needed

// Helper function to get the next sequence number for a given name (e.g., 'orderNumber')
async function getNextSequenceValue(sequenceName, db) {
  const today = new Date().toISOString().split('T')[0]; // Get YYYY-MM-DD
  const sequenceDocument = await db.collection('counters').findOneAndUpdate(
    { _id: `${sequenceName}_${today}` }, // Unique ID per day
    { $inc: { sequence_value: 1 } }, // Increment the counter
    { returnDocument: 'after', upsert: true } // Return the updated doc, create if not exists
  );
  // If the document was just created (upserted), sequence_value will be 1
  // If it existed, it will be the incremented value
  return sequenceDocument.sequence_value;
}

export async function POST(request) {
  console.log('POST /api/orders called');
  let client;
  try {
    const { userId, cartItems, totalAmount } = await request.json();
    console.log('Received data:', { userId, cartItems, totalAmount });

    // Basic Validation
    if (!userId || !cartItems || cartItems.length === 0 || typeof totalAmount !== 'number') {
      console.error('Validation failed: Missing or invalid data');
      return NextResponse.json({ message: 'Missing or invalid order data' }, { status: 400 });
    }

    client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB || 'baratieDB');
    console.log(`Connected to DB: ${db.databaseName}`);

    // Get the next daily order number
    const dailyOrderNumber = await getNextSequenceValue('orderNumber', db);
    console.log(`Generated Daily Order Number: ${dailyOrderNumber}`);

    const orderData = {
      userId, 
      dailyOrderNumber, 
      items: cartItems.map(item => ({
        itemId: item._id, 
        name: item.name,
        quantity: item.quantity,
        price: item.price, 
        imageSrc: item.imageSrc 
      })),
      totalAmount,
      orderDate: new Date(),
      orderStatus: 'Placed', // Changed back to orderStatus
    };

    console.log('Order data to insert:', orderData);

    const result = await db.collection('orders').insertOne(orderData);
    console.log('MongoDB insert result:', result);

    if (!result.acknowledged || !result.insertedId) {
      console.error('MongoDB insertion failed:', result);
      throw new Error('Failed to insert order into database');
    }

    console.log(`Order created successfully with _id: ${result.insertedId} and dailyOrderNumber: ${dailyOrderNumber}`);

    // Return the MongoDB _id, as the summary page needs it to fetch the full order
    return NextResponse.json({ 
        message: 'Order placed successfully!', 
        orderId: result.insertedId, // Still return the unique _id
        dailyOrderNumber // Optionally return the daily number too
    }, { status: 201 });

  } catch (error) {
    console.error('Error placing order:', error);
  
    return NextResponse.json({ message: 'Failed to place order', error: error.message }, { status: 500 });
  }
}

// GET by MongoDB _id (for fetching specific order details)
export async function GET(request, { params }) {
    const { orderId } = params;
    console.log(`GET /api/orders/${orderId} called`);
    let client;

    if (!orderId || !ObjectId.isValid(orderId)) {
        console.error('Invalid Order ID:', orderId);
        return NextResponse.json({ message: 'Invalid Order ID format' }, { status: 400 });
    }

    try {
        client = await clientPromise;
        const db = client.db(process.env.MONGODB_DB || 'baratieDB');
        console.log(`Connected to DB: ${db.databaseName} for GET`);

        const order = await db.collection('orders').findOne({ _id: new ObjectId(orderId) });

        if (!order) {
            console.warn(`Order not found for ID: ${orderId}`);
            return NextResponse.json({ message: 'Order not found' }, { status: 404 });
        }

        console.log(`Order found:`, order);
        return NextResponse.json(order, { status: 200 });

    } catch (error) {
        console.error(`Error fetching order ${orderId}:`, error);
        return NextResponse.json({ message: 'Failed to fetch order details', error: error.message }, { status: 500 });
    }
}