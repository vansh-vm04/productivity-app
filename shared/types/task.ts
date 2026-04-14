import { CategoryType, PriorityType } from "@/shared/constants/tags";

export interface TaskData {
  id?: string;
  name: string;
  priority: PriorityType;
  category: CategoryType | "custom";
  customCategory: string;
  dueDate: Date | null;
}

export interface Task {
  id: string;
  name: string;
  category: CategoryType;
  priority: PriorityType;
  completed: boolean;
  dueDate: Date;
}