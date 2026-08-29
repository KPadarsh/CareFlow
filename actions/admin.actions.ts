'use server';

import dbConnect from '@/lib/db';
import User from '@/models/User';

export async function getAllUsersAction() {
  try {
    await dbConnect();
    const users = await User.find({}).lean();
    return { success: true, users: JSON.parse(JSON.stringify(users)) };
  } catch (error: any) {
    return { success: false, error: error.message || 'Failed to fetch users.' };
  }
}
