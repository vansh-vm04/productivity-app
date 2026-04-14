import { BACKGROUND, PRIMARY, TEXT } from "@/shared/theme/colors";
import { fonts } from "@/shared/theme/fonts";
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
import { NOTES_MOCKS } from "@/features/notes/mocks/notes.mocks";
import { Note, NoteCategory } from "@/shared/types/note";

const CATEGORIES: { key: NoteCategory; label: string }[] = [
  { key: "all", label: "All" },
  { key: "work", label: "Work" },
  { key: "personal", label: "Personal" },
  { key: "ideas", label: "Ideas" },
  { key: "study", label: "Study" },
  { key: "health", label: "Health" },
];

export default function Notes() {
  const router = useRouter();
  const [activeCategory, setActiveCategory] = useState<NoteCategory>("all");

  const filteredNotes = useMemo(() => {
    if (activeCategory === "all") return NOTES_MOCKS;
    return NOTES_MOCKS.filter((note) => note.category === activeCategory);
  }, [activeCategory]);

  const leftColumnNotes = useMemo(
    () => filteredNotes.filter((_, index) => index % 2 === 0),
    [filteredNotes],
  );

  const rightColumnNotes = useMemo(
    () => filteredNotes.filter((_, index) => index % 2 !== 0),
    [filteredNotes],
  );

  const renderNoteCard = (note: Note) => {
    return (
      <TouchableOpacity
        key={note.id}
        activeOpacity={0.85}
        style={[styles.noteCard, { backgroundColor: note.bgColor }]}
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
      >
        <View style={styles.noteCardHeader}>
          <Text
            style={[
              styles.noteCardCategory,
              { backgroundColor: note.accentColor },
            ]}
          >
            {note.category}
          </Text>
        </View>
        <Text style={styles.noteCardTitle} numberOfLines={2}>
          {note.title}
        </Text>
        <Text style={styles.noteCardBody}>{note.body}</Text>
        <Text style={styles.noteCardDate}>{note.updatedAt}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Notes</Text>
        <TouchableOpacity
          style={styles.addButton}
          activeOpacity={0.7}
          onPress={() => router.push("/create/note")}
        >
          <Text style={styles.addButtonIcon}>+</Text>
          <Text style={styles.addButtonText}>New Note</Text>
        </TouchableOpacity>
      </View>

      {/* Category Capsules */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.categoryScrollContent}
      >
        {CATEGORIES.map((category) => {
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
            {leftColumnNotes.map(renderNoteCard)}
          </View>
          <View style={styles.notesColumn}>
            {rightColumnNotes.map(renderNoteCard)}
          </View>
        </View>
      </ScrollView>
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
  addButton: {
    flexDirection: "row",
    paddingHorizontal: moderateScale(16),
    paddingVertical: moderateScale(2),
    borderRadius: moderateScale(12),
    backgroundColor: PRIMARY.main,
    justifyContent: "center",
    alignItems: "center",
    gap: moderateScale(6),
  },
  addButtonText: {
    fontSize: responsiveFontSize(12),
    fontFamily: fonts.medium,
    color: TEXT.primary,
  },
  addButtonIcon: {
    paddingTop: moderateScale(2),
    fontSize: responsiveFontSize(16),
    fontFamily: fonts.medium,
    color: TEXT.primary,
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
    color: TEXT.secondary,
  },
  categoryCapsuleTextActive: {
    color: TEXT.primary,
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
  noteCard: {
    width: "100%",
    maxHeight: moderateScale(240),
    overflow: "hidden",
    borderRadius: moderateScale(16),
    borderWidth: 0.5,
    borderColor: "#000000",
    padding: moderateScale(12),
    marginBottom: moderateScale(10),
    alignSelf: "flex-start",
  },
  noteCardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: moderateScale(8),
  },
  noteCardCategory: {
    textTransform: "capitalize",
    fontSize: responsiveFontSize(10),
    fontFamily: fonts.semibold,
    color: TEXT.secondary,
    backgroundColor: "rgba(255,255,255,0.12)",
    borderRadius: moderateScale(10),
    paddingHorizontal: moderateScale(8),
    height: moderateScale(20),
    paddingVertical: moderateScale(2),
  },
  noteCardTitle: {
    fontSize: responsiveFontSize(14),
    fontFamily: fonts.bold,
    color: TEXT.primary,
    marginBottom: moderateScale(6),
  },
  noteCardBody: {
    fontSize: responsiveFontSize(12),
    fontFamily: fonts.regular,
    color: TEXT.secondary,
    lineHeight: moderateScale(16),
    flexShrink: 1,
  },
  noteCardDate: {
    marginTop: "auto",
    fontSize: responsiveFontSize(10),
    fontFamily: fonts.medium,
    color: TEXT.tertiary,
    paddingTop: moderateScale(8),
  },
});
