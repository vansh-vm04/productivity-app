import { initializeTaskSchema } from './tasks.schema';

export const initializeAllSchemas = async (): Promise<void> => {
  try {
    console.log('Starting database schema initialization...');
    
    await initializeTaskSchema();
    
    console.log('✓ All schemas initialized successfully');
  } catch (error) {
    console.error('Failed to initialize schemas:', error);
    throw error;
  }
};
