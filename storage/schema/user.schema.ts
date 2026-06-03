import { executeAsync } from "../db/database";

export const initializeUserSchema = async (): Promise<void> => {
  try {
    await executeAsync(`
      CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        email TEXT NOT NULL,
        createdAt INTEGER NOT NULL
      );
    `);
  } catch (error) {
    console.error("Failed to initialize user schema:", error);
    throw error;
  }
};
