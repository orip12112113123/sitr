import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'sitr-secret-key-change-in-production';

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword);
}

export function generateToken(userId: string, userType: string): string {
  return jwt.sign({ userId, userType }, JWT_SECRET, { expiresIn: '7d' });
}

export function verifyToken(token: string): { userId: string; userType: string } | null {
  try {
    return jwt.verify(token, JWT_SECRET) as { userId: string; userType: string };
  } catch {
    return null;
  }
}

export function validateAge(age: number): boolean {
  return age >= 16;
}
