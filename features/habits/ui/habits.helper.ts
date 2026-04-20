import { Habit } from "@/shared/types/habit";

/**
 * Filter habits based on the selected time period
 */
export const filterHabitsByPeriod = (
  habits: Habit[],
  period: "today" | "weekly" | "monthly" | "overall",
): Habit[] => {
  if (period === "overall") {
    return habits;
  }

  const now = new Date();
  const lastDay = new Date(now.getTime() - 24 * 60 * 60 * 1000);
  const lastWeek = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const lastMonth = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

  return habits.filter((habit) => {
    if (!habit.lastCompletedAt) return false;

    switch (period) {
      case "today":
        return habit.lastCompletedAt >= lastDay;
      case "weekly":
        return habit.lastCompletedAt >= lastWeek;
      case "monthly":
        return habit.lastCompletedAt >= lastMonth;
      default:
        return true;
    }
  });
};
