import { executeAsync } from '../db/database';

export const initializeTaskSchema = async (): Promise<void> => {
  try {
    // Create tasks table
    await executeAsync(`
      CREATE TABLE IF NOT EXISTS tasks (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        category TEXT NOT NULL,
        priority TEXT NOT NULL DEFAULT 'normal',
        completed INTEGER NOT NULL DEFAULT 0,
        dueDate INTEGER,
        customCategory TEXT,
        createdAt INTEGER NOT NULL,
        updatedAt INTEGER NOT NULL
      );
    `);

    // Create index for efficient queries
    await executeAsync(`
      CREATE INDEX IF NOT EXISTS idx_tasks_completed ON tasks(completed);
    `);

    await executeAsync(`
      CREATE INDEX IF NOT EXISTS idx_tasks_dueDate ON tasks(dueDate);
    `);

    await executeAsync(`
      CREATE INDEX IF NOT EXISTS idx_tasks_category ON tasks(category);
    `);

    console.log('✓ Tasks schema initialized successfully');
  } catch (error) {
    console.error('Failed to initialize tasks schema:', error);
    throw error;
  }
};
