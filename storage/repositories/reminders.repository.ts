import { Reminder } from "@/shared/types/habit";
import {
  cancelReminderNotificationAsync,
  scheduleReminderNotificationAsync,
} from "@/features/notifications/reminderNotifications.service";
import { executeAsync, getAllAsync, getFirstAsync } from "../db/database";

type ReminderEntityType = "habit" | "task";

export interface ReminderRecord extends Reminder {
  entityType: ReminderEntityType;
  entityId: string;
  notificationId?: string | null;
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
  notificationId?: string | null;
  repeatInterval: number | null;
  createdAt: number;
  updatedAt: number;
}

interface ReminderWithEntityNameRowDB extends ReminderRowDB {
  entityName: string | null;
}

export interface ReminderWithEntityName extends ReminderRecord {
  entityName: string;
}

const convertDBRowToReminder = (row: ReminderRowDB): ReminderRecord => ({
  id: row.id,
  entityType: row.entityType as ReminderEntityType,
  entityId: row.entityId,
  time: row.time,
  label: row.label,
  enabled: row.enabled === 1,
  notificationId: row.notificationId ?? null,
  repeatInterval: row.repeatInterval ?? null,
  createdAt: row.createdAt,
  updatedAt: row.updatedAt,
});

const updateReminderNotificationIdInDb = async (
  id: string,
  notificationId: string | null,
): Promise<void> => {
  await executeAsync("UPDATE reminders SET notificationId = ? WHERE id = ?", [
    notificationId,
    id,
  ]);
};

class RemindersRepository {
  /**
   * Create a new reminder
   */
  async createReminder(
    reminder: Omit<ReminderRecord, "createdAt" | "updatedAt">,
  ): Promise<ReminderRecord> {
    const now = Date.now();

    const repeatInterval = (reminder as any).repeatInterval ?? null;

    await executeAsync(
      `INSERT INTO reminders (id, entityType, entityId, time, label, enabled, notificationId, repeatInterval, createdAt, updatedAt)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        reminder.id,
        reminder.entityType,
        reminder.entityId,
        reminder.time,
        reminder.label,
        reminder.enabled ? 1 : 0,
        null,
        repeatInterval,
        now,
        now,
      ],
    );

    if (reminder.enabled) {
      const notificationId = await scheduleReminderNotificationAsync({
        id: reminder.id,
        entityType: reminder.entityType,
        time: reminder.time,
        label: reminder.label,
        repeatInterval: repeatInterval ?? undefined,
      });

      await updateReminderNotificationIdInDb(reminder.id, notificationId);
    }

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
   * Get all reminders
   */
  async getAllReminders(): Promise<ReminderRecord[]> {
    const rows = await getAllAsync<ReminderRowDB>(
      "SELECT * FROM reminders ORDER BY enabled DESC, time ASC, updatedAt DESC",
    );

    return rows.map(convertDBRowToReminder);
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
   * Get all reminders with linked habit/task name, active reminders first
   */
  async getAllRemindersWithEntityName(): Promise<ReminderWithEntityName[]> {
    const rows = await getAllAsync<ReminderWithEntityNameRowDB>(
      `SELECT r.*, 
          COALESCE(t.name, h.name) AS entityName
       FROM reminders r
       LEFT JOIN tasks t
         ON r.entityType = 'task' AND r.entityId = t.id
       LEFT JOIN habits h
         ON r.entityType = 'habit' AND r.entityId = h.id
       ORDER BY r.enabled DESC, r.time ASC, r.updatedAt DESC`,
    );

    return rows.map((row) => ({
      ...convertDBRowToReminder(row),
      entityName: row.entityName || "Unknown",
    }));
  }

  /**
   * Update reminder notification identifier without changing reminder data
   */
  async updateReminderNotificationId(
    id: string,
    notificationId: string | null,
  ): Promise<void> {
    await updateReminderNotificationIdInDb(id, notificationId);
  }

  /**
   * Update reminder
   */
  async updateReminder(
    id: string,
    updates: Partial<Pick<ReminderRecord, "time" | "label" | "enabled" | "repeatInterval">>,
  ): Promise<ReminderRecord | null> {
    const reminder = await this.getReminderById(id);

    if (!reminder) {
      throw new Error(`Reminder with id ${id} not found`);
    }

    const now = Date.now();
    const updateFields: string[] = [];
    const values: (string | number | null)[] = [];
    const nextTime = updates.time ?? reminder.time;
    const nextLabel = updates.label ?? reminder.label;
    const nextEnabled = updates.enabled ?? reminder.enabled;
    const nextRepeatInterval = updates.repeatInterval !== undefined ? updates.repeatInterval : reminder.repeatInterval;

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
    if (updates.repeatInterval !== undefined) {
      updateFields.push("repeatInterval = ?");
      values.push(updates.repeatInterval);
    }

    const shouldRescheduleNotification =
      nextEnabled &&
      (updates.time !== undefined ||
        updates.label !== undefined ||
        updates.enabled !== undefined ||
        updates.repeatInterval !== undefined ||
        !reminder.notificationId);

    if (updateFields.length === 0 && !shouldRescheduleNotification) {
      return reminder;
    }

    updateFields.push("updatedAt = ?");
    values.push(now);
    values.push(id);

    await executeAsync(
      `UPDATE reminders SET ${updateFields.join(", ")} WHERE id = ?`,
      values,
    );

    if (reminder.notificationId) {
      await cancelReminderNotificationAsync(reminder.notificationId);
    }

    if (nextEnabled) {
      const notificationId = await scheduleReminderNotificationAsync({
        id,
        entityType: reminder.entityType,
        time: nextTime,
        label: nextLabel,
        repeatInterval: nextRepeatInterval ?? undefined,
      });

      await updateReminderNotificationIdInDb(id, notificationId);
    } else {
      await updateReminderNotificationIdInDb(id, null);
    }

    return this.getReminderById(id);
  }

  /**
   * Delete reminder
   */
  async deleteReminder(id: string): Promise<boolean> {
    const reminder = await this.getReminderById(id);

    if (reminder?.notificationId) {
      await cancelReminderNotificationAsync(reminder.notificationId);
    }

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
    const reminders = await this.getRemindersByEntity(entityType, entityId);

    await Promise.all(
      reminders
        .filter((reminder) => reminder.notificationId)
        .map((reminder) =>
          cancelReminderNotificationAsync(reminder.notificationId),
        ),
    );

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
    const reminders = await this.getAllReminders();

    await Promise.all(
      reminders
        .filter((reminder) => reminder.notificationId)
        .map((reminder) =>
          cancelReminderNotificationAsync(reminder.notificationId),
        ),
    );

    const result = await executeAsync("DELETE FROM reminders");
    return result.changes ?? 0;
  }
}

export const remindersRepository = new RemindersRepository();
