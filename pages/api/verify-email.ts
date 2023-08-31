import User from '../../models/Users';
import {
  verifyEmailToken,
  removeTokenFromDatabase,
} from '../../utils/emailVerification';
import { NextApiRequest, NextApiResponse } from 'next';

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'POST') {
    return res.status(405).end();
  }

  const { token } = req.body;

  if (!token) {
    return res.status(400).json({ message: 'Token is required' });
  }

  try {
    const email = verifyEmailToken(token);

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'User not found' });
    }
    user.isVerified = true;
    await user.save();

    await removeTokenFromDatabase(email, token);

    res.writeHead(302, {
      Location: '/dashboard',
    });
    res.end();
  } catch (error) {
    return res.status(400).json({ message: 'Invalid or expired token' });
  }
};
