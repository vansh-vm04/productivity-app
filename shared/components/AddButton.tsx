import { BUTTON, TEXT } from "@/shared/theme/colors";
import { fonts } from "@/shared/theme/fonts";
import { moderateScale, responsiveFontSize } from "@/shared/utils/responsive";
import React from "react";
import { StyleSheet, Text, TouchableOpacity } from "react-native";

interface AddButtonProps {
  label: string;
  onPress: () => void;
  activeOpacity?: number;
}

export const AddButton = React.memo(
  ({ label, onPress, activeOpacity = 0.7 }: AddButtonProps) => {
    return (
      <TouchableOpacity
        style={styles.addButton}
        activeOpacity={activeOpacity}
        onPress={onPress}
      >
        <Text style={styles.addButtonIcon}>+</Text>
        <Text style={styles.addButtonText}>{label}</Text>
      </TouchableOpacity>
    );
  },
);

AddButton.displayName = "AddButton";

const styles = StyleSheet.create({
  addButton: {
    flexDirection: "row",
    paddingHorizontal: moderateScale(16),
    paddingVertical: moderateScale(2),
    borderRadius: moderateScale(12),
    backgroundColor: BUTTON.background,
    justifyContent: "center",
    alignItems: "center",
    gap: moderateScale(6),
    maxWidth: moderateScale(110),
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  addButtonText: {
    fontSize: responsiveFontSize(12),
    fontFamily: fonts.medium,
    color: BUTTON.text,
  },
  addButtonIcon: {
    paddingTop: moderateScale(2),
    fontSize: responsiveFontSize(16),
    fontFamily: fonts.medium,
    color: BUTTON.text,
  },
});
