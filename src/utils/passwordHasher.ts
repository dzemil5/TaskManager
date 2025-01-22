import bcrypt from "bcrypt";

export interface PasswordHasher {
    hashPassword(password:string): Promise<string>;
}

export class BcryptPasswordHasher implements PasswordHasher {
    async hashPassword(password:string): Promise<string> {
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        return hashedPassword;
    }
}