import { NextResponse } from 'next/server';
import clientPromise from '@/lib/db';
import { ObjectId } from 'mongodb';

// Map category names (from URL) to MongoDB collection names
const categoryCollectionMap = {
  'Indian': 'indian_menu',
  'Korean': 'korean_menu',
  'Chinese': 'chinese_menu',
  'Italian': 'italian_menu',
  'Desserts': 'desserts_menu',
  'Milkshake': 'milkshake_menu',
  'Soft Drinks': 'soft_drinks_menu',
  // Add more mappings if needed
};

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const categoryParam = searchParams.get('category'); // Get category from URL
    const client = await clientPromise;
    // Ensure connection uses the correct DB from .env.local or connection string
    const db = client.db(process.env.MONGODB_DB || undefined); 

    let results;

    if (categoryParam) {
      // --- Case-insensitive category lookup --- 
      let collectionName = null;
      const categoryLower = categoryParam.toLowerCase();
      for (const key in categoryCollectionMap) {
        if (key.toLowerCase() === categoryLower) {
          collectionName = categoryCollectionMap[key];
          break;
        }
      }
      // --- End case-insensitive lookup ---

      if (!collectionName) {
        // Log the category that was attempted
        console.warn(`Invalid or unmapped category requested: ${categoryParam}`);
        return NextResponse.json({ message: `Invalid category: ${categoryParam}` }, { status: 400 });
      }
      
      console.log(`Fetching items for category: ${categoryParam} using collection: ${collectionName}`); // Add logging
      const items = await db.collection(collectionName).find({}).toArray();
      console.log(`Found ${items.length} items in ${collectionName}`); // Add logging
      
      results = items.map(item => ({ ...item, _id: item._id.toString() }));
    } else {
      // Fetch items from all categories and group them (existing logic)
      console.log('Fetching items for all categories'); // Add logging
      results = {};
      for (const [catName, collectionName] of Object.entries(categoryCollectionMap)) {
        const items = await db.collection(collectionName).find({}).toArray();
        results[catName] = items.map(item => ({ ...item, _id: item._id.toString() }));
      }
    }

    return NextResponse.json(results);

  } catch (error) {
    console.error('Failed to fetch food items:', error);
    return NextResponse.json({ message: 'Failed to fetch food items', error: error.message }, { status: 500 });
  }
}