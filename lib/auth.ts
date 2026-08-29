import jwt from 'jsonwebtoken';
import dbConnect from './db';
import User, { IUserDocument } from '@/models/User';

const JWT_SECRET = process.env.JWT_SECRET || 'fallbacksecret';
const JWT_EXPIRE = process.env.JWT_EXPIRE || '7d';

export function signToken(id: string): string {
  return jwt.sign({ id }, JWT_SECRET, {
    expiresIn: JWT_EXPIRE as any,
  });
}

export function verifyToken(token: string): { id: string } | null {
  try {
    return jwt.verify(token, JWT_SECRET) as { id: string };
  } catch (error) {
    return null;
  }
}

export async function getAuthenticatedUser(token: string | undefined): Promise<IUserDocument | null> {
  if (!token) return null;
  const decoded = verifyToken(token);
  if (!decoded) return null;

  await dbConnect();
  const user = await User.findById(decoded.id);
  if (!user || user.status !== 'active') {
    return null;
  }
  return user;
}
