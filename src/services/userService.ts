import { PrismaClient } from '@prisma/client';
import { InputValidator } from "../utils/inputValidator";
import { PasswordHasher } from "../utils/passwordHasher";

const prisma = new PrismaClient();

export class UserService {
    private inputValidator: InputValidator;
    private passwordHasher: PasswordHasher;

    constructor(inputValidator: InputValidator, passwordHasher: PasswordHasher) {
        this.inputValidator = inputValidator;
        this.passwordHasher = passwordHasher;
    }

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
            if (!this.inputValidator.validatePassword(password)) {
                throw new Error("Invalid password");
            }

            const hashedPassword = await this.passwordHasher.hashPassword(password);
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
}