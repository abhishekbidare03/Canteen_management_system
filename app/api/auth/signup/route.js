import { NextResponse } from 'next/server';
import clientPromise from '@/lib/db'; // Assuming db.js exports clientPromise
import bcrypt from 'bcryptjs';

// Determine the collection based on the role
const getCollectionName = (role) => {
  switch (role) {
    case 'employee':
      return 'employees';
    case 'chef':
      return 'chefs';
    case 'admin':
      return 'admins';
    default:
      return null;
  }
};

export async function POST(request) {
  try {
    const { email, password, role, name } = await request.json(); // Added name field

    if (!email || !password || !role || !name) {
      return NextResponse.json({ message: 'Missing required fields (email, password, role, name)' }, { status: 400 });
    }

    const collectionName = getCollectionName(role);
    if (!collectionName) {
      return NextResponse.json({ message: 'Invalid role specified' }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db('baratieDB'); // Use your database name
    const collection = db.collection(collectionName);

    // Check if user already exists
    const existingUser = await collection.findOne({ email });
    if (existingUser) {
      return NextResponse.json({ message: 'User with this email already exists' }, { status: 409 }); // 409 Conflict
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10); // Salt rounds = 10

    // Create new user document
    const newUser = {
      name,
      email,
      password: hashedPassword,
      role,
      createdAt: new Date(),
    };

    // Insert the new user
    const result = await collection.insertOne(newUser);

    if (result.insertedId) {
      // Don't send back the password hash
      const { password: _, ...userWithoutPassword } = newUser;
      return NextResponse.json({ message: 'User created successfully', user: userWithoutPassword }, { status: 201 });
    } else {
      throw new Error('Failed to insert user into database');
    }

  } catch (error) {
    console.error('Signup API Error:', error);
    // Check for specific MongoDB errors if needed, e.g., duplicate key error
    if (error.code === 11000) { // MongoDB duplicate key error code
        return NextResponse.json({ message: 'User with this email already exists' }, { status: 409 });
    }
    return NextResponse.json({ message: 'An error occurred during signup', error: error.message }, { status: 500 });
  }
}