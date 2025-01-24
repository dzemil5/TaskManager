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

    const task = await taskService.createTask(title, description, dueDate, priority, req.user.id);
    res.json(task);
  }

  async getTaskById(req: Request, res: Response) {
    const id = parseInt(req.params.id, 10);
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
}