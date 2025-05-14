import { NextResponse } from 'next/server';
import clientPromise from '@/lib/db';
import { writeFile } from 'fs/promises';
import path from 'path';
import { mkdirSync, existsSync } from 'fs';

// Removed old uploadDir logic
// const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'food-items');
// if (!existsSync(uploadDir)) {
//   mkdirSync(uploadDir, { recursive: true });
//   console.log(`Created upload directory: ${uploadDir}`);
// }

export async function POST(request) {
  let client;
  try {
    const formData = await request.formData();
    const name = formData.get('name');
    const category = formData.get('category'); // e.g., 'indian', 'chinese'
    const price = formData.get('price');
    const description = formData.get('description');
    const imageFile = formData.get('image');

    // Basic Validation
    if (!name || !category || !price || !description || !imageFile) {
      return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
    }
    if (isNaN(parseFloat(price)) || parseFloat(price) <= 0) {
        return NextResponse.json({ message: 'Invalid price value' }, { status: 400 });
    }

    // --- Dynamic Image Path Logic ---
    const categorySlug = category.toLowerCase().replace(/\s+/g, '_'); // Ensure category is filesystem-safe
    const categoryUploadDir = path.join(process.cwd(), 'public', 'assets', categorySlug);
    
    // Ensure the category-specific upload directory exists
    if (!existsSync(categoryUploadDir)) {
      mkdirSync(categoryUploadDir, { recursive: true });
      console.log(`Created category upload directory: ${categoryUploadDir}`);
    }
    // --- End Dynamic Image Path Logic ---

    // Handle Image Upload
    const bytes = await imageFile.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Create a unique filename (e.g., using timestamp and original name)
    const timestamp = Date.now();
    // Sanitize filename further if needed
    const safeImageName = imageFile.name.replace(/[^a-zA-Z0-9._-]/g, '_'); 
    const uniqueFilename = `${timestamp}-${safeImageName}`;
    const imagePath = path.join(categoryUploadDir, uniqueFilename); // Use category-specific path
    const imageUrl = `/assets/${categorySlug}/${uniqueFilename}`; // Path relative to /public

    await writeFile(imagePath, buffer);
    console.log(`Image saved to: ${imagePath}`);

    // Connect to DB
    client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB || 'baratieDB');
    console.log(`Connected to DB: ${db.databaseName} for adding food item`);

    // --- Dynamic Collection Logic ---
    const collectionName = `${categorySlug}_menu`; // e.g., indian_menu, chinese_menu
    console.log(`Target collection: ${collectionName}`);
    // --- End Dynamic Collection Logic ---

    // Prepare data for MongoDB
    const foodItemData = {
      name,
      category, // Keep original category name for display/filtering if needed
      price: parseFloat(price),
      description,
      imageSrc: imageUrl, // Store the web-accessible path
      createdAt: new Date(),
      // Add isVegetarian later if needed
      // isVegetarian: formData.get('isVegetarian') === 'true' 
    };

    // Insert into dynamically determined MongoDB collection
    const result = await db.collection(collectionName).insertOne(foodItemData);
    console.log(`MongoDB insert result into ${collectionName}:`, result);

    if (!result.acknowledged || !result.insertedId) {
      throw new Error(`Failed to insert food item into collection ${collectionName}`);
    }

    console.log(`Food item added successfully to ${collectionName} with _id: ${result.insertedId}`);

    // Return success response with the created item's ID
    return NextResponse.json({ 
        message: 'Food item added successfully!', 
        itemId: result.insertedId,
        item: { ...foodItemData, _id: result.insertedId } // Return the full item data
    }, { status: 201 });

  } catch (error) {
    console.error('Error adding food item:', error);
    // Consider more specific error handling (e.g., file system errors)
    return NextResponse.json({ message: 'Failed to add food item', error: error.message }, { status: 500 });
  }
  // MongoClient handles pooling
}

// GET method to fetch all food items from all category-specific collections
export async function GET(request) {
    let client;
    try {
        client = await clientPromise;
        const db = client.db(process.env.MONGODB_DB || 'baratieDB');
        console.log(`Connected to DB: ${db.databaseName} for GET all food items`);

        // List all collections in the database
        const collections = await db.listCollections().toArray();
        
        // Filter for collections ending with '_menu'
        const menuCollections = collections
            .map(col => col.name)
            .filter(name => name.endsWith('_menu'));

        console.log('Found menu collections:', menuCollections);

        let allItems = [];
        // Fetch items from each menu collection
        for (const collectionName of menuCollections) {
            const items = await db.collection(collectionName).find({}).sort({ name: 1 }).toArray();
            allItems = allItems.concat(items);
        }

        // Sort all items (optional, e.g., by category then name)
        allItems.sort((a, b) => {
            if (a.category < b.category) return -1;
            if (a.category > b.category) return 1;
            if (a.name < b.name) return -1;
            if (a.name > b.name) return 1;
            return 0;
        });

        // Convert ObjectId to string for client-side compatibility
        const itemsWithStringIds = allItems.map(item => ({
            ...item,
            _id: item._id.toString(),
        }));

        return NextResponse.json(itemsWithStringIds, { status: 200 });

    } catch (error) {
        console.error('Error fetching all food items:', error);
        return NextResponse.json({ message: 'Failed to fetch all food items', error: error.message }, { status: 500 });
    }
}