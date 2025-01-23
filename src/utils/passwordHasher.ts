import bcrypt from "bcrypt";

export interface PasswordHasher {
    hashPassword(password:string): Promise<string>;
    comparePassword(password:string, hashedPassword:string): Promise<boolean>;
}

export class BcryptPasswordHasher implements PasswordHasher {
    async hashPassword(password: string): Promise<string> {
        const saltRounds = 10;
        return bcrypt.hash(password, saltRounds);
    }

    async comparePassword(plainPassword: string, hashedPassword: string): Promise<boolean> {
        return bcrypt.compare(plainPassword, hashedPassword);  // Use bcrypt.compare to check passwords
    }
}