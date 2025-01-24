import { Request, Response, NextFunction } from "express";
import { UserService } from "../services/userService";
import { InputValidatorImpl } from "../utils/inputValidator";
import { BcryptPasswordHasher } from "../utils/passwordHasher";
import { AuthServiceImpl } from "../services/authService";

const inputValidator = new InputValidatorImpl();
const passwordHasher = new BcryptPasswordHasher();
const userService = new UserService(inputValidator, passwordHasher);
const authService = new AuthServiceImpl();

export const registerUser = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const { email, password, name } = req.body;

  try {
    /**Dodeljivanje sifre userService.createUser */
    const user = await userService.createUser(email, password, name);

    /**Generisanje tokena nakon sto je user kreiran */
    const token = await authService.loginUser(email, password);

    res.status(201).json({ user, token });
  } catch (error: unknown) {
    console.error("Error registering user:", error);
    next(error);
  }
};

/**Logovanje korisnika */
export const loginUser = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const { email, password } = req.body;

  try {
    const token = await authService.loginUser(email, password);
    res.status(200).json({ token });
  } catch (error: unknown) {
    console.error("Error logging in user:", error);
    next(error);
  }
};

/**Vracanje podataka o korisniku */
export const getUserProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const user = req.user;
    if (!user) {
      const error = new Error("User not found");
      error.name = "NotFoundError";
      throw error;
    }

    res.status(200).json({ user });
  } catch (error: unknown) {
    console.error("Error fetching user profile:", error);
    next(error);
  }
};
