import { NextApiRequest, NextApiResponse } from 'next';
import User from '../../models/User';

export default (req: NextApiRequest, res: NextApiResponse) => {
  const newUser = new User({
    username: 'john',
    password: 'doe',
  });

  newUser.save();
  res.json({ message: 'User created' });
};
