import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { fetchEmail } from '../utils/fetchEmail';
import { TokenPayload } from '../types/user';
import dotenv from 'dotenv';

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET as string;

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
  const user = await fetchEmail(email);
  if (!user) {
    throw new InvalidCredentialsError();
  }

  //**Proveri da li je ime korisnika prazno */
  if (!user.name || user.name.trim() === '') {
    throw new InvalidCredentialsError(); 
  }

  //**Poredi sifru sa hesiranom sifrom */
  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    throw new InvalidCredentialsError();
  }

  //**Generisi JWT token */
  const payload: TokenPayload = { id: user.id, email: user.email, name: user.name };
  const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' });

  return { token, userId: user.id, email: user.email, name: user.name };
};
