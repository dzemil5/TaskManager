import { Router, Request, Response } from 'express';
import { authMiddleware } from '../middlewares/authMiddleware';
import { errorMiddleware } from '../middlewares/errorMiddleware';
import { TaskController } from '../controllers/taskController';

const router: Router = Router();
const taskController = new TaskController();

router.use(authMiddleware);

router.get('/tasks', taskController.getTasks);

router.post('/tasks', taskController.createTask);

router.get('/tasks/priority', taskController.getTasksByPriority);

router.get('/tasks/alphabetical', taskController.getTasksByAlphabeticalOrder);

router.get('/tasks/completion', taskController.getTasksByCompletion);

router.get('/tasks/counts', taskController.getTaskCounts);

router.get('/tasks/:id', (req: Request, res: Response) => {
    const id = parseInt(req.params.id, 10);
    taskController.getTaskById(id, res);
  });

router.put('/tasks/:id', taskController.updateTask);

router.delete('/tasks/:id', taskController.deleteTask);

router.put('/tasks/:id/completion', (req: Request, res: Response) => {
  const id = parseInt(req.params.id, 10);
  taskController.toggleTaskCompletion(id, res);
});


router.use(errorMiddleware);

export default router;