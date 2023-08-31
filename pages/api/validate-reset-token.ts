import { NextApiRequest, NextApiResponse } from 'next';
import { verifyResetToken } from '../../utils/jwt';
import User from '../../models/Users';

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'POST') {
    return res.status(405).end();
  }

  const { token } = req.body;

  if (!token) {
    return res.status(400).json({ message: 'Token is required' });
  }

  try {
    const userId = verifyResetToken(token);

    const user = await User.findById(userId);
    if (!user) {
      return res.status(400).json({ message: 'User not found' });
    }
    return res.status(200).json({ message: 'Token is valid' });
  } catch (error) {
    return res.status(400).json({ message: 'Invalid or expired token' });
  }
};
