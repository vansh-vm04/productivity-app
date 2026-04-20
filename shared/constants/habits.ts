export type HabitPeriod = "today" | "weekly" | "monthly" | "overall";

export interface HabitPeriodOption {
  key: HabitPeriod;
  label: string;
}

export const HABIT_PERIODS: HabitPeriodOption[] = [
  { key: "today", label: "Today" },
  { key: "weekly", label: "Weekly" },
  { key: "monthly", label: "Monthly" },
  { key: "overall", label: "Overall" },
];
