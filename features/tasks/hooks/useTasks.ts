import { Task, TaskData } from "@/shared/types/task";
import { tasksRepository } from "@/storage";
import { useCallback, useEffect, useState } from "react";

interface UseTasksState {
  tasks: Task[];
  loading: boolean;
  error: string | null;
}

interface UseTasksReturn extends UseTasksState {
  refetch: () => Promise<void>;
  createTask: (task: TaskData & { id: string }) => Promise<Task | null>;
  updateTask: (id: string, updates: Partial<TaskData>) => Promise<Task | null>;
  deleteTask: (id: string) => Promise<boolean>;
  deleteTasks: (ids: string[]) => Promise<number>;
  toggleTaskCompletion: (id: string) => Promise<Task | null>;
  getTaskById: (id: string) => Promise<Task | null>;
  getTasksByCategory: (category: string) => Promise<Task[]>;
  getIncompleteTasks: () => Promise<Task[]>;
  getCompletedTasks: () => Promise<Task[]>;
  getTasksByPriority: (priority: string) => Promise<Task[]>;
  getTasksDueToday: () => Promise<Task[]>;
  getTasksDueThisWeek: () => Promise<Task[]>;
}

/**
 * Hook to manage tasks with automatic fetching and state management
 * @param autoFetch - Whether to automatically fetch tasks on mount (default: true)
 * @returns Tasks state and operations
 */
export const useTasks = (autoFetch = true): UseTasksReturn => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const allTasks = await tasksRepository.getAllTasks();
      setTasks(allTasks);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to fetch tasks";
      setError(message);
      console.error("Error fetching tasks:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (autoFetch) {
      refetch();
    }
  }, [autoFetch, refetch]);

  const createTask = useCallback(
    async (task: TaskData & { id: string }): Promise<Task | null> => {
      try {
        const newTask = await tasksRepository.createTask(task);
        await refetch();
        return newTask;
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Failed to create task";
        setError(message);
        console.error("Error creating task:", err);
        return null;
      }
    },
    [refetch],
  );

  const updateTask = useCallback(
    async (id: string, updates: Partial<TaskData>): Promise<Task | null> => {
      try {
        const updated = await tasksRepository.updateTask(id, updates);
        await refetch();
        return updated;
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Failed to update task";
        setError(message);
        console.error("Error updating task:", err);
        return null;
      }
    },
    [refetch],
  );

  const deleteTask = useCallback(
    async (id: string): Promise<boolean> => {
      try {
        const result = await tasksRepository.deleteTask(id);
        await refetch();
        return result;
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Failed to delete task";
        setError(message);
        console.error("Error deleting task:", err);
        return false;
      }
    },
    [refetch],
  );

  const deleteTasks = useCallback(
    async (ids: string[]): Promise<number> => {
      try {
        const count = await tasksRepository.deleteTasks(ids);
        await refetch();
        return count;
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Failed to delete tasks";
        setError(message);
        console.error("Error deleting tasks:", err);
        return 0;
      }
    },
    [refetch],
  );

  const toggleTaskCompletion = useCallback(
    async (id: string): Promise<Task | null> => {
      try {
        const updated = await tasksRepository.toggleTaskCompletion(id);
        await refetch();
        return updated;
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Failed to toggle task";
        setError(message);
        console.error("Error toggling task:", err);
        return null;
      }
    },
    [refetch],
  );

  const getTaskById = useCallback(async (id: string): Promise<Task | null> => {
    try {
      return await tasksRepository.getTaskById(id);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to fetch task";
      setError(message);
      console.error("Error fetching task:", err);
      return null;
    }
  }, []);

  const getTasksByCategory = useCallback(
    async (category: string): Promise<Task[]> => {
      try {
        return await tasksRepository.getTasksByCategory(category);
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Failed to fetch tasks";
        setError(message);
        console.error("Error fetching tasks by category:", err);
        return [];
      }
    },
    [],
  );

  const getIncompleteTasks = useCallback(async (): Promise<Task[]> => {
    try {
      return await tasksRepository.getIncompleteTasks();
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to fetch tasks";
      setError(message);
      console.error("Error fetching incomplete tasks:", err);
      return [];
    }
  }, []);

  const getCompletedTasks = useCallback(async (): Promise<Task[]> => {
    try {
      return await tasksRepository.getCompletedTasks();
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to fetch tasks";
      setError(message);
      console.error("Error fetching completed tasks:", err);
      return [];
    }
  }, []);

  const getTasksByPriority = useCallback(
    async (priority: string): Promise<Task[]> => {
      try {
        return await tasksRepository.getTasksByPriority(priority);
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Failed to fetch tasks";
        setError(message);
        console.error("Error fetching tasks by priority:", err);
        return [];
      }
    },
    [],
  );

  const getTasksDueToday = useCallback(async (): Promise<Task[]> => {
    try {
      return await tasksRepository.getTasksDueToday();
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to fetch tasks";
      setError(message);
      console.error("Error fetching tasks due today:", err);
      return [];
    }
  }, []);

  const getTasksDueThisWeek = useCallback(async (): Promise<Task[]> => {
    try {
      return await tasksRepository.getTasksDueThisWeek();
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to fetch tasks";
      setError(message);
      console.error("Error fetching tasks due this week:", err);
      return [];
    }
  }, []);

  return {
    tasks,
    loading,
    error,
    refetch,
    createTask,
    updateTask,
    deleteTask,
    deleteTasks,
    toggleTaskCompletion,
    getTaskById,
    getTasksByCategory,
    getIncompleteTasks,
    getCompletedTasks,
    getTasksByPriority,
    getTasksDueToday,
    getTasksDueThisWeek,
  };
};
