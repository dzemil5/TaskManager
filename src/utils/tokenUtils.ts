import jwt from 'jsonwebtoken';
import { TokenPayload } from '../types/user';
import { JWT_SECRET } from '../config/environment';

//**Verifikacija tokena */
export const verifyToken = (token: string): TokenPayload => {
  return jwt.verify(token, JWT_SECRET) as TokenPayload;
};
