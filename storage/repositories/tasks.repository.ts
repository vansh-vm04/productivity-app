import { Task, TaskData } from "@/shared/types/task";
import { executeAsync, getAllAsync, getFirstAsync } from "../db/database";

interface TaskRowDB {
  id: string;
  name: string;
  category: string;
  priority: string;
  completed: number;
  dueDate: number | null;
  customCategory: string | null;
  createdAt: number;
  updatedAt: number;
}

const convertDBRowToTask = (row: TaskRowDB): Task => ({
  id: row.id,
  name: row.name,
  category: row.category as any,
  priority: row.priority as any,
  completed: row.completed === 1,
  dueDate: row.dueDate ? new Date(row.dueDate) : null,
  customCategory: row.customCategory || undefined,
  createdAt: row.createdAt,
  updatedAt: row.updatedAt,
});

class TasksRepository {
  /**
   * Create a new task
   */
  async createTask(task: TaskData & { id: string }): Promise<Task> {
    const now = Date.now();

    await executeAsync(
      `INSERT INTO tasks (id, name, category, priority, completed, dueDate, customCategory, createdAt, updatedAt)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        task.id,
        task.name,
        task.category,
        task.priority,
        0,
        task.dueDate ? new Date(task.dueDate).getTime() : null,
        task.customCategory || null,
        now,
        now,
      ],
    );

    return this.getTaskById(task.id) as Promise<Task>;
  }

  /**
   * Get all tasks
   */
  async getAllTasks(): Promise<Task[]> {
    const rows = await getAllAsync<TaskRowDB>(
      "SELECT * FROM tasks ORDER BY updatedAt DESC",
    );
    return rows.map(convertDBRowToTask);
  }

  /**
   * Get task by ID
   */
  async getTaskById(id: string): Promise<Task | null> {
    const row = await getFirstAsync<TaskRowDB>(
      "SELECT * FROM tasks WHERE id = ?",
      [id],
    );
    return row ? convertDBRowToTask(row) : null;
  }

  /**
   * Get tasks by category
   */
  async getTasksByCategory(category: string): Promise<Task[]> {
    const rows = await getAllAsync<TaskRowDB>(
      "SELECT * FROM tasks WHERE category = ? ORDER BY updatedAt DESC",
      [category],
    );
    return rows.map(convertDBRowToTask);
  }

  /**
   * Get incomplete tasks
   */
  async getIncompleteTasks(): Promise<Task[]> {
    const rows = await getAllAsync<TaskRowDB>(
      "SELECT * FROM tasks WHERE completed = 0 ORDER BY dueDate ASC, updatedAt DESC",
    );
    return rows.map(convertDBRowToTask);
  }

  /**
   * Get completed tasks
   */
  async getCompletedTasks(): Promise<Task[]> {
    const rows = await getAllAsync<TaskRowDB>(
      "SELECT * FROM tasks WHERE completed = 1 ORDER BY updatedAt DESC",
    );
    return rows.map(convertDBRowToTask);
  }

  /**
   * Get tasks by priority
   */
  async getTasksByPriority(priority: string): Promise<Task[]> {
    const rows = await getAllAsync<TaskRowDB>(
      "SELECT * FROM tasks WHERE priority = ? ORDER BY dueDate ASC, updatedAt DESC",
      [priority],
    );
    return rows.map(convertDBRowToTask);
  }

  /**
   * Get tasks due today
   */
  async getTasksDueToday(): Promise<Task[]> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const rows = await getAllAsync<TaskRowDB>(
      "SELECT * FROM tasks WHERE dueDate >= ? AND dueDate < ? ORDER BY dueDate ASC",
      [today.getTime(), tomorrow.getTime()],
    );
    return rows.map(convertDBRowToTask);
  }

  /**
   * Get tasks due this week
   */
  async getTasksDueThisWeek(): Promise<Task[]> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const nextWeek = new Date(today);
    nextWeek.setDate(nextWeek.getDate() + 7);

    const rows = await getAllAsync<TaskRowDB>(
      "SELECT * FROM tasks WHERE dueDate >= ? AND dueDate < ? ORDER BY dueDate ASC",
      [today.getTime(), nextWeek.getTime()],
    );
    return rows.map(convertDBRowToTask);
  }

  /**
   * Update task
   */
  async updateTask(
    id: string,
    updates: Partial<TaskData>,
  ): Promise<Task | null> {
    const task = await this.getTaskById(id);

    if (!task) {
      throw new Error(`Task with id ${id} not found`);
    }

    const now = Date.now();
    const updateFields: string[] = [];
    const values: (string | number | null)[] = [];

    if (updates.name !== undefined) {
      updateFields.push("name = ?");
      values.push(updates.name);
    }
    if (updates.category !== undefined) {
      updateFields.push("category = ?");
      values.push(updates.category);
    }
    if (updates.priority !== undefined) {
      updateFields.push("priority = ?");
      values.push(updates.priority);
    }
    if (updates.dueDate !== undefined) {
      updateFields.push("dueDate = ?");
      values.push(updates.dueDate ? new Date(updates.dueDate).getTime() : null);
    }
    if (updates.customCategory !== undefined) {
      updateFields.push("customCategory = ?");
      values.push(updates.customCategory || null);
    }

    if (updateFields.length === 0) {
      return task;
    }

    updateFields.push("updatedAt = ?");
    values.push(now);
    values.push(id);

    await executeAsync(
      `UPDATE tasks SET ${updateFields.join(", ")} WHERE id = ?`,
      values,
    );

    return this.getTaskById(id);
  }

  /**
   * Toggle task completion status
   */
  async toggleTaskCompletion(id: string): Promise<Task | null> {
    const task = await this.getTaskById(id);

    if (!task) {
      throw new Error(`Task with id ${id} not found`);
    }

    await executeAsync(
      "UPDATE tasks SET completed = ?, updatedAt = ? WHERE id = ?",
      [task.completed ? 0 : 1, Date.now(), id],
    );

    return this.getTaskById(id);
  }

  /**
   * Delete task
   */
  async deleteTask(id: string): Promise<boolean> {
    const result = await executeAsync("DELETE FROM tasks WHERE id = ?", [id]);

    return (result.changes ?? 0) > 0;
  }

  /**
   * Delete multiple tasks
   */
  async deleteTasks(ids: string[]): Promise<number> {
    if (ids.length === 0) return 0;

    const placeholders = ids.map(() => "?").join(",");
    const result = await executeAsync(
      `DELETE FROM tasks WHERE id IN (${placeholders})`,
      ids,
    );

    return result.changes ?? 0;
  }

  /**
   * Clear all tasks (use with caution)
   */
  async clearAllTasks(): Promise<number> {
    const result = await executeAsync("DELETE FROM tasks");
    return result.changes ?? 0;
  }
}

export const tasksRepository = new TasksRepository();
