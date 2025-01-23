export interface InputValidator {
    validateEmail(email: string): boolean;
    validatePassword(password: string): boolean;
}

export class InputValidatorImpl implements InputValidator {
    validateEmail(email: string): boolean {
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        return emailRegex.test(email);
    }

    // Correct regex for password validation (checks raw password format)
    validatePassword(password: string): boolean {
        // Ensure the password is at least 6 characters and contains letters and digits
        const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/;
        return passwordRegex.test(password);
    }
}
