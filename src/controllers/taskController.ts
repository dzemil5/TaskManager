import { Request, Response } from 'express';
import { TaskService } from '../services/taskService';
import { InputValidatorImpl } from "../utils/inputValidator";

const inputValidator = new InputValidatorImpl();
const taskService = new TaskService(inputValidator);

export class TaskController {
  async getTasks(req: Request, res: Response) {
    if (!req.user) {
        res.status(401).json({ message: "Unauthorized" });
        return;
    }

    const userId = req.user.id;
    const tasks = await taskService.getUserTasks(userId);
    res.json(tasks);
  }

  async createTask(req: Request, res: Response) {
    const {title, description, dueDate, priority} = req.body;
    if (!title || !description || !dueDate || !priority) {
      res.status(400).json({ message: 'Missing required fields' });
      return;
    }

    if (!req.user) {
        res.status(401).json({ message: "Unauthorized" });
        return;
    }
    try{
      const task = await taskService.createTask(title, description, dueDate, priority, req.user.id);
    res.json(task);
    } catch (error) {
      res.status(500).json({ message: 'Error creating task', error });
    }
    
  }

  async getTaskById(id: number, res: Response) {
    const task = await taskService.getTaskById(id);
    if (!task) {
      res.status(404).json({ message: 'Task not found' });
    } else {
      res.json(task);
    }
  }

  async updateTask(req: Request, res: Response) {
    const id = parseInt(req.params.id, 10);
    const task = await taskService.updateTask(id, req.body);
    if (!task) {
      res.status(404).json({ message: 'Task not found' });
    } else {
      res.json(task);
    }
  }

  async deleteTask(req: Request, res: Response) {
    const id = parseInt(req.params.id, 10);

    await taskService.deleteTask(id);
    res.json({ message: 'Task deleted successfully' });
  }

  async getTasksByPriority(req: Request, res: Response) {
    if (!req.user) {
        res.status(401).json({ message: "Unauthorized" });
        return;
    }
    const userId = req.user.id;
    const tasks = await taskService.getTasksByPriority(userId);
    res.json(tasks);
  }
  
  async getTasksByAlphabeticalOrder(req: Request, res: Response) {
    if (!req.user) {
        res.status(401).json({ message: "Unauthorized" });
        return;
    }
    const userId = req.user.id;
    const asc = req.query.asc === 'true';
    const tasks = await taskService.getTasksByAlphabeticalOrder(userId, asc);
    res.json(tasks);
  }
  
  async getTasksByCompletion(req: Request, res: Response) {
    if (!req.user) {
        res.status(401).json({ message: "Unauthorized" });
        return;
    }
    const userId = req.user.id;
    const tasks = await taskService.getTasksByCompletion(userId);
    res.json(tasks);
  }
  
  async updateTaskCompletion(id: number, isCompleted: boolean, res: Response) {
    try {
      const task = await taskService.updateTaskCompletion(id, isCompleted);
      res.json(task);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }
  
  async getTaskCounts(req: Request, res: Response) {
    if (!req.user) {
        res.status(401).json({ message: "Unauthorized" });
        return;
    }
    const userId = req.user.id;
    const counts = await taskService.getTaskCounts(userId);
    res.json(counts);
  }
}
