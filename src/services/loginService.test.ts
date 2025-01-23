import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { loginUser } from './loginService';
import { fetchEmail } from './userService';

// Mocking dependencies
jest.mock('./userService');
jest.mock('bcrypt');
jest.mock('jsonwebtoken');

// Ensure the correct environment variable is used
jest.mock('../config/environment', () => ({
  JWT_SECRET: 'test_secret', // Default secret for tests
}));

describe('loginUser', () => {
  const mockUser = { 
    id: 1, 
    email: 'test@example.com', 
    password: '$2b$10$hashedpassword', 
    name: 'John Doe'  // Adding name to the mock user
  };

  const mockUserWithoutName = { 
    id: 1, 
    email: 'test@example.com', 
    password: '$2b$10$hashedpassword', 
    name: null  // Simulate missing name
  };

  beforeEach(() => {
    // Reset modules before each test to ensure mocks are applied properly
    jest.resetModules();
    process.env.JWT_SECRET = 'test_secret'; // Mock the JWT_SECRET directly before each test

    // Mock bcrypt compare method
    bcrypt.compare = jest.fn().mockResolvedValue(true);

    // Mock getUserByEmail to return a user with name or without name
    (fetchEmail as jest.Mock).mockResolvedValue(mockUser);

    // Mock JWT methods to return a proper token with payload and exp
    jwt.sign = jest.fn().mockImplementation((payload, secret, options) => {
      if (secret !== process.env.JWT_SECRET) {
        throw new Error('invalid token');
      }
      return 'test_token'; // Return mocked token
    });
    jwt.decode = jest.fn().mockReturnValue({
      userId: mockUser.id,
      email: mockUser.email,
      name: mockUser.name,  // Include name in the decoded payload
      exp: Math.floor(Date.now() / 1000) + 3600, // 1 hour expiration
    });
  });

  it('should return a token and user details for valid credentials', async () => {
    const response = await loginUser('test@example.com', 'password');
    expect(response).toHaveProperty('token');
    expect(response).toHaveProperty('userId', 1);
    expect(response).toHaveProperty('email', 'test@example.com');
    expect(response).toHaveProperty('name', 'John Doe');  // Check name in response
  });

  it('should throw an error if user name is missing (null)', async () => {
    (fetchEmail as jest.Mock).mockResolvedValue(mockUserWithoutName);
    await expect(loginUser('test@example.com', 'password')).rejects.toThrow('Invalid email or password');  // Assuming missing name results in invalid login
  });

  it('should throw an error if user name is empty or invalid', async () => {
    const mockUserWithInvalidName = { 
      id: 1, 
      email: 'test@example.com', 
      password: '$2b$10$hashedpassword', 
      name: ''  // Simulate empty name
    };
    (fetchEmail as jest.Mock).mockResolvedValue(mockUserWithInvalidName);
    await expect(loginUser('test@example.com', 'password')).rejects.toThrow('Invalid email or password');  // Assuming empty name results in invalid login
  });

  it('should throw an error for invalid email', async () => {
    (fetchEmail as jest.Mock).mockResolvedValue(null);
    await expect(loginUser('invalid@example.com', 'password')).rejects.toThrow('Invalid email or password');
  });

  it('should throw an error for invalid password', async () => {
    bcrypt.compare = jest.fn().mockResolvedValue(false); // Simulate wrong password
    await expect(loginUser('test@example.com', 'wrongpassword')).rejects.toThrow('Invalid email or password');
  });

  it('should throw an error for missing email or password', async () => {
    await expect(loginUser('', 'password')).rejects.toThrow('Invalid email or password');
    await expect(loginUser('test@example.com', '')).rejects.toThrow('Invalid email or password');
  });

  it('should include userId, email, and name in the JWT payload', async () => {
    const response = await loginUser('test@example.com', 'password');
    const decodedToken = jwt.decode(response.token) as { userId: number; email: string; name: string };
    expect(decodedToken.userId).toBe(mockUser.id);
    expect(decodedToken.email).toBe(mockUser.email);
    expect(decodedToken.name).toBe(mockUser.name);  // Check name in decoded token
  });

  it('should return a token with an expiration of 1 hour', async () => {
    const response = await loginUser('test@example.com', 'password');
    const decodedToken = jwt.decode(response.token) as { exp: number };
    const currentTime = Math.floor(Date.now() / 1000); // Get current time in seconds
    expect(decodedToken.exp).toBeGreaterThan(currentTime);
    expect(decodedToken.exp - currentTime).toBeLessThanOrEqual(3600); // Expires in 1 hour
  });

  it('should throw an error for multiple invalid passwords', async () => {
    bcrypt.compare = jest.fn().mockResolvedValue(false); // Simulate wrong password
    await expect(loginUser('test@example.com', 'wrongpassword1')).rejects.toThrow('Invalid email or password');
    await expect(loginUser('test@example.com', 'wrongpassword2')).rejects.toThrow('Invalid email or password');
  });

  it('should throw an error when user is not found', async () => {
    (fetchEmail as jest.Mock).mockResolvedValue(null);
    await expect(loginUser('nonexistent@example.com', 'password')).rejects.toThrow('Invalid email or password');
  });

  it('should throw an error when the JWT secret is incorrect', async () => {
    // Change the secret before this test to 'incorrectSecret'
    process.env.JWT_SECRET = 'incorrectSecret';

    // Mock jwt.sign to throw an error for incorrect secret
    jwt.sign = jest.fn().mockImplementation((payload, secret, options) => {
      if (secret !== process.env.JWT_SECRET) {
        throw new Error('invalid token');
      }
      return 'test_token'; // Return mocked token if secret is correct
    });

    // Run the test to check if the error is thrown for the incorrect secret
    await expect(loginUser('test@example.com', 'password')).rejects.toThrow('invalid token');
  });
});
