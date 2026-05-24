import { Task, TaskData } from "@/shared/types/task";
import { Reminder } from "@/shared/types/habit";
import { executeAsync, getAllAsync, getFirstAsync } from "../db/database";
import { remindersRepository } from "./reminders.repository";

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

const convertDBRowToTask = (row: TaskRowDB, reminders: Reminder[] = []): Task => ({
  id: row.id,
  name: row.name,
  category: row.category as any,
  priority: row.priority as any,
  completed: row.completed === 1,
  dueDate: row.dueDate ? new Date(row.dueDate) : null,
  customCategory: row.customCategory || undefined,
  reminders,
  createdAt: row.createdAt,
  updatedAt: row.updatedAt,
});

class TasksRepository {
  private async getTaskReminders(taskId: string): Promise<Reminder[]> {
    const reminders = await remindersRepository.getRemindersByEntity("task", taskId);
    return reminders.map(({ id, time, label, enabled }) => ({
      id,
      time,
      label,
      enabled,
    }));
  }

  private async syncTaskReminders(taskId: string, reminders: Reminder[]): Promise<void> {
    const existing = await remindersRepository.getRemindersByEntity("task", taskId);
    const existingById = new Map(existing.map((item) => [item.id, item]));
    const incomingById = new Map(reminders.map((item) => [item.id, item]));

    await Promise.all(
      existing
        .filter((item) => !incomingById.has(item.id))
        .map((item) => remindersRepository.deleteReminder(item.id)),
    );

    await Promise.all(
      reminders.map((reminder) => {
        if (existingById.has(reminder.id)) {
          return remindersRepository.updateReminder(reminder.id, {
            time: reminder.time,
            label: reminder.label,
            enabled: reminder.enabled,
          }).then(() => undefined);
        }

        return remindersRepository.createReminder({
          id: reminder.id,
          entityType: "task",
          entityId: taskId,
          time: reminder.time,
          label: reminder.label,
          enabled: reminder.enabled,
        }).then(() => undefined);
      }),
    );
  }

  private async attachRemindersToTasks(rows: TaskRowDB[]): Promise<Task[]> {
    if (rows.length === 0) {
      return [];
    }
    return Promise.all(
      rows.map(async (row) => {
        const reminders = await this.getTaskReminders(row.id);
        return convertDBRowToTask(row, reminders);
      }),
    );
  }

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

    if (task.reminders && task.reminders.length > 0) {
      await Promise.all(
        task.reminders.map((reminder) =>
          remindersRepository.createReminder({
            id: reminder.id,
            entityType: "task",
            entityId: task.id,
            time: reminder.time,
            label: reminder.label,
            enabled: reminder.enabled,
          }),
        ),
      );
    }

    return this.getTaskById(task.id) as Promise<Task>;
  }

  /**
   * Get all tasks
   */
  async getAllTasks(): Promise<Task[]> {
    const rows = await getAllAsync<TaskRowDB>(
      "SELECT * FROM tasks ORDER BY createdAt DESC",
    );
    return this.attachRemindersToTasks(rows);
  }

  /**
   * Get task by ID
   */
  async getTaskById(id: string): Promise<Task | null> {
    const row = await getFirstAsync<TaskRowDB>(
      "SELECT * FROM tasks WHERE id = ?",
      [id],
    );
    if (!row) {
      return null;
    }

    const reminders = await this.getTaskReminders(row.id);
    return convertDBRowToTask(row, reminders);
  }

  /**
   * Get tasks by category
   */
  async getTasksByCategory(category: string): Promise<Task[]> {
    const rows = await getAllAsync<TaskRowDB>(
      "SELECT * FROM tasks WHERE category = ? ORDER BY updatedAt DESC",
      [category],
    );
    return this.attachRemindersToTasks(rows);
  }

  /**
   * Get incomplete tasks
   */
  async getIncompleteTasks(): Promise<Task[]> {
    const rows = await getAllAsync<TaskRowDB>(
      "SELECT * FROM tasks WHERE completed = 0 ORDER BY dueDate ASC, updatedAt DESC",
    );
    return this.attachRemindersToTasks(rows);
  }

  /**
   * Get completed tasks
   */
  async getCompletedTasks(): Promise<Task[]> {
    const rows = await getAllAsync<TaskRowDB>(
      "SELECT * FROM tasks WHERE completed = 1 ORDER BY updatedAt DESC",
    );
    return this.attachRemindersToTasks(rows);
  }

  /**
   * Get tasks by priority
   */
  async getTasksByPriority(priority: string): Promise<Task[]> {
    const rows = await getAllAsync<TaskRowDB>(
      "SELECT * FROM tasks WHERE priority = ? ORDER BY dueDate ASC, updatedAt DESC",
      [priority],
    );
    return this.attachRemindersToTasks(rows);
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
    return this.attachRemindersToTasks(rows);
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
    return this.attachRemindersToTasks(rows);
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

    if (updateFields.length === 0 && updates.reminders === undefined) {
      return task;
    }

    if (updateFields.length > 0) {
      updateFields.push("updatedAt = ?");
      values.push(now);
      values.push(id);

      await executeAsync(
        `UPDATE tasks SET ${updateFields.join(", ")} WHERE id = ?`,
        values,
      );
    }

    if (updates.reminders !== undefined) {
      await this.syncTaskReminders(id, updates.reminders);
    }

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

    if ((result.changes ?? 0) > 0) {
      await remindersRepository.deleteRemindersByEntity("task", id);
    }

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

    if ((result.changes ?? 0) > 0) {
      await Promise.all(
        ids.map((id) => remindersRepository.deleteRemindersByEntity("task", id)),
      );
    }

    return result.changes ?? 0;
  }

  /**
   * Clear all tasks (use with caution)
   */
  async clearAllTasks(): Promise<number> {
    const rows = await getAllAsync<{ id: string }>("SELECT id FROM tasks");
    const result = await executeAsync("DELETE FROM tasks");

    if ((result.changes ?? 0) > 0) {
      await Promise.all(
        rows.map((row) =>
          remindersRepository.deleteRemindersByEntity("task", row.id),
        ),
      );
    }

    return result.changes ?? 0;
  }
}

export const tasksRepository = new TasksRepository();
