import { NextApiRequest, NextApiResponse } from 'next';
const { generateToken } = require('../../utils/jwt');

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const token = generateToken({ userId: 'someUserId' });
  res.json({ token });
}
