import { User } from "../models/userModel"
import { InputValidator } from "../utils/inputValidator"
import  { PasswordHasher } from "../utils/passwordHasher"

export class UserService implements UserService {
    private inputValidator: InputValidator;
    private passwordHasher: PasswordHasher;

    constructor (inputValidator: InputValidator, passwordHasher:PasswordHasher) {
        this.inputValidator = inputValidator;
        this.passwordHasher = passwordHasher;
    }

    async createUser(email: string, password: string): Promise<typeof User> {
        try {
          if (!this.inputValidator.validateEmail(email)) {
            throw new Error("Invalid email");
          }
          if (!this.inputValidator.validatePassword(password)) {
            throw new Error("Invalid password");
          }
      
          const hashedPassword = await this.passwordHasher.hashPassword(password);
      
          const user = await User.create({
            email,
            password: hashedPassword,
          });
      
          return user;
        } catch (error) {
          console.error("Error creating user:", error);
          throw error;
        }
    }

    async getUserByEmail(email: string): Promise<typeof User | null> {
        try {
          const user = await User.findUnique({
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
}