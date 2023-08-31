import { NextApiRequest, NextApiResponse } from 'next';
import User from '../../models/Users';
import bcrypt from 'bcrypt';
import { verifyJWT } from '../../utils/jwt';

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { token, newPassword } = req.body;

  try {
    const email = verifyJWT(token);
    if (!email) {
      return res.status(400).json({ message: 'Invalid or expired token' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'User not found' });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    res.status(200).json({ message: 'Password reset successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};
