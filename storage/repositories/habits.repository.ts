import {
    FrequencyDetails,
    Habit,
    HabitData,
    HabitFrequency,
} from "@/shared/types/habit";
import { executeAsync, getAllAsync, getFirstAsync } from "../db/database";

type HabitUpdateInput = Partial<HabitData> & {
  streak?: number;
};

interface HabitCompletionRowDB {
  id: string;
  habitId: string;
  completedDate: number;
  createdAt: number;
}

interface HabitRowDB {
  id: string;
  name: string;
  icon: string;
  category: string;
  customCategory: string | null;
  type: string;
  targetCount: number | null;
  countUnit: string | null;
  targetDuration: number | null;
  frequency: string;
  frequencyDetails: string;
  streak: number;
  createdAt: number;
  updatedAt: number;
}

export interface HabitCompletionRecord {
  id: string;
  habitId: string;
  completedDate: Date;
  createdAt: number;
}

const parseJson = <T>(value: string | null, fallback: T): T => {
  if (!value) return fallback;

  try {
    return JSON.parse(value) as T;
  } catch {
    return fallback;
  }
};

const getStartOfDayTimestamp = (date: Date): number => {
  const startOfDay = new Date(date);
  startOfDay.setHours(0, 0, 0, 0);
  return startOfDay.getTime();
};

const mapFrequencyDetailsToHabitFrequency = (
  details: FrequencyDetails,
): HabitFrequency => {
  switch (details.type) {
    case "daily":
    case "weekdays":
      return "daily";
    case "specific_days":
      return "weekly";
    case "custom":
      return "monthly";
    default:
      return "daily";
  }
};

const convertDBRowToHabit = (row: HabitRowDB, completed = false): Habit => {
  const frequencyDetails = parseJson<FrequencyDetails>(row.frequencyDetails, {
    type: "daily",
  });

  return {
    id: row.id,
    name: row.name,
    icon: row.icon,
    streak: row.streak,
    completed,
    frequency:
      (row.frequency as HabitFrequency) ||
      mapFrequencyDetailsToHabitFrequency(frequencyDetails),
    createdAt: new Date(row.createdAt),
    lastCompletedAt: undefined,
    category: row.category as Habit["category"],
    customCategory: row.customCategory || undefined,
    type: row.type as Habit["type"],
    targetCount: row.targetCount ?? undefined,
    countUnit: row.countUnit ?? undefined,
    targetDuration: row.targetDuration ?? undefined,
    reminders: [],
  };
};

const convertDBRowToHabitCompletion = (
  row: HabitCompletionRowDB,
): HabitCompletionRecord => ({
  id: row.id,
  habitId: row.habitId,
  completedDate: new Date(row.completedDate),
  createdAt: row.createdAt,
});

class HabitsRepository {
  private async getCompletedHabitIdsByDate(
    date: Date = new Date(),
  ): Promise<Set<string>> {
    const completedDate = getStartOfDayTimestamp(date);
    const rows = await getAllAsync<{ habitId: string }>(
      "SELECT DISTINCT habitId FROM habit_completion WHERE completedDate = ?",
      [completedDate],
    );

    return new Set(rows.map((row) => row.habitId));
  }

  private async getHabitCompletionRow(
    habitId: string,
    date: Date = new Date(),
  ): Promise<HabitCompletionRowDB | null> {
    const completedDate = getStartOfDayTimestamp(date);
    return await getFirstAsync<HabitCompletionRowDB>(
      "SELECT * FROM habit_completion WHERE habitId = ? AND completedDate = ?",
      [habitId, completedDate],
    );
  }

  /**
   * Create a new habit
   */
  async createHabit(habit: HabitData & { id: string }): Promise<Habit> {
    const now = Date.now();
    const frequencyDetails = habit.frequency;
    const frequency = mapFrequencyDetailsToHabitFrequency(frequencyDetails);

    await executeAsync(
      `INSERT INTO habits (
        id,
        name,
        icon,
        category,
        customCategory,
        type,
        targetCount,
        countUnit,
        targetDuration,
        frequency,
        frequencyDetails,
        streak,
        createdAt,
        updatedAt
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        habit.id,
        habit.name,
        habit.icon,
        habit.category,
        habit.customCategory || null,
        habit.type,
        habit.targetCount ?? null,
        habit.countUnit ?? null,
        habit.targetDuration ?? null,
        frequency,
        JSON.stringify(frequencyDetails),
        0,
        now,
        now,
      ],
    );

    return this.getHabitById(habit.id) as Promise<Habit>;
  }

  /**
   * Get all habits
   */
  async getAllHabits(): Promise<Habit[]> {
    const completedHabitIds = await this.getCompletedHabitIdsByDate();
    const rows = await getAllAsync<HabitRowDB>(
      "SELECT * FROM habits ORDER BY createdAt DESC",
    );
    return rows.map((row) =>
      convertDBRowToHabit(row, completedHabitIds.has(row.id)),
    );
  }

  /**
   * Get habit by ID
   */
  async getHabitById(id: string): Promise<Habit | null> {
    const completedHabitIds = await this.getCompletedHabitIdsByDate();
    const row = await getFirstAsync<HabitRowDB>(
      "SELECT * FROM habits WHERE id = ?",
      [id],
    );
    return row ? convertDBRowToHabit(row, completedHabitIds.has(row.id)) : null;
  }

  /**
   * Get habits by category
   */
  async getHabitsByCategory(category: string): Promise<Habit[]> {
    const rows = await getAllAsync<HabitRowDB>(
      "SELECT * FROM habits WHERE category = ? ORDER BY createdAt DESC",
      [category],
    );
    return rows.map((row) => convertDBRowToHabit(row));
  }

  /**
   * Get completions for a habit
   */
  async getHabitCompletionsByHabitId(
    habitId: string,
  ): Promise<HabitCompletionRecord[]> {
    const rows = await getAllAsync<HabitCompletionRowDB>(
      "SELECT * FROM habit_completion WHERE habitId = ? ORDER BY completedDate DESC",
      [habitId],
    );

    return rows.map(convertDBRowToHabitCompletion);
  }

  /**
   * Get completions for a habit on a specific date
   */
  async getHabitCompletionByDate(
    habitId: string,
    date: Date = new Date(),
  ): Promise<HabitCompletionRecord | null> {
    const row = await this.getHabitCompletionRow(habitId, date);
    return row ? convertDBRowToHabitCompletion(row) : null;
  }

  /**
   * Add a completion for a habit
   */
  async addHabitCompletion(
    habitId: string,
    completedDate: Date = new Date(),
  ): Promise<HabitCompletionRecord | null> {
    const habit = await this.getHabitById(habitId);

    if (!habit) {
      throw new Error(`Habit with id ${habitId} not found`);
    }

    const existingCompletion = await this.getHabitCompletionRow(
      habitId,
      completedDate,
    );
    if (existingCompletion) {
      return convertDBRowToHabitCompletion(existingCompletion);
    }

    const now = Date.now();
    const startOfDay = getStartOfDayTimestamp(completedDate);
    const completionId = `habit_completion_${now}_${Math.random().toString(36).slice(2, 10)}`;

    await executeAsync(
      `INSERT INTO habit_completion (id, habitId, completedDate, createdAt)
       VALUES (?, ?, ?, ?)`,
      [completionId, habitId, startOfDay, now],
    );

    await executeAsync("UPDATE habits SET updatedAt = ? WHERE id = ?", [
      now,
      habitId,
    ]);

    return this.getHabitCompletionByDate(habitId, completedDate);
  }

  /**
   * Remove a completion for a habit
   */
  async removeHabitCompletion(
    habitId: string,
    completedDate: Date = new Date(),
  ): Promise<boolean> {
    const habit = await this.getHabitById(habitId);

    if (!habit) {
      throw new Error(`Habit with id ${habitId} not found`);
    }

    const startOfDay = getStartOfDayTimestamp(completedDate);
    const result = await executeAsync(
      "DELETE FROM habit_completion WHERE habitId = ? AND completedDate = ?",
      [habitId, startOfDay],
    );

    if ((result.changes ?? 0) > 0) {
      await executeAsync("UPDATE habits SET updatedAt = ? WHERE id = ?", [
        Date.now(),
        habitId,
      ]);
    }

    return (result.changes ?? 0) > 0;
  }

  /**
   * Toggle habit completion for a date
   */
  async toggleHabitCompletion(
    habitId: string,
    completedDate: Date = new Date(),
  ): Promise<Habit | null> {
    const existingCompletion = await this.getHabitCompletionRow(
      habitId,
      completedDate,
    );

    if (existingCompletion) {
      await this.removeHabitCompletion(habitId, completedDate);
    } else {
      await this.addHabitCompletion(habitId, completedDate);
    }

    return this.getHabitById(habitId);
  }

  /**
   * Update habit
   */
  async updateHabit(
    id: string,
    updates: HabitUpdateInput,
  ): Promise<Habit | null> {
    const habit = await this.getHabitById(id);

    if (!habit) {
      throw new Error(`Habit with id ${id} not found`);
    }

    const now = Date.now();
    const updateFields: string[] = [];
    const values: (string | number | null)[] = [];

    if (updates.name !== undefined) {
      updateFields.push("name = ?");
      values.push(updates.name);
    }
    if (updates.icon !== undefined) {
      updateFields.push("icon = ?");
      values.push(updates.icon);
    }
    if (updates.category !== undefined) {
      updateFields.push("category = ?");
      values.push(updates.category);
    }
    if (updates.customCategory !== undefined) {
      updateFields.push("customCategory = ?");
      values.push(updates.customCategory || null);
    }
    if (updates.type !== undefined) {
      updateFields.push("type = ?");
      values.push(updates.type);
    }
    if (updates.targetCount !== undefined) {
      updateFields.push("targetCount = ?");
      values.push(updates.targetCount ?? null);
    }
    if (updates.countUnit !== undefined) {
      updateFields.push("countUnit = ?");
      values.push(updates.countUnit ?? null);
    }
    if (updates.targetDuration !== undefined) {
      updateFields.push("targetDuration = ?");
      values.push(updates.targetDuration ?? null);
    }
    if (updates.frequency !== undefined) {
      updateFields.push("frequency = ?");
      values.push(mapFrequencyDetailsToHabitFrequency(updates.frequency));
      updateFields.push("frequencyDetails = ?");
      values.push(JSON.stringify(updates.frequency));
    }
    if (updates.streak !== undefined) {
      updateFields.push("streak = ?");
      values.push(updates.streak);
    }

    if (updateFields.length === 0) {
      return habit;
    }

    updateFields.push("updatedAt = ?");
    values.push(now);
    values.push(id);

    await executeAsync(
      `UPDATE habits SET ${updateFields.join(", ")} WHERE id = ?`,
      values,
    );

    return this.getHabitById(id);
  }

  /**
   * Delete habit
   */
  async deleteHabit(id: string): Promise<boolean> {
    const result = await executeAsync("DELETE FROM habits WHERE id = ?", [id]);

    return (result.changes ?? 0) > 0;
  }

  /**
   * Delete multiple habits
   */
  async deleteHabits(ids: string[]): Promise<number> {
    if (ids.length === 0) return 0;

    const placeholders = ids.map(() => "?").join(",");
    const result = await executeAsync(
      `DELETE FROM habits WHERE id IN (${placeholders})`,
      ids,
    );

    return result.changes ?? 0;
  }

  /**
   * Clear all habits (use with caution)
   */
  async clearAllHabits(): Promise<number> {
    const result = await executeAsync("DELETE FROM habits");
    return result.changes ?? 0;
  }
}

export const habitsRepository = new HabitsRepository();
