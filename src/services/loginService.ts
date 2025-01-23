import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { getUserByEmail } from './userService';
import { TokenPayload } from '../types/user';
import { JWT_SECRET } from '../config/environment';

//**Error klasa za nevazece podatke */
class InvalidCredentialsError extends Error {
  constructor() {
    super('Invalid email or password');
    this.name = 'InvalidCredentialsError';
  }
}

export interface LoginResponse {
  token: string;
  userId: number;
  email: string;
  name: string;
}

export const loginUser = async (email: string, password: string): Promise<LoginResponse> => {
  if (!email || !password) {
    throw new InvalidCredentialsError();
  }

  //**Uzmi podatke o korisniku */
  const user = await getUserByEmail(email);
  if (!user) {
    throw new InvalidCredentialsError();
  }

  //**Proveri da li je ime korisnika prazno */
  if (!user.name || user.name.trim() === '') {
    throw new InvalidCredentialsError();  // Or throw a more specific error message like 'Name is required'
  }

  //**Poredi sifru sa hesiranom sifrom */
  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    throw new InvalidCredentialsError();
  }

  //**Generisi JWT token */
  const payload: TokenPayload = { userId: user.id, email: user.email, name: user.name };
  const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' });

  return { token, userId: user.id, email: user.email, name: user.name };
};
