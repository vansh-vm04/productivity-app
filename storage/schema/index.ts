import { initializeNotesSchema } from "./notes.schema";
import { initializeTaskSchema } from "./tasks.schema";

export const initializeAllSchemas = async (): Promise<void> => {
  try {
    console.log("Starting database schema initialization...");

    await initializeTaskSchema();
    await initializeNotesSchema();

    console.log("✓ All schemas initialized successfully");
  } catch (error) {
    console.error("Failed to initialize schemas:", error);
    throw error;
  }
};
