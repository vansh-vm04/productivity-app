import { initializeHabitsSchema } from "./habits.schema";
import { initializeNotesSchema } from "./notes.schema";
import { initializeRemindersSchema } from "./reminders.schema";
import { initializeTaskSchema } from "./tasks.schema";
import { initializeUserSchema } from "./user.schema";

export const initializeAllSchemas = async (): Promise<void> => {
  try {

    await initializeHabitsSchema();
    await initializeTaskSchema();
    await initializeNotesSchema();
    await initializeRemindersSchema();
    await initializeUserSchema();

  } catch (error) {
    console.error("Failed to initialize schemas:", error);
    throw error;
  }
};
