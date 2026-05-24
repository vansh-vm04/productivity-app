import { executeAsync } from "../db/database";

export const initializeNotesSchema = async (): Promise<void> => {
  try {
    // Create notes table
    await executeAsync(`
      CREATE TABLE IF NOT EXISTS notes (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        body TEXT NOT NULL,
        category TEXT NOT NULL,
        customCategory TEXT,
        createdAt INTEGER NOT NULL,
        updatedAt INTEGER NOT NULL
      );
    `);

    // Create index for efficient queries
    await executeAsync(`
      CREATE INDEX IF NOT EXISTS idx_notes_category ON notes(category);
    `);

    await executeAsync(`
      CREATE INDEX IF NOT EXISTS idx_notes_updatedAt ON notes(updatedAt);
    `);

  } catch (error) {
    console.error("Failed to initialize notes schema:", error);
    throw error;
  }
};
