import { BACKGROUND, MODAL, PRIMARY, SURFACE, TEXT } from "@/theme/colors";
import { fonts } from "@/theme/fonts";
import { moderateScale, responsiveFontSize } from "@/utils/responsive";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { useRouter } from "expo-router";
import React from "react";
import {
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";

type Props = {
  visible: boolean;
  onClose: () => void;
};

export default function CreateModal({ visible, onClose }: Props) {
  const router = useRouter();

  const handleOptionPress = (option: "task" | "note" | "habit") => {
    onClose();

    switch (option) {
      case "task":
        router.push("/createTask");
        break;
      case "note":
        // TODO: Navigate to create note screen
        console.log("Navigate to create note");
        break;
      case "habit":
        // TODO: Navigate to create habit screen
        console.log("Navigate to create habit");
        break;
    }
  };

  const options: {
    label: "task" | "note" | "habit";
    icon: keyof typeof MaterialCommunityIcons.glyphMap;
    description: string;
  }[] = [
    {
      label: "task",
      icon: "checkbox-marked-outline",
      description: "Create a task",
    },
    {
      label: "note",
      icon: "note-multiple-outline",
      description: "Create a note",
    },
    { label: "habit", icon: "fire", description: "Create a habit" },
  ];

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.overlay}>
          <TouchableWithoutFeedback>
            <View style={styles.modalContent}>
              {/* Header */}
              <View style={styles.header}>
                <Text style={styles.title}>Create</Text>
                <TouchableOpacity
                  onPress={onClose}
                  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                >
                  <MaterialCommunityIcons
                    name="close"
                    size={24}
                    color={TEXT.primary}
                  />
                </TouchableOpacity>
              </View>

              {/* Options */}
              <View style={styles.optionsContainer}>
                {options.map((option) => (
                  <TouchableOpacity
                    key={option.label}
                    style={styles.option}
                    onPress={() => handleOptionPress(option.label)}
                    activeOpacity={0.7}
                  >
                    <View style={styles.optionIconContainer}>
                      <MaterialCommunityIcons
                        name={option.icon}
                        size={28}
                        color={PRIMARY.main}
                      />
                    </View>
                    <View style={styles.optionTextContainer}>
                      <Text style={styles.optionLabel}>
                        {option.label.charAt(0).toUpperCase() +
                          option.label.slice(1)}
                      </Text>
                      <Text style={styles.optionDescription}>
                        {option.description}
                      </Text>
                    </View>
                    <MaterialCommunityIcons
                      name="chevron-right"
                      size={24}
                      color={TEXT.tertiary}
                    />
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: MODAL.overlay,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: moderateScale(20),
  },
  modalContent: {
    backgroundColor: SURFACE.primary,
    borderRadius: moderateScale(24),
    paddingHorizontal: moderateScale(20),
    paddingTop: moderateScale(20),
    paddingBottom: moderateScale(20),
    width: "100%",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: moderateScale(16),
  },
  title: {
    fontSize: responsiveFontSize(18),
    fontFamily: fonts.bold,
    color: TEXT.primary,
  },
  optionsContainer: {
    gap: moderateScale(8),
  },
  option: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: moderateScale(12),
    paddingHorizontal: moderateScale(12),
    borderRadius: moderateScale(12),
    backgroundColor: BACKGROUND.secondary,
  },
  optionIconContainer: {
    width: moderateScale(44),
    height: moderateScale(44),
    borderRadius: moderateScale(12),
    backgroundColor: `${PRIMARY.main}20`,
    alignItems: "center",
    justifyContent: "center",
    marginRight: moderateScale(12),
  },
  optionTextContainer: {
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "flex-start",
    width: "70%",
  },
  optionLabel: {
    fontSize: responsiveFontSize(16),
    fontFamily: fonts.medium,
    color: TEXT.primary,
  },
  optionDescription: {
    fontSize: responsiveFontSize(12),
    fontFamily: fonts.regular,
    color: TEXT.tertiary,
  },
});
