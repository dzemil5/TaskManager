import { PrismaClient } from "@prisma/client";
import { InputValidator } from "../utils/inputValidator";
import { PasswordHasher } from "../utils/passwordHasher";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

export class UserService {
  private inputValidator: InputValidator;
  private passwordHasher: PasswordHasher;

  constructor(inputValidator: InputValidator, passwordHasher: PasswordHasher) {
    this.inputValidator = inputValidator;
    this.passwordHasher = passwordHasher;
  }

  /**Hesiranje sifre pomocu bcrypt */
  async hashPassword(password: string): Promise<string> {
    const saltRounds = 10;
    return bcrypt.hash(password, saltRounds);
  }

  /**Funkcija za kreiranje novog korisnika */
  async createUser(email: string, password: string, name?: string) {
    try {
      if (!email) {
        throw new Error("Email is required");
      }
      if (!password) {
        throw new Error("Password is required");
      }
      if (!this.inputValidator.validateEmail(email)) {
        throw new Error("Invalid email");
      }

      /**Validacija formata sifre pre hashinga */
      if (!this.inputValidator.validatePassword(password)) {
        console.log("Password provided: ", password);
        throw new Error("Invalid password");
      }

      /**Hashing */
      const hashedPassword = await this.hashPassword(password);

      const user = await prisma.user.create({
        data: {
          email,
          password: hashedPassword,
          name: name || null,
        },
      });

      return user;
    } catch (error) {
      console.error("Error creating user:", error);
      throw error;
    }
  }

  /**Vracanje korisnika po emailu */
  async getUserByEmail(email: string) {
    try {
      const user = await prisma.user.findUnique({
        where: {
          email,
        },
      });
      return user;
    } catch (error) {
      console.error("Error finding user by email:", error);
      throw error;
    }
  }

  /**Logika za login(proverava da li sifra odgovara hasiranoj sifri) */
  async loginUser(email: string, password: string) {
    try {
      const user = await this.getUserByEmail(email);
      if (!user) {
        throw new Error("User not found");
      }

      /**Poredi sifru sa hasiranom sifrom iz baze */
      const isValidPassword = await bcrypt.compare(password, user.password);
      if (!isValidPassword) {
        throw new Error("Invalid password");
      }

      /**Uspesna autentikacija */
      return user;
    } catch (error) {
      console.error("Error logging in:", error);
      throw error;
    }
  }
}
