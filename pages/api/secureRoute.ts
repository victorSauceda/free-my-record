import { NextApiRequest, NextApiResponse } from 'next';
import { verifyToken } from '../../utils/jwt';
export default (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const token = req.headers.authorization?.split(' ')[1] || '';
    const decoded = verifyToken(token);
  } catch (error) {
    res.status(401).json({ message: 'Unauthorized' });
  }
};
