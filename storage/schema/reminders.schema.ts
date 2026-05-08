import { executeAsync } from "../db/database";

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
        createdAt INTEGER NOT NULL,
        updatedAt INTEGER NOT NULL
      );
    `);

    await executeAsync(`
      CREATE INDEX IF NOT EXISTS idx_reminders_entity ON reminders(entityType, entityId);
    `);

    await executeAsync(`
      CREATE INDEX IF NOT EXISTS idx_reminders_time ON reminders(time);
    `);

    console.log("✓ Reminders schema initialized successfully");
  } catch (error) {
    console.error("Failed to initialize reminders schema:", error);
    throw error;
  }
};
