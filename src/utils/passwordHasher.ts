import bcrypt from "bcrypt";

export interface PasswordHasher {
    hashPassword(password:string): Promise<string>;
    comparePassword(password:string, hashedPassword:string): Promise<boolean>;
}



export class BcryptPasswordHasher implements PasswordHasher {
    async hashPassword(password:string): Promise<string> {
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        return hashedPassword;
    }
    async comparePassword(password:string, hashedPassword:string): Promise<boolean> {
        return await bcrypt.compare(password,hashedPassword);
    }
}

