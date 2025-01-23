import { Request, Response, NextFunction } from 'express';
import { AuthServiceImpl } from '../services/authService';
import { TokenPayload } from '../types/user';

const authService = new AuthServiceImpl();

declare global {
  namespace Express {
    interface Request {
      user?: TokenPayload;
    }
  }
}

export const authMiddleware = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    // Retrieve token from the Authorization header
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    console.log("Received Token:", token); // Debugging line

    if (!token) {
      console.error('Authorization header missing or token not provided');
      res.status(401).json({ message: 'Authorization token required' });
      return;
    }

    // Use the verifyToken method from AuthServiceImpl to verify the token
    const decoded = await authService.verifyToken(token);

    console.log("Decoded Token:", decoded); // Debugging line

    // Check if the payload is valid
    const { id, email, name } = decoded;
    if (!id || !email || name === undefined) {
      console.error('Invalid token payload:', decoded);
      res.status(401).json({ message: 'Invalid token payload' });
      return;
    }

    // Attach the user data to the request object
    req.user = { id, email, name };

    next();
  } catch (error) {
    console.error('Token verification error:', error);
    res.status(401).json({ message: 'Invalid or expired token' });
    return;
  }
};
