export interface InputValidator {
    validateEmail(email:string): boolean;
    validatePassword(password:string):boolean;
    validateDate(date: Date): boolean;
}

export class InputValidatorImpl implements InputValidator {
    validateEmail(email:string): boolean {
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        return emailRegex.test(email);
    }

    validatePassword(password:string):boolean{
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        return passwordRegex.test(password);
    }

    validateDate(date: Date): boolean {
        const now = new Date();
        return date instanceof Date && !isNaN(date.getTime()) && date >= now;
      }
}