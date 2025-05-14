import { NextResponse } from 'next/server';
import clientPromise from '@/lib/db';
import { ObjectId } from 'mongodb';
import path from 'path';
import { promises as fs } from 'fs';

export async function DELETE(request, { params }) {
  const { foodItemId } = params; // Get the item ID from the URL parameter
  let client;

  if (!foodItemId || !ObjectId.isValid(foodItemId)) {
    return NextResponse.json({ message: 'Invalid food item ID provided' }, { status: 400 });
  }

  try {
    // Get the category from the request body to determine the collection
    const { category } = await request.json();
    if (!category) {
      return NextResponse.json({ message: 'Category is required in the request body' }, { status: 400 });
    }

    const categorySlug = category.toLowerCase().replace(/s+/g, '_');
    const collectionName = `${categorySlug}_menu`;

    client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB || 'baratieDB');
    console.log(`Connected to DB: ${db.databaseName} for deleting item ${foodItemId} from ${collectionName}`);

    // Find the item first to get its image path for deletion
    const itemToDelete = await db.collection(collectionName).findOne({ _id: new ObjectId(foodItemId) });

    if (!itemToDelete) {
      return NextResponse.json({ message: `Food item with ID ${foodItemId} not found in collection ${collectionName}` }, { status: 404 });
    }

    // Attempt to delete the item from the database
    const deleteResult = await db.collection(collectionName).deleteOne({ _id: new ObjectId(foodItemId) });

    if (deleteResult.deletedCount === 0) {
      // This might happen in a race condition, but good to check
      console.warn(`Attempted to delete item ${foodItemId} from ${collectionName}, but it was already gone.`);
      // Still return success as the item is gone
    } else {
      console.log(`Successfully deleted item ${foodItemId} from collection ${collectionName}`);
    }

    // Attempt to delete the associated image file
    if (itemToDelete.imageSrc) {
      try {
        // Construct the full file system path from the web path
        // Assumes imageSrc is like '/assets/category/filename.jpg'
        const imageFilePath = path.join(process.cwd(), 'public', itemToDelete.imageSrc);
        await fs.unlink(imageFilePath);
        console.log(`Successfully deleted image file: ${imageFilePath}`);
      } catch (fileError) {
        // Log the error but don't fail the request, as the DB entry is deleted
        console.error(`Failed to delete image file ${itemToDelete.imageSrc}:`, fileError);
        // You might want to add more robust error handling or logging here
      }
    }

    return NextResponse.json({ message: 'Food item deleted successfully' }, { status: 200 });

  } catch (error) {
    console.error(`Error deleting food item ${foodItemId}:`, error);
    // Handle potential JSON parsing errors from request.json()
    if (error instanceof SyntaxError) {
        return NextResponse.json({ message: 'Invalid JSON in request body', error: error.message }, { status: 400 });
    }
    return NextResponse.json({ message: 'Failed to delete food item', error: error.message }, { status: 500 });
  }
}

// Placeholder for PUT/PATCH if needed for editing later
// export async function PUT(request, { params }) {
//   // ... implementation ...
// }