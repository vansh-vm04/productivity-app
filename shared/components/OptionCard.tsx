import { BACKGROUND, PRIMARY, TEXT } from "@/shared/theme/colors";
import { fonts } from "@/shared/theme/fonts";
import { moderateScale, responsiveFontSize } from "@/shared/utils/responsive";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export type OptionType = "task" | "note" | "habit";

interface OptionCardProps {
  label: OptionType;
  icon: keyof typeof MaterialIcons.glyphMap;
  description: string;
  onPress: (label: OptionType) => void;
}

export default function OptionCard({
  label,
  icon,
  description,
  onPress,
}: OptionCardProps) {
  return (
    <TouchableOpacity
      style={styles.option}
      onPress={() => onPress(label)}
      activeOpacity={0.7}
    >
      <View style={styles.optionIconContainer}>
        <MaterialIcons name={icon} size={28} color={PRIMARY.main} />
      </View>
      <View style={styles.optionTextContainer}>
        <Text style={styles.optionLabel}>
          {label.charAt(0).toUpperCase() + label.slice(1)}
        </Text>
        <Text style={styles.optionDescription}>{description}</Text>
      </View>
      <MaterialCommunityIcons
        name="chevron-right"
        size={24}
        color={TEXT.tertiary}
      />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
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
