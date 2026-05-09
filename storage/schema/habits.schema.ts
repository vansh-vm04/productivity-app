import { executeAsync } from "../db/database";

export const initializeHabitsSchema = async (): Promise<void> => {
  try {
    // Create habits table
    await executeAsync(`
      CREATE TABLE IF NOT EXISTS habits (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        icon TEXT NOT NULL,
        category TEXT NOT NULL,
        customCategory TEXT,
        type TEXT NOT NULL,
        targetCount INTEGER,
        countUnit TEXT,
        targetDuration INTEGER,
        frequency TEXT NOT NULL DEFAULT 'daily',
        frequencyDetails TEXT NOT NULL,
        streak INTEGER NOT NULL DEFAULT 0,
        createdAt INTEGER NOT NULL,
        updatedAt INTEGER NOT NULL
      );
    `);

    // Create indexes for efficient queries
    await executeAsync(`
      CREATE INDEX IF NOT EXISTS idx_habits_category ON habits(category);
    `);

    await executeAsync(`
      CREATE INDEX IF NOT EXISTS idx_habits_updatedAt ON habits(updatedAt);
    `);

    // Create habit completion table
    await executeAsync(`
      CREATE TABLE IF NOT EXISTS habit_completion (
        id TEXT PRIMARY KEY,
        habitId TEXT NOT NULL,
        completedDate INTEGER NOT NULL,
        value INTEGER DEFAULT NULL,
        createdAt INTEGER NOT NULL,
        FOREIGN KEY (habitId) REFERENCES habits(id) ON DELETE CASCADE
      );
    `);

    await executeAsync(`
      CREATE INDEX IF NOT EXISTS idx_habit_completion_habitId ON habit_completion(habitId);
    `);

    await executeAsync(`
      CREATE INDEX IF NOT EXISTS idx_habit_completion_completedDate ON habit_completion(completedDate);
    `);

    console.log("✓ Habits schema initialized successfully");
  } catch (error) {
    console.error("Failed to initialize habits schema:", error);
    throw error;
  }
};
