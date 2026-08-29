'use server';

import dbConnect from '@/lib/db';
import User from '@/models/User';
import { signToken } from '@/lib/auth';
import { cookies } from 'next/headers';

export async function loginUserAction(state: any, formData: FormData) {
  try {
    await dbConnect();
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    if (!email || !password) {
      return { success: false, error: 'Email and password are required.' };
    }

    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return { success: false, error: 'Invalid email or password.' };
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return { success: false, error: 'Invalid email or password.' };
    }

    const token = signToken(user._id.toString());
    const cookieStore = await cookies();
    cookieStore.set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60,
      path: '/',
    });

    return {
      success: true,
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        role: user.role,
      },
    };
  } catch (error: any) {
    return { success: false, error: error.message || 'Server login failed.' };
  }
}

export async function logoutUserAction() {
  try {
    const cookieStore = await cookies();
    cookieStore.set('token', '', {
      httpOnly: true,
      expires: new Date(0),
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',
    });
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message || 'Server logout failed.' };
  }
}
