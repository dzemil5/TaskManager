// tests/userService.test.ts
import { UserService } from './userService';
import { InputValidatorImpl } from '../utils/inputValidator';
import { BcryptPasswordHasher } from '../utils/passwordHasher';
import { PrismaClient } from '@prisma/client';

jest.mock('../utils/inputValidator');
jest.mock('../utils/passwordHasher');
jest.mock('@prisma/client', () => ({
  PrismaClient: jest.fn().mockReturnValue({
    user: {
      create: jest.fn(),
      findUnique: jest.fn(),
    },
  }),
}));

describe('UserService', () => {
  let userService: UserService;
  let inputValidator: InputValidatorImpl;
  let passwordHasher: BcryptPasswordHasher;
  let prismaClient: PrismaClient;

  beforeEach(() => {
    inputValidator = new InputValidatorImpl();
    passwordHasher = new BcryptPasswordHasher();
    prismaClient = new PrismaClient();
    userService = new UserService(inputValidator, passwordHasher);
  });

  it('should create a new user', async () => {
    const email = 'test@example.com';
    const password = 'password123';
    const name = 'John Doe';

    inputValidator.validateEmail = jest.fn().mockReturnValue(true);
    inputValidator.validatePassword = jest.fn().mockReturnValue(true);
    passwordHasher.hashPassword = jest.fn().mockResolvedValue('hashedPassword');
    prismaClient.user.create = jest.fn().mockResolvedValue({ id: 1, email, password: 'hashedPassword', name });

    const user = await userService.createUser(email, password, name);

    expect(user).toEqual({ id: 1, email, password: 'hashedPassword', name });
  });

  it('should throw an error if email is invalid', async () => {
    const email = 'invalid-email';
    const password = 'password123';

    inputValidator.validateEmail = jest.fn().mockReturnValue(false);

    await expect(userService.createUser(email, password)).rejects.toThrow('Invalid email');
  });

  it('should throw an error if password is invalid', async () => {
    const email = 'test@example.com';
    const password = 'invalid-password';

    inputValidator.validateEmail = jest.fn().mockReturnValue(true);
    inputValidator.validatePassword = jest.fn().mockReturnValue(false);

    await expect(userService.createUser(email, password)).rejects.toThrow('Invalid password');
  });

  it('should throw an error if both email and password are invalid', async () => {
    const email = 'invalid-email';
    const password = 'invalid-password';

    inputValidator.validateEmail = jest.fn().mockReturnValue(false);
    inputValidator.validatePassword = jest.fn().mockReturnValue(false);

    await expect(userService.createUser(email, password)).rejects.toThrow('Invalid email');
  });

  it('should throw an error if email is missing', async () => {
    const password = 'password123';

    await expect(userService.createUser('', password)).rejects.toThrow('Email is required');
  });

  it('should throw an error if password is missing', async () => {
    const email = 'test@example.com';

    await expect(userService.createUser(email, '')).rejects.toThrow('Password is required');
  });
});