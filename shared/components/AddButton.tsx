import { PRIMARY, TEXT } from "@/shared/theme/colors";
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
    backgroundColor: PRIMARY.main,
    justifyContent: "center",
    alignItems: "center",
    gap: moderateScale(6),
    maxWidth: moderateScale(110),
  },
  addButtonText: {
    fontSize: responsiveFontSize(12),
    fontFamily: fonts.medium,
    color: TEXT.button,
  },
  addButtonIcon: {
    paddingTop: moderateScale(2),
    fontSize: responsiveFontSize(16),
    fontFamily: fonts.medium,
    color: TEXT.button,
  },
});
