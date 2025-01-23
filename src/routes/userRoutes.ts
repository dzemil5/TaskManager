import express, { Router } from 'express';
import { UserController } from '../controllers/userController';

const userController = new UserController();

const userRoutes: Router = express.Router();

userRoutes.post('/register', userController.register);
userRoutes.post('/login', userController.login);
userRoutes.get('/profile', userController.getProfile);

export default userRoutes;