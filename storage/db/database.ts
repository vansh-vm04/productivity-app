import * as SQLite from 'expo-sqlite';

let db: SQLite.SQLiteDatabase | null = null;

export const getDatabase = async (): Promise<SQLite.SQLiteDatabase> => {
  if (db !== null) {
    return db;
  }

  try {
    db = await SQLite.openDatabaseAsync('productivity.db');
    return db;
  } catch (error) {
    console.error('Failed to open database:', error);
    throw error;
  }
};

export const closeDatabase = async (): Promise<void> => {
  if (db !== null) {
    try {
      await db.closeAsync();
      db = null;
    } catch (error) {
      console.error('Failed to close database:', error);
    }
  }
};

export const executeAsync = async (
  sql: string,
  params?: (string | number | null)[]
): Promise<SQLite.SQLiteRunResult> => {
  const database = await getDatabase();
  return database.runAsync(sql, params || []);
};

export const getAllAsync = async <T>(
  sql: string,
  params?: (string | number | null)[]
): Promise<T[]> => {
  const database = await getDatabase();
  return database.getAllAsync<T>(sql, params || []);
};

export const getFirstAsync = async <T>(
  sql: string,
  params?: (string | number | null)[]
): Promise<T | null> => {
  const database = await getDatabase();
  return database.getFirstAsync<T>(sql, params || []);
};
