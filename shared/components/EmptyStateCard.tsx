import {
  BORDER,
  SURFACE,
  TEXT,
} from "@/shared/theme/colors";
import { fonts } from "@/shared/theme/fonts";
import { moderateScale, responsiveFontSize } from "@/shared/utils/responsive";
import { useRouter } from "expo-router";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import OptionCard, { OptionType } from "./OptionCard";

export default function EmptyStateCard() {
  const router = useRouter();

  const handleOptionPress = (option: OptionType) => {
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
    icon: keyof typeof import("@expo/vector-icons/MaterialIcons").default.glyphMap;
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
    {
      label: "habit",
      icon: "event-repeat",
      description: "Create a habit",
    },
  ];

  return (
    <View style={styles.card}>
      <View style={styles.headerContainer}>
        <Text style={styles.title}>Get Started</Text>
        <Text style={styles.subtitle}>Create your first task or habit to see progress</Text>
      </View>

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
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: moderateScale(24),
    paddingHorizontal: moderateScale(16),
    paddingVertical: moderateScale(20),
    width: "100%",
    marginVertical: moderateScale(16),
    backgroundColor: SURFACE.primary,
    borderWidth: 0.5,
    borderColor: BORDER.primary,
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  headerContainer: {
    marginBottom: moderateScale(16),
  },
  title: {
    fontSize: responsiveFontSize(18),
    fontFamily: fonts.bold,
    color: TEXT.primary,
    marginBottom: moderateScale(4),
  },
  subtitle: {
    fontSize: responsiveFontSize(13),
    fontFamily: fonts.regular,
    color: TEXT.tertiary,
  },
  optionsContainer: {
    gap: moderateScale(8),
  },
});
