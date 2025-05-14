import { NextResponse } from 'next/server';
import clientPromise from '@/lib/db';
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
    const { email, password, role } = await request.json();

    if (!email || !password || !role) {
      return NextResponse.json({ message: 'Missing required fields (email, password, role)' }, { status: 400 });
    }

    const collectionName = getCollectionName(role);
    if (!collectionName) {
      return NextResponse.json({ message: 'Invalid role specified' }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db('baratieDB'); // Use your database name
    const collection = db.collection(collectionName);

    // Find user by email
    const user = await collection.findOne({ email });

    if (!user) {
      return NextResponse.json({ message: 'Invalid credentials' }, { status: 401 }); // User not found
    }

    // Compare provided password with the stored hash
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return NextResponse.json({ message: 'Invalid credentials' }, { status: 401 }); // Incorrect password
    }

    // Login successful
    // In a real app, you'd generate a session token (e.g., JWT) here
    // For now, just return user info (excluding password)
    const { password: _, ...userWithoutPassword } = user;

    return NextResponse.json({ message: 'Login successful', user: userWithoutPassword }, { status: 200 });

  } catch (error) {
    console.error('Login API Error:', error);
    return NextResponse.json({ message: 'An error occurred during login', error: error.message }, { status: 500 });
  }
}