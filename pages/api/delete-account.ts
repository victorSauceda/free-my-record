import { connectDB } from '../../utils/db';
import { NextApiRequest, NextApiResponse } from 'next';
import Users from '@/models/Users';

export default async (req: NextApiRequest, res: NextApiResponse) => {
  console.log('Request body:', JSON.stringify(req.body));

  await connectDB();

  if (req.method !== 'DELETE') {
    return res.status(405).end();
  }

  try {
    const userId = await req.body.userId;

    const deletedUser = await Users.findByIdAndDelete(userId);

    if (!deletedUser) {
      console.error('User not found');
      return res.status(404).json({ message: 'User not found' });
    }

    console.log('User deleted:', deletedUser);
    res.status(200).json({ message: 'Account deleted successfully' });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};
