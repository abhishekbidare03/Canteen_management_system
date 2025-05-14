// This file is for testing the MongoDB connection

import { connectToDatabase } from './db';

/**
 * Test function to verify MongoDB connection
 */
export async function testConnection() {
  try {
    const db = await connectToDatabase();
    console.log('Successfully connected to MongoDB!');
    
    // List all collections in the database
    const collections = await db.listCollections().toArray();
    console.log('Available collections:', collections.map(c => c.name));
    
    return { success: true, message: 'Connected to MongoDB successfully' };
  } catch (error) {
    console.error('Failed to connect to MongoDB:', error);
    return { success: false, error: error.message };
  }
}

// For direct execution of this file
if (require.main === module) {
  testConnection()
    .then(result => console.log(result))
    .catch(err => console.error(err));
}