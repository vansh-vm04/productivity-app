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

interface HabitRowDB {
  id: string;
  name: string;
  icon: string;
  category: string;
  customCategory: string | null;
  priority: string;
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

const parseJson = <T>(value: string | null, fallback: T): T => {
  if (!value) return fallback;

  try {
    return JSON.parse(value) as T;
  } catch {
    return fallback;
  }
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

const convertDBRowToHabit = (row: HabitRowDB): Habit => {
  const frequencyDetails = parseJson<FrequencyDetails>(row.frequencyDetails, {
    type: "daily",
  });

  return {
    id: row.id,
    name: row.name,
    icon: row.icon,
    streak: row.streak,
    completed: false,
    frequency:
      (row.frequency as HabitFrequency) ||
      mapFrequencyDetailsToHabitFrequency(frequencyDetails),
    createdAt: new Date(row.createdAt),
    lastCompletedAt: undefined,
    backgroundColor: "#FFFFFF",
    accentColor: "#059669",
    category: row.category as Habit["category"],
    customCategory: row.customCategory || undefined,
    priority: row.priority as Habit["priority"],
    type: row.type as Habit["type"],
    targetCount: row.targetCount ?? undefined,
    countUnit: row.countUnit ?? undefined,
    targetDuration: row.targetDuration ?? undefined,
    reminders: [],
  };
};

class HabitsRepository {
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
        priority,
        type,
        targetCount,
        countUnit,
        targetDuration,
        frequency,
        frequencyDetails,
        streak,
        createdAt,
        updatedAt
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        habit.id,
        habit.name,
        habit.icon,
        habit.category,
        habit.customCategory || null,
        habit.priority,
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
    const rows = await getAllAsync<HabitRowDB>(
      "SELECT * FROM habits ORDER BY updatedAt DESC",
    );
    return rows.map(convertDBRowToHabit);
  }

  /**
   * Get habit by ID
   */
  async getHabitById(id: string): Promise<Habit | null> {
    const row = await getFirstAsync<HabitRowDB>(
      "SELECT * FROM habits WHERE id = ?",
      [id],
    );
    return row ? convertDBRowToHabit(row) : null;
  }

  /**
   * Get habits by category
   */
  async getHabitsByCategory(category: string): Promise<Habit[]> {
    const rows = await getAllAsync<HabitRowDB>(
      "SELECT * FROM habits WHERE category = ? ORDER BY updatedAt DESC",
      [category],
    );
    return rows.map(convertDBRowToHabit);
  }

  /**
   * Get habits by priority
   */
  async getHabitsByPriority(priority: string): Promise<Habit[]> {
    const rows = await getAllAsync<HabitRowDB>(
      "SELECT * FROM habits WHERE priority = ? ORDER BY updatedAt DESC",
      [priority],
    );
    return rows.map(convertDBRowToHabit);
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
    if (updates.priority !== undefined) {
      updateFields.push("priority = ?");
      values.push(updates.priority);
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
