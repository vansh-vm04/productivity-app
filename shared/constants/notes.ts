import { NoteCategory } from "@/shared/types/note";

export const NOTE_CATEGORIES: { key: NoteCategory; label: string }[] = [
  { key: "all", label: "All" },
  { key: "work", label: "Work" },
  { key: "personal", label: "Personal" },
  { key: "ideas", label: "Ideas" },
  { key: "study", label: "Study" },
  { key: "health", label: "Health" },
];
