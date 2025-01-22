export interface InputValidator {
    validateEmail(email:string): boolean;
    validatePassword(password:string):boolean;
}

export class InputValidatorImpl implements InputValidator {
    validateEmail(email:string): boolean {
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        return emailRegex.test(email);
    }

    validatePassword(password:string):boolean{
        const passwordRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        return passwordRegex.test(password);
    }
}