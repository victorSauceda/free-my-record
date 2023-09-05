import { NextApiRequest, NextApiResponse } from 'next';

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'POST') {
    return res.status(405).end();
  }
  res.setHeader('Set-Cookie', ['token=; HttpOnly; Path=/; Max-Age=0']);

  return res.status(200).json({ success: true });
};
