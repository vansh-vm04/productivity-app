export type CreateNoteParams = {
  mode?: string;
  noteId?: string;
  title?: string;
  body?: string;
  category?: string;
  customCategory?: string;
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
  category: Exclude<NoteCategory, "all"> | string;
  customCategory?: string;
  updatedAt: Date;
};

export type NoteData = {
  id?: string;
  title: string;
  body: string;
  category: Exclude<NoteCategory, "all"> | string;
  customCategory?: string;
};
