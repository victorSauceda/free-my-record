import crypto from 'crypto';
import User from '../models/Users';
import jwt, { JwtPayload } from 'jsonwebtoken';

export const verifyEmailToken = (token: string): string => {
  try {
    const decoded = jwt.verify(token, process.env.NEXT_PUBLIC_JWT_SECRET || '');
    if (typeof decoded === 'object' && 'email' in decoded) {
      return (decoded as JwtPayload).email as string;
    } else {
      throw new Error('Invalid token payload');
    }
  } catch (error) {
    throw new Error('Invalid or expired token');
  }
};

export const generateEmailVerificationToken = (): string => {
  return crypto.randomBytes(32).toString('hex');
};
export const saveTokenToDatabase = async (email: string, token: string) => {
  const expirationTime = new Date();
  expirationTime.setHours(expirationTime.getHours() + 24); // Token expires in 24 hours

  await User.findOneAndUpdate(
    { email: email },
    {
      emailVerificationToken: token,
      emailVerificationTokenExpires: expirationTime,
    },
    { new: true }
  );
};
export const removeTokenFromDatabase = async (email: string, token: string) => {
  const user = await User.findOne({ email, emailVerificationToken: token });
  if (!user) {
    throw new Error('Token not found');
  }
  user.emailVerificationToken = null;
  await user.save();
};
