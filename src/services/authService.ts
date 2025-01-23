import { UserService } from '../services/userService';
import {  InputValidatorImpl } from '../utils/inputValidator';
import {  BcryptPasswordHasher } from '../utils/passwordHasher';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../config/environment';
import { TokenPayload } from '../types/user';

export interface AuthService {
  loginUser(email: string, password: string): Promise<string>;
}

export class AuthServiceImpl implements AuthService {
  private userService: UserService;

  constructor() {
    const inputValidator = new InputValidatorImpl();
    const passwordHasher = new BcryptPasswordHasher();
    this.userService = new UserService(inputValidator, passwordHasher);
  }

  async loginUser(email: string, password: string): Promise<string> {
    const user = await this.userService.getUserByEmail(email);
  
    if (!user) {
      throw new Error('User not found');
    }
  
    if (!(await bcrypt.compare(password, user.password))) {
      throw new Error('Invalid password');
    }
  
    const payload: TokenPayload = { userId: user.id, email: user.email, name: user.name };
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' });
  
    return token;
  }
}