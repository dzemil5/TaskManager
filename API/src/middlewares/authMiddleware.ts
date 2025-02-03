import { Request, Response, NextFunction } from "express";
import { AuthServiceImpl } from "../services/authService";
import { TokenPayload } from "../types/user";

const authService = new AuthServiceImpl();

declare global {
  namespace Express {
    interface Request {
      user?: TokenPayload;
    }
  }
}

export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    /**Uzimanje tokena iz Authorization headera */
    const token = req.header("Authorization")?.replace("Bearer ", "");

    console.log("Received Token:", token); /**Debug */

    if (!token) {
      console.error("Authorization header missing or token not provided");
      res.status(401).json({ message: "Authorization token required" });
      return;
    }

    /**Koriscenje verifyToken metode za verifikaciju tokena */
    const decoded = await authService.verifyToken(token);

    console.log("Decoded Token:", decoded); /**Debug */

    /**Provera payloada */
    const { id, email, name } = decoded;
    if (!id || !email || name === undefined) {
      console.error("Invalid token payload:", decoded);
      res.status(401).json({ message: "Invalid token payload" });
      return;
    }

    /**Vezanje korisnickih podataka na request */
    req.user = { id, email, name };

    next();
  } catch (error) {
    console.error("Token verification error:", error);
    res.status(401).json({ message: "Invalid or expired token" });
    return;
  }
};
