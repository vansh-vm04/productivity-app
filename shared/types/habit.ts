import { PriorityType } from "@/shared/constants/tags";

export type HabitFrequency = "daily" | "weekly" | "monthly";
export type HabitType = "binary" | "count" | "time";
export type HabitCategory =
  | "health"
  | "study"
  | "fitness"
  | "productivity"
  | "lifestyle"
  | "custom";

export interface Reminder {
  id: string;
  time: string; // HH:MM format
  label: string; // "morning", "evening", etc.
  enabled: boolean;
}

export interface FrequencyDetails {
  type: "daily" | "weekdays" | "specific_days" | "custom";
  specificDays?: string[]; // ["Monday", "Wednesday", "Friday"]
  interval?: number; // For custom repeat
}

export interface HabitData {
  id?: string;
  name: string;
  icon: string;
  category: HabitCategory;
  customCategory?: string;
  priority: PriorityType;
  type: HabitType;
  targetCount?: number; // For count-based habits
  countUnit?: string; // "glasses", "pages", etc.
  targetDuration?: number; // For time-based habits (in minutes)
  frequency: FrequencyDetails;
  reminders: Reminder[];
}

export interface Habit {
  id: string;
  name: string;
  icon: string;
  streak: number; // Days count
  completed: boolean;
  frequency: HabitFrequency;
  createdAt: Date;
  lastCompletedAt?: Date;
  backgroundColor: string;
  accentColor: string;
  category: HabitCategory;
  customCategory?: string;
  priority: PriorityType;
  type: HabitType;
  targetCount?: number;
  countUnit?: string;
  targetDuration?: number;
  reminders: Reminder[];
}
