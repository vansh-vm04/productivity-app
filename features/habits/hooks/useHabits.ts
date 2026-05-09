import { Habit, HabitData } from "@/shared/types/habit";
import { habitsRepository } from "@/storage";
import { useCallback, useEffect, useState } from "react";

interface UseHabitsState {
  habits: Habit[];
  loading: boolean;
  error: string | null;
}

interface UseHabitsReturn extends UseHabitsState {
  refetch: () => Promise<void>;
  getHabitCompletionValuesByDate: (
    date?: Date,
  ) => Promise<Record<string, number>>;
  createHabit: (habit: HabitData & { id: string }) => Promise<Habit | null>;
  updateHabit: (
    id: string,
    updates: Partial<HabitData>,
  ) => Promise<Habit | null>;
  deleteHabit: (id: string) => Promise<boolean>;
  deleteHabits: (ids: string[]) => Promise<number>;
  getHabitById: (id: string) => Promise<Habit | null>;
  getHabitsByCategory: (category: string) => Promise<Habit[]>;
  getHabitCompletionsByHabitId: (habitId: string) => Promise<
    {
      id: string;
      habitId: string;
      completedDate: Date;
      value: number;
      createdAt: number;
    }[]
  >;
  getHabitCompletionByDate: (
    habitId: string,
    date?: Date,
  ) => Promise<{
    id: string;
    habitId: string;
    completedDate: Date;
    createdAt: number;
    value: number;
  } | null>;
  addHabitCompletion: (
    habitId: string,
    completedDate?: Date,
    value?: number,
  ) => Promise<{
    id: string;
    habitId: string;
    completedDate: Date;
    createdAt: number;
    value: number;
  } | null>;
  setHabitCompletionValue: (
    habitId: string,
    completedDate: Date | undefined,
    value: number,
  ) => Promise<{
    id: string;
    habitId: string;
    completedDate: Date;
    createdAt: number;
    value: number;
  } | null>;
  removeHabitCompletion: (
    habitId: string,
    completedDate?: Date,
  ) => Promise<boolean>;
  toggleHabitCompletion: (
    habitId: string,
    completedDate?: Date,
    value?: number,
  ) => Promise<Habit | null>;
}

/**
 * Hook to manage habits with automatic fetching and state management
 * @param autoFetch - Whether to automatically fetch habits on mount (default: true)
 * @returns Habits state and operations
 */
export const useHabits = (autoFetch = true): UseHabitsReturn => {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const allHabits = await habitsRepository.getAllHabits();
      setHabits(allHabits);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to fetch habits";
      setError(message);
      console.error("Error fetching habits:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (autoFetch) {
      refetch();
    }
  }, [autoFetch, refetch]);

  const createHabit = useCallback(
    async (habit: HabitData & { id: string }): Promise<Habit | null> => {
      try {
        const newHabit = await habitsRepository.createHabit(habit);
        await refetch();
        return newHabit;
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Failed to create habit";
        setError(message);
        console.error("Error creating habit:", err);
        return null;
      }
    },
    [refetch],
  );

  const updateHabit = useCallback(
    async (id: string, updates: Partial<HabitData>): Promise<Habit | null> => {
      try {
        const updated = await habitsRepository.updateHabit(id, updates);
        await refetch();
        return updated;
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Failed to update habit";
        setError(message);
        console.error("Error updating habit:", err);
        return null;
      }
    },
    [refetch],
  );

  const deleteHabit = useCallback(
    async (id: string): Promise<boolean> => {
      try {
        const result = await habitsRepository.deleteHabit(id);
        await refetch();
        return result;
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Failed to delete habit";
        setError(message);
        console.error("Error deleting habit:", err);
        return false;
      }
    },
    [refetch],
  );

  const deleteHabits = useCallback(
    async (ids: string[]): Promise<number> => {
      try {
        const result = await habitsRepository.deleteHabits(ids);
        await refetch();
        return result;
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Failed to delete habits";
        setError(message);
        console.error("Error deleting habits:", err);
        return 0;
      }
    },
    [refetch],
  );

  const getHabitById = useCallback(
    async (id: string): Promise<Habit | null> => {
      try {
        return await habitsRepository.getHabitById(id);
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Failed to fetch habit";
        setError(message);
        console.error("Error fetching habit:", err);
        return null;
      }
    },
    [],
  );

  const getHabitsByCategory = useCallback(
    async (category: string): Promise<Habit[]> => {
      try {
        return await habitsRepository.getHabitsByCategory(category);
      } catch (err) {
        const message =
          err instanceof Error
            ? err.message
            : "Failed to fetch habits by category";
        setError(message);
        console.error("Error fetching habits by category:", err);
        return [];
      }
    },
    [],
  );

  const getHabitCompletionValuesByDate = useCallback(async (date?: Date) => {
    try {
      const completionMap =
        await habitsRepository.getHabitCompletionMapByDate(date);

      const values: Record<string, number> = {};
      completionMap.forEach((completion, habitId) => {
        values[habitId] = completion.value;
      });

      return values;
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "Failed to fetch habit completion values";
      setError(message);
      console.error("Error fetching habit completion values:", err);
      return {};
    }
  }, []);

  const getHabitCompletionsByHabitId = useCallback(async (habitId: string) => {
    try {
      return await habitsRepository.getHabitCompletionsByHabitId(habitId);
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "Failed to fetch habit completions";
      setError(message);
      console.error("Error fetching habit completions:", err);
      return [];
    }
  }, []);

  const getHabitCompletionByDate = useCallback(
    async (habitId: string, date?: Date) => {
      try {
        return await habitsRepository.getHabitCompletionByDate(habitId, date);
      } catch (err) {
        const message =
          err instanceof Error
            ? err.message
            : "Failed to fetch habit completion";
        setError(message);
        console.error("Error fetching habit completion:", err);
        return null;
      }
    },
    [],
  );

  const addHabitCompletion = useCallback(
    async (habitId: string, completedDate?: Date, value?: number) => {
      try {
        return await habitsRepository.addHabitCompletion(
          habitId,
          completedDate,
          value,
        );
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Failed to add habit completion";
        setError(message);
        console.error("Error adding habit completion:", err);
        return null;
      }
    },
    [],
  );

  const setHabitCompletionValue = useCallback(
    async (habitId: string, completedDate: Date | undefined, value: number) => {
      try {
        const completion = await habitsRepository.setHabitCompletionValue(
          habitId,
          completedDate,
          value,
        );
        await refetch();
        return completion;
      } catch (err) {
        const message =
          err instanceof Error
            ? err.message
            : "Failed to update habit completion";
        setError(message);
        console.error("Error updating habit completion:", err);
        return null;
      }
    },
    [refetch],
  );

  const removeHabitCompletion = useCallback(
    async (habitId: string, completedDate?: Date) => {
      try {
        const removed = await habitsRepository.removeHabitCompletion(
          habitId,
          completedDate,
        );
        await refetch();
        return removed;
      } catch (err) {
        const message =
          err instanceof Error
            ? err.message
            : "Failed to remove habit completion";
        setError(message);
        console.error("Error removing habit completion:", err);
        return false;
      }
    },
    [refetch],
  );

  const toggleHabitCompletion = useCallback(
    async (habitId: string, completedDate?: Date, value?: number) => {
      try {
        const updatedHabit = await habitsRepository.toggleHabitCompletion(
          habitId,
          completedDate,
          value,
        );
        await refetch();
        return updatedHabit;
      } catch (err) {
        const message =
          err instanceof Error
            ? err.message
            : "Failed to toggle habit completion";
        setError(message);
        console.error("Error toggling habit completion:", err);
        return null;
      }
    },
    [refetch],
  );

  return {
    habits,
    loading,
    error,
    refetch,
    getHabitCompletionValuesByDate,
    createHabit,
    updateHabit,
    deleteHabit,
    deleteHabits,
    getHabitById,
    getHabitsByCategory,
    getHabitCompletionsByHabitId,
    getHabitCompletionByDate,
    addHabitCompletion,
    setHabitCompletionValue,
    removeHabitCompletion,
    toggleHabitCompletion,
  };
};
