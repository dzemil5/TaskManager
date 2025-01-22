import { Task } from "../models/taskModel";
import { InputValidator } from "../utils/inputValidator";

export class TaskService {
  private inputValidator: InputValidator;

  constructor(inputValidator: InputValidator) {
    this.inputValidator = inputValidator;
  }

  async createTask(
    title: string,
    description: string | null,
    dueDate: Date,
    priority: "LOW" | "MEDIUM" | "HIGH",
    userId: number
  ): Promise<typeof Task> {
    try {
      if (!title.trim()) {
        throw new Error("Title cannot be empty or whitespace only");
      }

      if (!this.inputValidator.validateDate(dueDate)) {
        throw new Error("Invalid due date: must be a valid date and not in the past");
      }

      const task = await Task.create({
        title,
        description,
        dueDate,
        Priority: priority,
        userId,
      });

      return task;
    } catch (error) {
      console.error("Error creating task:", error);
      throw error;
    }
  }
  async getTaskById(id: number): Promise<typeof Task | null> {
    try {
      const task = await Task.findUnique({
        where: {
          id,
        },
      });

      return task;
    } catch (error) {
      console.error("Error retrieving task by ID:", error);
      throw error;
    }
  }

  async getUserTasks(userId: number): Promise<typeof Task[]> {
    try {
      const tasks = await Task.findMany({
        where: {
          userId,
        },
      });

      return tasks;
    } catch (error) {
      console.error("Error retrieving tasks by user ID:", error);
      throw error;
    }
  }

  async updateTask(
    id: number,
    updates: Partial<{
      title: string;
      description: string | null;
      dueDate: Date;
      Priority: "LOW" | "MEDIUM" | "HIGH";
    }>
  ): Promise<typeof Task | null> {
    try {
      const task = await Task.update({
        where: { id },
        data: updates,
      });

      return task;
    } catch (error) {
      console.error("Error updating task:", error);
      throw error;
    }
  }

  async deleteTask(id: number): Promise<typeof Task | null> {
    try {
      const task = await Task.delete({
        where: {
          id,
        },
      });

      return task;
    } catch (error) {
      console.error("Error deleting task:", error);
      throw error;
    }
  }
}
