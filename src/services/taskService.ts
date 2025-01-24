import { PrismaClient, Task as TaskType,Level } from "@prisma/client";
import { InputValidator } from "../utils/inputValidator";

const prisma = new PrismaClient();
export const Task = prisma.task;

export class TaskService {
  private inputValidator: InputValidator;

  constructor(inputValidator: InputValidator) {
    this.inputValidator = inputValidator;
  }

  async createTask(
    title: string,
    description: string | null,
    dueDate: Date | string,
    priority: Level,
    userId: number
  ): Promise<TaskType> {
    try {
      if (!title.trim()) {
        throw new Error("Title cannot be empty or whitespace only");
      }

      const parsedDueDate = typeof dueDate === 'string' ? new Date(dueDate) : dueDate;

      if (!this.inputValidator.validateDate(parsedDueDate)) {
        throw new Error("Invalid due date: must be a valid date and not in the past");
      }

      const task = await Task.create({
        data: {
          title,
          description,
          dueDate: parsedDueDate,
          priority,
          userId,
        },
      });

      return task;
    } catch (error) {
      console.error("Error creating task:", error);
      throw error;
    }
  }
  async getTaskById(id: number): Promise<TaskType | null> {
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

  async getUserTasks(userId: number): Promise<TaskType[]> {
    try {
      const task = await Task.findMany({
        where: {
          userId,
        },
      });

      return task;
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
      dueDate: Date | string;
      Priority: Level;
    }>
  ): Promise<TaskType | null> {
    try {
      const parsedDueDate = typeof updates.dueDate === 'string' ? new Date(updates.dueDate) : updates.dueDate;
      updates.dueDate = parsedDueDate;
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

  async deleteTask(id: number): Promise<TaskType | null> {
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

  async getTasksByPriority(userId: number) {
    return await prisma.task.findMany({
      where: {
        userId,
      },
      orderBy: {
        priority: 'asc',
      },
    });
  }
  
  async getTasksByAlphabeticalOrder(userId: number, asc: boolean = true) {
    return await prisma.task.findMany({
      where: {
        userId,
      },
      orderBy: {
        title: asc ? 'asc' : 'desc',
      },
    });
  }
  
  async getTasksByCompletion(userId: number) {
    return await prisma.task.findMany({
      where: {
        userId,
      },
      orderBy: {
        isCompleted: 'asc',
      },
    });
  }
  
  async updateTaskCompletion(taskId: number, isCompleted: boolean) {
    return await prisma.task.update({
      where: {
        id: taskId,
      },
      data: {
        isCompleted: !isCompleted,
      },
    });
  }
  
  async getTaskCounts(userId: number) {
    const [totalTasks, completedTasks, incompleteTasks] = await Promise.all([
      prisma.task.count({
        where: {
          userId,
        },
      }),
      prisma.task.count({
        where: {
          userId,
          isCompleted: true,
        },
      }),
      prisma.task.count({
        where: {
          userId,
          isCompleted: false,
        },
      }),
    ]);
  
    return {
      totalTasks,
      completedTasks,
      incompleteTasks,
    };
  }
}
