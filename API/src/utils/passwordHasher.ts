import bcrypt from "bcrypt";

/**Interfejs za hashing lozinke */
export interface PasswordHasher {
  hashPassword(password: string): Promise<string>;
  comparePassword(password: string, hashedPassword: string): Promise<boolean>;
}

/**Klasa za hashing lozinke */
export class BcryptPasswordHasher implements PasswordHasher {
  async hashPassword(password: string): Promise<string> {
    const saltRounds = 10;
    return bcrypt.hash(password, saltRounds);
  }
  /**Metoda za poredjenje lozinki (proverava da li su iste) */
  async comparePassword(
    plainPassword: string,
    hashedPassword: string
  ): Promise<boolean> {
    return bcrypt.compare(plainPassword, hashedPassword); 
  }
}
