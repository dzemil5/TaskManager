import express from 'express';
import { authMiddleware } from '../middlewares/authMiddleware';
import { errorMiddleware } from '../middlewares/errorMiddleware';
import { TaskController } from '../controllers/taskController';

const router = express.Router();
const taskController = new TaskController();

router.use(authMiddleware);

router.get('/api/tasks', taskController.getTasks);
router.post('/api/tasks', taskController.createTask);
router.get('/api/tasks/:id', taskController.getTaskById);
router.put('/api/tasks/:id', taskController.updateTask);
router.delete('/api/tasks/:id', taskController.deleteTask);

router.use(errorMiddleware);

export default router;