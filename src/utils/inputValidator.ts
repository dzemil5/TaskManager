export interface InputValidator {
  validateEmail(email: string): boolean;
  validatePassword(password: string): boolean;
}

/**Implementacija interfejsa InputValidator */
export class InputValidatorImpl implements InputValidator {
  /**Metoda za validaciju email adrese */
  validateEmail(email: string): boolean {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
  }

  /**Metoda za validaciju lozinke (bar 6 karaktera i sastoji se iz slova i brojeva) */
  validatePassword(password: string): boolean {
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/;
    return passwordRegex.test(password);
  }
}
