import { NextResponse } from 'next/server';
import clientPromise from '@/lib/db';

// Helper function to format collection name to category name (e.g., 'indian_menu' -> 'Indian')
function formatCollectionNameToCategory(collectionName) {
  if (!collectionName.endsWith('_menu')) {
    return null; // Or handle as needed
  }
  const baseName = collectionName.replace('_menu', '');
  return baseName.charAt(0).toUpperCase() + baseName.slice(1);
}

export async function GET(request) {
  try {
    const client = await clientPromise;
    const db = client.db(); // Use your default database

    // List all collections in the database
    const collections = await db.listCollections().toArray();

    // Filter collections that end with '_menu' and format their names
    const categories = collections
      .map(col => col.name)
      .map(formatCollectionNameToCategory)
      .filter(category => category !== null) // Remove nulls from collections not ending in _menu
      .sort(); // Sort alphabetically

    console.log('Fetched categories from DB collection names:', categories);

    if (!categories || categories.length === 0) {
      console.warn('No collections ending with _menu found in the database.');
      // Return empty array, but maybe log an error or return a specific status?
      return NextResponse.json([], { status: 200 }); 
    }

    return NextResponse.json(categories, { status: 200 });

  } catch (error) {
    console.error('Error fetching categories from DB collection names:', error);
    return NextResponse.json({ message: 'Failed to fetch categories from database', error: error.message }, { status: 500 });
  }
}