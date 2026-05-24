import { executeAsync, getAllAsync } from "../db/database";

const ensureReminderNotificationColumn = async (): Promise<void> => {
  const columns = await getReminderTableColumns();

  if (!columns.has("notificationId")) {
    await executeAsync("ALTER TABLE reminders ADD COLUMN notificationId TEXT");
  }
};

const getReminderTableColumns = async (): Promise<Set<string>> => {
  const rows = await getAllAsync<{ name: string }>("PRAGMA table_info(reminders)");
  return new Set(rows.map((row) => row.name));
};

export const initializeRemindersSchema = async (): Promise<void> => {
  try {
    // Create reminders table (shared by habits and tasks)
    await executeAsync(`
      CREATE TABLE IF NOT EXISTS reminders (
        id TEXT PRIMARY KEY,
        entityType TEXT NOT NULL,
        entityId TEXT NOT NULL,
        time TEXT NOT NULL,
        label TEXT NOT NULL,
        enabled INTEGER NOT NULL DEFAULT 1,
        notificationId TEXT,
        createdAt INTEGER NOT NULL,
        updatedAt INTEGER NOT NULL
      );
    `);

    await ensureReminderNotificationColumn();

    await executeAsync(`
      CREATE INDEX IF NOT EXISTS idx_reminders_entity ON reminders(entityType, entityId);
    `);

    await executeAsync(`
      CREATE INDEX IF NOT EXISTS idx_reminders_time ON reminders(time);
    `);

  } catch (error) {
    console.error("Failed to initialize reminders schema:", error);
    throw error;
  }
};
