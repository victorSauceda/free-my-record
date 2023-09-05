import Users from '../../models/Users';
import bcrypt from 'bcrypt';
import sgMail from '@sendgrid/mail';
import { NextApiRequest, NextApiResponse } from 'next';
import {
  generateEmailVerificationToken,
  saveTokenToDatabase,
} from '../../utils/emailVerification';
import { connectDB } from '../../utils/db';

sgMail.setApiKey(process.env.NEXT_PUBLIC_SENDGRID_API_KEY!);

export default async (req: NextApiRequest, res: NextApiResponse) => {
  await connectDB();
  try {
    if (req.method !== 'POST') {
      return res.status(405).end();
    }

    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: 'Please fill in all fields correctly.' });
    }

    const existingUser = await Users.findOne({ email: email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already in use' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new Users({
      email,
      password: hashedPassword,
      role: 'user',
    });

    await user.save();

    const verificationToken = generateEmailVerificationToken();

    await saveTokenToDatabase(email, verificationToken);

    const fromEmail = process.env.NEXT_PUBLIC_SENDGRID_EMAIL;
    if (!fromEmail) {
      return res.status(500).json({ message: 'Server error' });
    }

    const msg = {
      to: email,
      from: fromEmail,
      subject: 'Email Verification',
      text: 'Click the link below to verify your email address',
      html: `<a href="${process.env.NEXT_PUBLIC_BASE_URL}/verify?token=${verificationToken}">Verify Email</a>`,
    };

    await sgMail.send(msg);
    return res.status(200).json({ message: 'Email sent' });
  } catch (error: any) {
    console.error('An error occurred:', error);
    return res
      .status(500)
      .json({ message: 'Server error', error: error.message });
  }
};
