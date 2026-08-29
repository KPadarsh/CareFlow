import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import User from '@/models/User';

export async function POST(request: Request) {
  try {
    await dbConnect();
    const body = await request.json();
    const { name, email, password, phone, gender, address } = body;

    if (!name || !email || !password) {
      return NextResponse.json(
        { success: false, message: 'Please provide all required fields.' },
        { status: 400 }
      );
    }

    // Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return NextResponse.json(
        { success: false, message: 'User already exists with this email.' },
        { status: 400 }
      );
    }

    // Create user (force role to patient for public registration)
    await User.create({
      name,
      email,
      password,
      role: 'patient',
      phone,
      gender,
      address,
    });

    return NextResponse.json(
      { success: true, message: 'Registration successful. Please sign in.' },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
}
