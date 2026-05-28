import {
  MODAL,
  SURFACE,
  TEXT,
} from "@/shared/theme/colors";
import { fonts } from "@/shared/theme/fonts";
import { moderateScale, responsiveFontSize } from "@/shared/utils/responsive";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
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
import OptionCard, { OptionType } from "./OptionCard";

type Props = {
  visible: boolean;
  onClose: () => void;
};

export default function CreateModal({ visible, onClose }: Props) {
  const router = useRouter();

  const handleOptionPress = (option: OptionType) => {
    onClose();

    switch (option) {
      case "task":
        router.push("/create/task");
        break;
      case "note":
        router.push("/create/note");
        break;
      case "habit":
        router.push("/create/habit");
        break;
    }
  };

  const options: {
    label: OptionType;
    icon: keyof typeof MaterialIcons.glyphMap;
    description: string;
  }[] = [
    {
      label: "task",
      icon: "task-alt",
      description: "Create a task",
    },
    {
      label: "note",
      icon: "notes",
      description: "Create a note",
    },
    { label: "habit", icon: "event-repeat", description: "Create a habit" },
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
                  <OptionCard
                    key={option.label}
                    label={option.label}
                    icon={option.icon}
                    description={option.description}
                    onPress={handleOptionPress}
                  />
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
    paddingHorizontal: moderateScale(14),
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
});
