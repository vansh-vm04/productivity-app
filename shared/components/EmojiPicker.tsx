import { BACKGROUND, BORDER, TEXT } from "@/shared/theme/colors";
import { fonts } from "@/shared/theme/fonts";
import { moderateScale, responsiveFontSize } from "@/shared/utils/responsive";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import React from "react";
import {
    FlatList,
    Modal,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

interface EmojiPickerProps {
  visible: boolean;
  emojis: readonly string[];
  selectedEmoji: string;
  onSelect: (emoji: string) => void;
  onClose: () => void;
  title?: string;
  numColumns?: number;
}

export const EmojiPicker = React.memo(
  ({
    visible,
    emojis,
    selectedEmoji,
    onSelect,
    onClose,
    title = "Choose Emoji",
    numColumns = 5,
  }: EmojiPickerProps) => {
    return (
      <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
        <View style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.title}>{title}</Text>
            <TouchableOpacity onPress={onClose}>
              <MaterialCommunityIcons
                name="close"
                size={24}
                color={TEXT.primary}
              />
            </TouchableOpacity>
          </View>
          <FlatList
            data={Array.from(emojis)}
            numColumns={numColumns}
            keyExtractor={(_, index) => index.toString()}
            contentContainerStyle={styles.grid}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={[
                  styles.emojiButton,
                  selectedEmoji === item && styles.selectedEmojiButton,
                ]}
                onPress={() => {
                  onSelect(item);
                  onClose();
                }}
              >
                <Text style={styles.emoji}>{item}</Text>
              </TouchableOpacity>
            )}
          />
        </View>
      </Modal>
    );
  },
);

EmojiPicker.displayName = "EmojiPicker";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BACKGROUND.secondary,
    paddingTop: moderateScale(50),
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: moderateScale(16),
    paddingVertical: moderateScale(16),
    borderBottomWidth: 1,
    borderBottomColor: BORDER.primary,
  },
  title: {
    fontSize: responsiveFontSize(16),
    fontFamily: fonts.semibold,
    color: TEXT.primary,
  },
  grid: {
    paddingHorizontal: moderateScale(16),
    paddingVertical: moderateScale(16),
    paddingBottom: moderateScale(50),
  },
  emojiButton: {
    flex: 1,
    aspectRatio: 1,
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: moderateScale(6),
    marginVertical: moderateScale(6),
    borderRadius: moderateScale(12),
    backgroundColor: "rgba(0,0,0,0.05)",
    borderWidth: 1,
    borderColor: BORDER.primary,
  },
  selectedEmojiButton: {
    backgroundColor: "rgba(0,0,0,0.1)",
    borderColor: TEXT.primary,
    borderWidth: 2,
  },
  emoji: {
    fontSize: responsiveFontSize(32),
  },
});
