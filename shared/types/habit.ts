export type HabitFrequency = "daily" | "weekly" | "monthly";

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
}
