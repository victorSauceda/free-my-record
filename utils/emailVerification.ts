import crypto from 'crypto';
import User from '../models/Users';

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
    }
  );
};
