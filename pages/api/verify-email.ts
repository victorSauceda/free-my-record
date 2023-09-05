import User from '../../models/Users';
import { NextApiRequest, NextApiResponse } from 'next';
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
    const user = await User.findOne({ emailVerificationToken: token });
    if (!user) {
      return res
        .status(400)
        .json({ message: 'User not found or token invalid' });
    }

    if (new Date() > user.emailVerificationTokenExpires) {
      return res.status(400).json({ message: 'Token has expired' });
    }

    user.isVerified = true;
    user.emailVerificationToken = null;
    user.emailVerificationTokenExpires = null;
    await user.save();

    return res.status(200).json({ success: true });
  } catch (error) {
    return res.status(400).json({ message: 'Invalid or expired token' });
  }
};
