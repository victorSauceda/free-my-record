import { NextApiRequest, NextApiResponse } from 'next';
import User from '../../models/Users';
import { generateToken } from '../../utils/jwt';
import sgMail from '@sendgrid/mail';
import { connectDB } from '../../utils/db';

sgMail.setApiKey(process.env.NEXT_PUBLIC_SENDGRID_API_KEY || '');

export default async (req: NextApiRequest, res: NextApiResponse) => {
  await connectDB();
  const { email } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    return res.status(400).json({ message: 'User not found' });
  }

  const token = generateToken({ userId: user._id.toString(), role: 'reset' });

  const fromEmail = process.env.NEXT_PUBLIC_SENDGRID_EMAIL;
  if (!fromEmail) {
    return res.status(500).json({ message: 'Server configuration error' });
  }

  const msg = {
    to: email,
    from: fromEmail,
    subject: 'Password Reset',
    text: `Click the link to reset your password: ${process.env.NEXT_PUBLIC_BASE_URL}/reset-password?token=${token}`,
  };

  try {
    await sgMail.send(msg);
    res.status(200).json({ message: 'Password reset link sent' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};
