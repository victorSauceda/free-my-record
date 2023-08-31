import jwt, { JwtPayload } from 'jsonwebtoken';

export const generateToken = (payload: {
  userId: string;
  role: string;
}): string => {
  const secret = process.env.NEXT_PUBLIC_JWT_SECRET;
  if (!secret) {
    throw new Error('JWT Secret is not defined');
  }
  return jwt.sign(payload, secret, { expiresIn: '1h' });
};

export const verifyJWT = (token: string) => {
  try {
    const decoded = jwt.verify(token, process.env.NEXT_PUBLIC_JWT_SECRET || '');
    if (typeof decoded === 'object' && 'email' in decoded) {
      return (decoded as JwtPayload).email as string;
    } else {
      return null;
    }
  } catch (error) {
    return null;
  }
};
export const verifyResetToken = (token: string): string => {
  try {
    const decoded = jwt.verify(token, process.env.NEXT_PUBLIC_JWT_SECRET || '');
    if (
      typeof decoded === 'object' &&
      'userId' in decoded &&
      decoded.role === 'reset'
    ) {
      return (decoded as JwtPayload).userId as string;
    } else {
      throw new Error('Invalid token payload');
    }
  } catch (error) {
    throw new Error('Invalid or expired token');
  }
};
