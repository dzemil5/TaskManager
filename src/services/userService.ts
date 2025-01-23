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

  // Function to hash the password using bcrypt
  async hashPassword(password: string): Promise<string> {
    const saltRounds = 10;
    return bcrypt.hash(password, saltRounds);
  }

  // Function to create a new user
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

      // Validate the raw password format before hashing
      if (!this.inputValidator.validatePassword(password)) {
        console.log("Password provided: ", password);
        throw new Error("Invalid password");
      }

      // Hash the password
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

  // Function to get a user by email
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

  // Login logic (checking if the provided password matches the hashed password)
  async loginUser(email: string, password: string) {
    try {
      const user = await this.getUserByEmail(email);
      if (!user) {
        throw new Error("User not found");
      }

      // Compare password with hashed password from the DB
      const isValidPassword = await bcrypt.compare(password, user.password);
      if (!isValidPassword) {
        throw new Error("Invalid password");
      }

      // User authenticated successfully
      return user;
    } catch (error) {
      console.error("Error logging in:", error);
      throw error;
    }
  }
}

// Utility function to fetch user by email (if needed outside the UserService)
export const fetchEmail = async (email: string) => {
  return prisma.user.findUnique({
    where: { email },
  });
};
