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
router.get('/api/tasks/priority', taskController.getTasksByPriority);
router.get('/api/tasks/alphabetical', taskController.getTasksByAlphabeticalOrder);
router.get('/api/tasks/completion', taskController.getTasksByCompletion);
router.put('/api/tasks/:id/completion', taskController.updateTaskCompletion);
router.get('/api/tasks/counts', taskController.getTaskCounts);

router.use(errorMiddleware);

export default router;