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
    subject: 'Password Reset - Your Company Name',
    text: `Click the link to reset your password: ${process.env.NEXT_PUBLIC_BASE_URL}/reset-password?token=${token}`,
    html: `
    <div style="font-family: Arial, Helvetica, sans-serif; padding: 20px; background-color: #f4f4f4;">
      <div style="max-width: 600px; margin: auto; background: #fff; padding: 50px; text-align: center; box-shadow: 0 0 10px rgba(0,0,0,0.1);">
        <h1 style="font-size: 24px; margin-bottom: 20px;">Password Reset</h1>
        <p style="font-size: 16px; margin-bottom: 30px;">We received a request to reset your password for your Free My Record account. Click the button below to reset your password.</p>
        <a href="${process.env.NEXT_PUBLIC_BASE_URL}/reset-password?token=${token}" style="background-color: #007bff; color: #fff; text-decoration: none; padding: 15px 30px; margin: 10px 0; display: inline-block; border-radius: 4px;">
          Reset Password
        </a>
        <p style="font-size: 14px; margin-top: 30px;">If you did not request a password reset, you can safely ignore this email.</p>
      </div>
    </div>
  `,
  };

  try {
    await sgMail.send(msg);
    res.status(200).json({ message: 'Password reset link sent' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};
