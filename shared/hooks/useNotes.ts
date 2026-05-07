import { Note, NoteData } from "@/shared/types/note";
import { notesRepository } from "@/storage";
import { useCallback, useEffect, useState } from "react";

interface UseNotesState {
  notes: Note[];
  loading: boolean;
  error: string | null;
}

interface UseNotesReturn extends UseNotesState {
  refetch: () => Promise<void>;
  createNote: (note: NoteData & { id: string }) => Promise<Note | null>;
  updateNote: (id: string, updates: Partial<NoteData>) => Promise<Note | null>;
  deleteNote: (id: string) => Promise<boolean>;
  deleteNotes: (ids: string[]) => Promise<number>;
  getNoteById: (id: string) => Promise<Note | null>;
  getNotesByCategory: (category: string) => Promise<Note[]>;
}

export const useNotes = (autoFetch = true): UseNotesReturn => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const allNotes = await notesRepository.getAllNotes();
      setNotes(allNotes);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to fetch notes";
      setError(message);
      console.error("Error fetching notes:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (autoFetch) {
      refetch();
    }
  }, [autoFetch, refetch]);

  const createNote = useCallback(
    async (note: NoteData & { id: string }): Promise<Note | null> => {
      try {
        const newNote = await notesRepository.createNote(note);
        await refetch();
        return newNote;
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Failed to create note";
        setError(message);
        console.error("Error creating note:", err);
        return null;
      }
    },
    [refetch],
  );

  const updateNote = useCallback(
    async (id: string, updates: Partial<NoteData>): Promise<Note | null> => {
      try {
        const updated = await notesRepository.updateNote(id, updates);
        await refetch();
        return updated;
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Failed to update note";
        setError(message);
        console.error("Error updating note:", err);
        return null;
      }
    },
    [refetch],
  );

  const deleteNote = useCallback(
    async (id: string): Promise<boolean> => {
      try {
        const result = await notesRepository.deleteNote(id);
        await refetch();
        return result;
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Failed to delete note";
        setError(message);
        console.error("Error deleting note:", err);
        return false;
      }
    },
    [refetch],
  );

  const deleteNotes = useCallback(
    async (ids: string[]): Promise<number> => {
      try {
        const count = await notesRepository.deleteNotes(ids);
        await refetch();
        return count;
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Failed to delete notes";
        setError(message);
        console.error("Error deleting notes:", err);
        return 0;
      }
    },
    [refetch],
  );

  const getNoteById = useCallback(async (id: string): Promise<Note | null> => {
    try {
      return await notesRepository.getNoteById(id);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to fetch note";
      setError(message);
      console.error("Error fetching note:", err);
      return null;
    }
  }, []);

  const getNotesByCategory = useCallback(
    async (category: string): Promise<Note[]> => {
      try {
        return await notesRepository.getNotesByCategory(category);
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Failed to fetch notes";
        setError(message);
        console.error("Error fetching notes by category:", err);
        return [];
      }
    },
    [],
  );

  return {
    notes,
    loading,
    error,
    refetch,
    createNote,
    updateNote,
    deleteNote,
    deleteNotes,
    getNoteById,
    getNotesByCategory,
  };
};
