import { NOTE_CARD_PALETTES, TEXT } from "@/shared/theme/colors";
import { fonts } from "@/shared/theme/fonts";
import { Note } from "@/shared/types/note";
import { moderateScale, responsiveFontSize } from "@/shared/utils/responsive";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface NoteCardProps {
  note: Note;
  onPress: () => void;
  onLongPress?: () => void;
  activeOpacity?: number;
}

export const NoteCard = React.memo(
  ({ note, onPress, onLongPress, activeOpacity = 0.85 }: NoteCardProps) => {
    const hash = note.id
      .split("")
      .reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const palette = NOTE_CARD_PALETTES[hash % NOTE_CARD_PALETTES.length];

    return (
      <TouchableOpacity
        activeOpacity={activeOpacity}
        style={[
          styles.noteCard,
          {
            backgroundColor: palette.base,
          },
        ]}
        onPress={onPress}
        onLongPress={onLongPress}
        delayLongPress={onLongPress ? 300 : undefined}
      >
        <View style={styles.noteCardHeader}>
          <Text
            style={[
              styles.noteCardCategory,
              { backgroundColor: palette.accent },
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
  },
);

NoteCard.displayName = "NoteCard";

const styles = StyleSheet.create({
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
