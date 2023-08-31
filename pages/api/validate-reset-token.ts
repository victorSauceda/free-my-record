import { NextApiRequest, NextApiResponse } from 'next';
import { verifyResetToken } from '../../utils/jwt';
import Users from '../../models/Users';
import { connectDB } from '../../utils/db';

export default async (req: NextApiRequest, res: NextApiResponse) => {
  await connectDB();
  if (req.method !== 'POST') {
    return res.status(405).end();
  }

  const { token } = req.body;

  if (!token) {
    return res.status(400).json({ message: 'Token is required' });
  }

  try {
    const userId = verifyResetToken(token);

    const user = await Users.findById(userId);
    if (!user) {
      return res.status(400).json({ message: 'User not found' });
    }

    return res.status(200).json({ message: 'Token is valid' });
  } catch (error) {
    return res.status(400).json({ message: 'Invalid or expired token' });
  }
};
