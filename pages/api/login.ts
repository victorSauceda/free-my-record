import bcrypt from 'bcrypt';
import User from '../../models/Users';
import { generateToken } from '../../utils/jwt';
import { NextApiRequest, NextApiResponse } from 'next';

export default async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res
        .status(400)
        .json({ message: 'Username and password are required' });
    }

    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const hashedPassword = user.password ?? '';
    const isMatch = await bcrypt.compare(password, hashedPassword);

    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const userRole = user.role ?? 'user';
    const token = generateToken({
      userId: user._id.toString(),
      role: userRole,
    });
    res.setHeader('Set-Cookie', [
      `token=${token}; HttpOnly; Path=/; Max-Age=${60 * 60 * 24}`,
    ]);

    res.json({ message: 'Login successful' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};
