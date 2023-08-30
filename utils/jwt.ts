const jwt = require('jsonwebtoken');

export const generateToken = (payload: object): string => {
  return jwt.sign(payload, process.env.NEXT_JWT, { expiresIn: '1h' });
};
export const verifyToken = (token: string): object | string => {
  return jwt.verify(token, process.env.NEXT_JWT);
};
