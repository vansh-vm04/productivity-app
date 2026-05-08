import { initializeHabitsSchema } from "./habits.schema";
import { initializeNotesSchema } from "./notes.schema";
import { initializeRemindersSchema } from "./reminders.schema";
import { initializeTaskSchema } from "./tasks.schema";

export const initializeAllSchemas = async (): Promise<void> => {
  try {
    console.log("Starting database schema initialization...");

    await initializeHabitsSchema();
    await initializeTaskSchema();
    await initializeNotesSchema();
    await initializeRemindersSchema();

    console.log("✓ All schemas initialized successfully");
  } catch (error) {
    console.error("Failed to initialize schemas:", error);
    throw error;
  }
};
