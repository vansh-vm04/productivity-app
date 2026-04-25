import { NOTES_MOCKS } from "@/features/notes/mocks/notes.mocks";
import ActionModal, { ActionModalItem } from "@/shared/components/ActionModal";
import { AddButton } from "@/shared/components/AddButton";
import { NoteCard } from "@/shared/components/NoteCard";
import { BACKGROUND, PRIMARY, TEXT } from "@/shared/theme/colors";
import { fonts } from "@/shared/theme/fonts";
import { Note, NoteCategory } from "@/shared/types/note";
import { moderateScale, responsiveFontSize } from "@/shared/utils/responsive";
import { useRouter } from "expo-router";
import { useMemo, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { NOTE_CATEGORIES } from "../../shared/constants/notes";

export default function Notes() {
  const router = useRouter();
  const [activeCategory, setActiveCategory] = useState<NoteCategory>("all");
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [notes, setNotes] = useState<Note[]>(NOTES_MOCKS);

  const filteredNotes = useMemo(() => {
    if (activeCategory === "all") return notes;
    return notes.filter((note) => note.category === activeCategory);
  }, [activeCategory, notes]);

  const leftColumnNotes = useMemo(
    () => filteredNotes.filter((_, index) => index % 2 === 0),
    [filteredNotes],
  );

  const rightColumnNotes = useMemo(
    () => filteredNotes.filter((_, index) => index % 2 !== 0),
    [filteredNotes],
  );

  const handleLongPress = (note: Note) => {
    setSelectedNote(note);
    setModalVisible(true);
  };

  const handleEdit = () => {
    if (!selectedNote) return;

    setModalVisible(false);
    router.push({
      pathname: "/create/note",
      params: {
        mode: "edit",
        noteId: selectedNote.id,
        title: selectedNote.title,
        body: selectedNote.body,
        category: selectedNote.category,
      },
    });
  };

  const handleDelete = () => {
    if (selectedNote) {
      setNotes(notes.filter((note) => note.id !== selectedNote.id));
    }
    setModalVisible(false);
  };

  const noteActions: ActionModalItem[] = [
    {
      key: "edit",
      label: "Edit",
      icon: "pencil" as const,
      iconColor: PRIMARY.main,
      onPress: handleEdit,
    },
    {
      key: "delete",
      label: "Delete",
      icon: "trash-can" as const,
      iconColor: "#EF4444",
      danger: true,
      onPress: handleDelete,
    },
  ];

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Notes</Text>
        <AddButton
          label="New Note"
          onPress={() => router.push("/create/note")}
        />
      </View>

      {/* Category Capsules */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.categoryScrollContent}
      >
        {NOTE_CATEGORIES.map((category) => {
          const selected = activeCategory === category.key;
          return (
            <TouchableOpacity
              key={category.key}
              style={[
                styles.categoryCapsule,
                selected && styles.categoryCapsuleActive,
              ]}
              onPress={() => setActiveCategory(category.key)}
              activeOpacity={0.7}
            >
              <Text
                style={[
                  styles.categoryCapsuleText,
                  selected && styles.categoryCapsuleTextActive,
                ]}
              >
                {category.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* Notes Grid */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.notesGridContent}
      >
        <View style={styles.notesColumnsContainer}>
          <View style={styles.notesColumn}>
            {leftColumnNotes.map((note) => (
              <NoteCard
                key={note.id}
                note={note}
                onPress={() =>
                  router.push({
                    pathname: "/create/note",
                    params: {
                      mode: "edit",
                      noteId: note.id,
                      title: note.title,
                      body: note.body,
                      category: note.category,
                    },
                  })
                }
                onLongPress={() => handleLongPress(note)}
              />
            ))}
          </View>
          <View style={styles.notesColumn}>
            {rightColumnNotes.map((note) => (
              <NoteCard
                key={note.id}
                note={note}
                onPress={() =>
                  router.push({
                    pathname: "/create/note",
                    params: {
                      mode: "edit",
                      noteId: note.id,
                      title: note.title,
                      body: note.body,
                      category: note.category,
                    },
                  })
                }
                onLongPress={() => handleLongPress(note)}
              />
            ))}
          </View>
        </View>
      </ScrollView>

      <ActionModal
        visible={modalVisible}
        title={selectedNote?.title || "Note"}
        actions={noteActions}
        onClose={() => setModalVisible(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BACKGROUND.secondary,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    paddingHorizontal: moderateScale(16),
    paddingVertical: moderateScale(10),
    borderBottomWidth: 0.5,
    borderBottomColor: "#000000",
    paddingTop: moderateScale(50),
  },
  headerTitle: {
    fontSize: responsiveFontSize(24),
    fontFamily: fonts.regular,
    color: TEXT.primary,
    lineHeight: moderateScale(32),
  },

  categoryScrollContent: {
    paddingHorizontal: moderateScale(16),
    paddingVertical: moderateScale(12),
    gap: moderateScale(8),
    marginBottom: moderateScale(10),
  },
  categoryCapsule: {
    borderWidth: 0.5,
    borderColor: "#000000",
    backgroundColor: "rgba(255,255,255,0.08)",
    borderRadius: moderateScale(20),
    paddingHorizontal: moderateScale(14),
    height: moderateScale(30),
    alignItems: "center",
    justifyContent: "center",
  },
  categoryCapsuleActive: {
    backgroundColor: PRIMARY.main,
  },
  categoryCapsuleText: {
    fontSize: responsiveFontSize(12),
    fontFamily: fonts.medium,
    color: TEXT.capsules,
  },
  categoryCapsuleTextActive: {
    color: TEXT.capsulesActive,
  },
  notesGridContent: {
    paddingHorizontal: moderateScale(16),
    paddingBottom: moderateScale(40),
    alignItems: "flex-start",
  },
  notesColumnsContainer: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  notesColumn: {
    width: "48%",
  },
});
