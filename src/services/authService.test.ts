import { AuthServiceImpl } from './authService';
import { UserService } from '../services/userService';
import { BcryptPasswordHasher } from '../utils/passwordHasher';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../config/environment';

jest.mock('../services/userService'); // Mock UserService
jest.mock('bcrypt'); // Mock bcrypt module
jest.mock('jsonwebtoken'); // Mock jsonwebtoken module

describe('AuthServiceImpl', () => {
  const authService = new AuthServiceImpl(); // Instantiate AuthServiceImpl

  beforeEach(() => {
    jest.resetAllMocks(); // Reset mocks before each test
  });

  it('should return a token when user is found and password is correct', async () => {
    const user = { id: 1, email: 'test@example.com', password: 'hashedPassword', name: 'Test User' };
    const token = 'mockToken';

    // Mock getUserByEmail to return a user
    (UserService.prototype.getUserByEmail as jest.Mock).mockResolvedValue(user);

    // Mock bcrypt.compare to return true (password is correct)
    (bcrypt.compare as jest.Mock).mockResolvedValue(true);

    // Mock jwt.sign to return a token
    (jwt.sign as jest.Mock).mockReturnValue(token);

    const result = await authService.loginUser('test@example.com', 'password');
    expect(result).toBe(token);
    expect(jwt.sign).toHaveBeenCalledWith(
      { userId: user.id, email: user.email, name: user.name },
      JWT_SECRET,
      { expiresIn: '1h' }
    );
  });

  it('should throw an error when user is not found', async () => {
    // Mock getUserByEmail to return null (user not found)
    (UserService.prototype.getUserByEmail as jest.Mock).mockResolvedValue(null);

    await expect(authService.loginUser('test@example.com', 'password')).rejects.toThrow('User not found');
  });

  it('should throw an error when password is incorrect', async () => {
    const user = { id: 1, email: 'test@example.com', password: 'hashedPassword', name: 'Test User' };

    // Mock getUserByEmail to return a user
    (UserService.prototype.getUserByEmail as jest.Mock).mockResolvedValue(user);

    // Mock bcrypt.compare to return false (incorrect password)
    (bcrypt.compare as jest.Mock).mockResolvedValue(false);

    await expect(authService.loginUser('test@example.com', 'wrongPassword')).rejects.toThrow('Invalid password');
  });
});
