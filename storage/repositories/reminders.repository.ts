import { Reminder } from "@/shared/types/habit";
import { executeAsync, getAllAsync, getFirstAsync } from "../db/database";

type ReminderEntityType = "habit" | "task";

export interface ReminderRecord extends Reminder {
  entityType: ReminderEntityType;
  entityId: string;
  createdAt: number;
  updatedAt: number;
}

interface ReminderRowDB {
  id: string;
  entityType: string;
  entityId: string;
  time: string;
  label: string;
  enabled: number;
  createdAt: number;
  updatedAt: number;
}

const convertDBRowToReminder = (row: ReminderRowDB): ReminderRecord => ({
  id: row.id,
  entityType: row.entityType as ReminderEntityType,
  entityId: row.entityId,
  time: row.time,
  label: row.label,
  enabled: row.enabled === 1,
  createdAt: row.createdAt,
  updatedAt: row.updatedAt,
});

class RemindersRepository {
  /**
   * Create a new reminder
   */
  async createReminder(
    reminder: Omit<ReminderRecord, "createdAt" | "updatedAt">,
  ): Promise<ReminderRecord> {
    const now = Date.now();

    await executeAsync(
      `INSERT INTO reminders (id, entityType, entityId, time, label, enabled, createdAt, updatedAt)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        reminder.id,
        reminder.entityType,
        reminder.entityId,
        reminder.time,
        reminder.label,
        reminder.enabled ? 1 : 0,
        now,
        now,
      ],
    );
    console.log(`Created reminder with id ${reminder.id} for ${reminder.entityType} ${reminder.entityId}`);
    return this.getReminderById(reminder.id) as Promise<ReminderRecord>;
  }

  /**
   * Get reminder by ID
   */
  async getReminderById(id: string): Promise<ReminderRecord | null> {
    const row = await getFirstAsync<ReminderRowDB>(
      "SELECT * FROM reminders WHERE id = ?",
      [id],
    );
    return row ? convertDBRowToReminder(row) : null;
  }

  /**
   * Get reminders by entity
   */
  async getRemindersByEntity(
    entityType: ReminderEntityType,
    entityId: string,
  ): Promise<ReminderRecord[]> {
    const rows = await getAllAsync<ReminderRowDB>(
      "SELECT * FROM reminders WHERE entityType = ? AND entityId = ? ORDER BY time ASC, updatedAt DESC",
      [entityType, entityId],
    );
    return rows.map(convertDBRowToReminder);
  }

  /**
   * Update reminder
   */
  async updateReminder(
    id: string,
    updates: Partial<Pick<ReminderRecord, "time" | "label" | "enabled">>,
  ): Promise<ReminderRecord | null> {
    const reminder = await this.getReminderById(id);

    if (!reminder) {
      throw new Error(`Reminder with id ${id} not found`);
    }

    const now = Date.now();
    const updateFields: string[] = [];
    const values: (string | number | null)[] = [];

    if (updates.time !== undefined) {
      updateFields.push("time = ?");
      values.push(updates.time);
    }
    if (updates.label !== undefined) {
      updateFields.push("label = ?");
      values.push(updates.label);
    }
    if (updates.enabled !== undefined) {
      updateFields.push("enabled = ?");
      values.push(updates.enabled ? 1 : 0);
    }

    if (updateFields.length === 0) {
      return reminder;
    }

    updateFields.push("updatedAt = ?");
    values.push(now);
    values.push(id);

    await executeAsync(
      `UPDATE reminders SET ${updateFields.join(", ")} WHERE id = ?`,
      values,
    );

    return this.getReminderById(id);
  }

  /**
   * Delete reminder
   */
  async deleteReminder(id: string): Promise<boolean> {
    const result = await executeAsync("DELETE FROM reminders WHERE id = ?", [
      id,
    ]);
    return (result.changes ?? 0) > 0;
  }

  /**
   * Delete reminders by entity
   */
  async deleteRemindersByEntity(
    entityType: ReminderEntityType,
    entityId: string,
  ): Promise<number> {
    const result = await executeAsync(
      "DELETE FROM reminders WHERE entityType = ? AND entityId = ?",
      [entityType, entityId],
    );

    return result.changes ?? 0;
  }

  /**
   * Clear all reminders (use with caution)
   */
  async clearAllReminders(): Promise<number> {
    const result = await executeAsync("DELETE FROM reminders");
    return result.changes ?? 0;
  }
}

export const remindersRepository = new RemindersRepository();
