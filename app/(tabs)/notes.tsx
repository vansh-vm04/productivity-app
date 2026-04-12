import { BACKGROUND, PRIMARY, TEXT } from "@/theme/colors";
import { fonts } from "@/theme/fonts";
import { moderateScale, responsiveFontSize } from "@/utils/responsive";
import { useMemo, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

type NoteCategory = "all" | "work" | "personal" | "ideas" | "study" | "health";

type Note = {
  id: string;
  title: string;
  body: string;
  category: Exclude<NoteCategory, "all">;
  updatedAt: string;
  bgColor: string;
  accentColor: string;
};

const CATEGORIES: { key: NoteCategory; label: string }[] = [
  { key: "all", label: "All" },
  { key: "work", label: "Work" },
  { key: "personal", label: "Personal" },
  { key: "ideas", label: "Ideas" },
  { key: "study", label: "Study" },
  { key: "health", label: "Health" },
];

const MOCK_NOTES: Note[] = [
  {
    id: "1",
    title: "Sprint Retrospective",
    body: "Capture wins, blockers, and one process upgrade for next sprint.",
    category: "work",
    updatedAt: "Today",
    bgColor: "#1F3D2B",
    accentColor: "#2E5E42",
  },
  {
    id: "2",
    title: "Morning Journal",
    body: "Three things I am grateful for and one intention for tonight.",
    category: "personal",
    updatedAt: "Today",
    bgColor: "#1E3A5F",
    accentColor: "#2C5D8A",
  },
  {
    id: "3",
    title: "App Feature Ideas",
    body: "Voice notes to tasks, swipe actions, and timeline-based reminders.",
    category: "ideas",
    updatedAt: "Yesterday",
    bgColor: "#2A2245",
    accentColor: "#3E3270",
  },
  {
    id: "4",
    title: "DSA Revision",
    body: "Graphs: BFS vs DFS patterns, topological sort and shortest path cheatsheet.",
    category: "study",
    updatedAt: "Yesterday",
    bgColor: "#3A2230",
    accentColor: "#5A3247",
  },
  {
    id: "5",
    title: "Workout Plan",
    body: "Push day split with warmup, compounds first, then accessories and cooldown.",
    category: "health",
    updatedAt: "2d ago",
    bgColor: "#3D2A1F",
    accentColor: "#5E3F2E",
  },
  {
    id: "6",
    title: "Meeting Notes",
    body: "Client wants milestone visibility and weekly summary email automation.",
    category: "work",
    updatedAt: "2d ago",
    bgColor: "#1F3F3D",
    accentColor: "#2F6B66",
  },
  {
    id: "7",
    title: "Weekend Plan",
    body: "Cafe + reading slot, family call, and reset workspace for Monday.",
    category: "personal",
    updatedAt: "3d ago",
    bgColor: "#3D3A1F",
    accentColor: "#5E5A2E",
  },
  {
    id: "8",
    title: "Product Brainstorm",
    body: "Lightweight habits streak with frictionless quick-add interaction.",
    category: "ideas",
    updatedAt: "3d ago",
    bgColor: "#1F3D2B",
    accentColor: "#2E5E42",
  },
];

export default function Notes() {
  const [activeCategory, setActiveCategory] = useState<NoteCategory>("all");

  const filteredNotes = useMemo(() => {
    if (activeCategory === "all") return MOCK_NOTES;
    return MOCK_NOTES.filter((note) => note.category === activeCategory);
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
        <TouchableOpacity style={styles.addButton} activeOpacity={0.7}>
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
