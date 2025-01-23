import { UserService } from "../services/userService";
import { InputValidatorImpl } from "../utils/inputValidator";
import { BcryptPasswordHasher } from "../utils/passwordHasher";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { TokenPayload } from "../types/user";
import dotenv from "dotenv";

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET as string;

if (!JWT_SECRET) {
  throw new Error("JWT_SECRET is not defined in .env");
}

export class AuthServiceImpl {
  private userService: UserService;

  constructor() {
    const inputValidator = new InputValidatorImpl();
    const passwordHasher = new BcryptPasswordHasher();
    this.userService = new UserService(inputValidator, passwordHasher);
  }

  /**Login metoda za autentikaciju korisnika i vracanje JWT tokena */
  async loginUser(email: string, password: string): Promise<string> {
    const user = await this.userService.getUserByEmail(email);

    if (!user) {
      throw new Error("User not found");
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new Error("Invalid password");
    }

    const payload: TokenPayload = {
      id: user.id,
      email: user.email,
      name: user.name,
    };

    /**Generisanje JWT tokena */
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "1h" });

    return token;
  }

  /**Verifikacija tokena prilikom zahteva za vracanje podataka o korisniku */
  async verifyToken(token: string): Promise<TokenPayload> {
    return new Promise((resolve, reject) => {
      jwt.verify(token, JWT_SECRET, (err, decoded) => {
        if (err) {
          console.error("Error verifying token:", err);
          reject(new Error("Invalid or expired token"));
        } else {
          resolve(decoded as TokenPayload);
        }
      });
    });
  }

  /**Metoda za proveravanje da li je token istekao */
  async isTokenExpired(token: string): Promise<boolean> {
    try {
      jwt.verify(token, JWT_SECRET);
      return false;
    } catch (error) {
      return true;
    }
  }
}
