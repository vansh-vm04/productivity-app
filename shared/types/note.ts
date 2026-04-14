export type CreateNoteParams = {
  mode?: string;
  noteId?: string;
  title?: string;
  body?: string;
  category?: string;
};

export type NoteCategory =
  | "all"
  | "work"
  | "personal"
  | "ideas"
  | "study"
  | "health";

export type Note = {
  id: string;
  title: string;
  body: string;
  category: Exclude<NoteCategory, "all">;
  updatedAt: string;
  bgColor: string;
  accentColor: string;
};