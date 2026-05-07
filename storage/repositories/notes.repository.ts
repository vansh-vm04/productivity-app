import { Note, NoteData } from "@/shared/types/note";
import { executeAsync, getAllAsync, getFirstAsync } from "../db/database";

interface NoteRowDB {
  id: string;
  title: string;
  body: string;
  category: string;
  customCategory: string | null;
  createdAt: number;
  updatedAt: number;
}

const convertDBRowToNote = (row: NoteRowDB): Note => ({
  id: row.id,
  title: row.title,
  body: row.body,
  category: row.category,
  customCategory: row.customCategory || undefined,
  updatedAt: row.updatedAt.toString(),
});

class NotesRepository {
  /**
   * Create a new note
   */
  async createNote(note: NoteData & { id: string }): Promise<Note> {
    const now = Date.now();

    await executeAsync(
      `INSERT INTO notes (id, title, body, category, customCategory, createdAt, updatedAt)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        note.id,
        note.title,
        note.body,
        note.category,
        note.customCategory || null,
        now,
        now,
      ],
    );

    return this.getNoteById(note.id) as Promise<Note>;
  }

  /**
   * Get all notes
   */
  async getAllNotes(): Promise<Note[]> {
    const rows = await getAllAsync<NoteRowDB>(
      "SELECT * FROM notes ORDER BY updatedAt DESC",
    );
    return rows.map(convertDBRowToNote);
  }

  /**
   * Get note by ID
   */
  async getNoteById(id: string): Promise<Note | null> {
    const row = await getFirstAsync<NoteRowDB>(
      "SELECT * FROM notes WHERE id = ?",
      [id],
    );
    return row ? convertDBRowToNote(row) : null;
  }

  /**
   * Get notes by category
   */
  async getNotesByCategory(category: string): Promise<Note[]> {
    const rows = await getAllAsync<NoteRowDB>(
      "SELECT * FROM notes WHERE category = ? ORDER BY updatedAt DESC",
      [category],
    );
    return rows.map(convertDBRowToNote);
  }

  /**
   * Update note
   */
  async updateNote(
    id: string,
    updates: Partial<NoteData>,
  ): Promise<Note | null> {
    const note = await this.getNoteById(id);

    if (!note) {
      throw new Error(`Note with id ${id} not found`);
    }

    const now = Date.now();
    const updateFields: string[] = [];
    const values: (string | number | null)[] = [];

    if (updates.title !== undefined) {
      updateFields.push("title = ?");
      values.push(updates.title);
    }
    if (updates.body !== undefined) {
      updateFields.push("body = ?");
      values.push(updates.body);
    }
    if (updates.category !== undefined) {
      updateFields.push("category = ?");
      values.push(updates.category);
    }
    if (updates.customCategory !== undefined) {
      updateFields.push("customCategory = ?");
      values.push(updates.customCategory || null);
    }

    if (updateFields.length === 0) {
      return note;
    }

    updateFields.push("updatedAt = ?");
    values.push(now);
    values.push(id);

    await executeAsync(
      `UPDATE notes SET ${updateFields.join(", ")} WHERE id = ?`,
      values,
    );

    return this.getNoteById(id);
  }

  /**
   * Delete note
   */
  async deleteNote(id: string): Promise<boolean> {
    const result = await executeAsync("DELETE FROM notes WHERE id = ?", [id]);

    return (result.changes ?? 0) > 0;
  }

  /**
   * Delete multiple notes
   */
  async deleteNotes(ids: string[]): Promise<number> {
    if (ids.length === 0) return 0;

    const placeholders = ids.map(() => "?").join(",");
    const result = await executeAsync(
      `DELETE FROM notes WHERE id IN (${placeholders})`,
      ids,
    );

    return result.changes ?? 0;
  }

  /**
   * Clear all notes (use with caution)
   */
  async clearAllNotes(): Promise<number> {
    const result = await executeAsync("DELETE FROM notes");
    return result.changes ?? 0;
  }
}

export const notesRepository = new NotesRepository();
