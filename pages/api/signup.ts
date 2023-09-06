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

    const { firstName, lastName, email, password } = req.body;

    if (!firstName || !lastName || !email || !password) {
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
      firstName,
      lastName,
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
      html: `
    <div style="font-family: Arial, Helvetica, sans-serif; padding: 20px; background-color: #f4f4f4;">
      <div style="max-width: 600px; margin: auto; background: #fff; padding: 50px; text-align: center; box-shadow: 0 0 10px rgba(0,0,0,0.1);">
        <h1 style="font-size: 24px; margin-bottom: 20px;">Email Verification</h1>
        <p style="font-size: 16px; margin-bottom: 30px;">${firstName}, Thank you for signing up with Free My Record. Please click the button below to verify your email address and complete your registration.</p>
        <a href="${process.env.NEXT_PUBLIC_BASE_URL}/verify?token=${verificationToken}" style="background-color: #007bff; color: #fff; text-decoration: none; padding: 15px 30px; margin: 10px 0; display: inline-block; border-radius: 4px;">
          Verify Email
        </a>
        <p style="font-size: 14px; margin-top: 30px;">If you did not sign up for a Your Company Name account, you can safely ignore this email.</p>
      </div>
    </div>
  `,
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
