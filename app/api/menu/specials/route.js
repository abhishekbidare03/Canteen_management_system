import { NextResponse } from 'next/server';
import clientPromise from '@/lib/db'; // Assuming db.js exports clientPromise

export async function GET(request) {
  try {
    const client = await clientPromise;
    const db = client.db('baratieDB'); // Use your database name
    const collection = db.collection('todays_specials'); // Collection for today's specials

    // Fetch all documents from the collection
    // You might want to add limits, sorting, or specific queries later
    const specials = await collection.find({}).toArray();

    // Convert MongoDB ObjectId to string if necessary for client-side usage
    const formattedSpecials = specials.map(item => ({
      ...item,
      _id: item._id.toString(), // Convert ObjectId to string
      id: item._id.toString(), // Often useful to have 'id' as well
    }));

    return NextResponse.json(formattedSpecials, { status: 200 });

  } catch (error) {
    console.error('Error fetching today\'s specials:', error);
    return NextResponse.json(
      { message: 'Failed to fetch today\'s specials', error: error.message },
      { status: 500 }
    );
  }
}

// Optional: Add a default handler or options if needed for other methods
// export async function OPTIONS(request) {
//   // Handle OPTIONS requests for CORS preflight if necessary
//   return new NextResponse(null, { status: 204 });
// }