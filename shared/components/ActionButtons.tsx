import { BORDER, PRIMARY, SURFACE, TEXT } from "@/shared/theme/colors";
import { fonts } from "@/shared/theme/fonts";
import { moderateScale, responsiveFontSize } from "@/shared/utils/responsive";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface ActionButtonsProps {
  onCancel: () => void;
  onSubmit: () => void;
  submitLabel?: string;
  cancelLabel?: string;
  isLoading?: boolean;
}

export const ActionButtons = React.memo(
  ({
    onCancel,
    onSubmit,
    submitLabel = "Create",
    cancelLabel = "Cancel",
    isLoading = false,
  }: ActionButtonsProps) => {
    return (
      <View style={styles.buttonsContainer}>
        <TouchableOpacity
          style={styles.cancelButton}
          onPress={onCancel}
          disabled={isLoading}
        >
          <Text style={styles.cancelButtonText}>{cancelLabel}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.createButton,
            isLoading && styles.createButtonDisabled,
          ]}
          onPress={onSubmit}
          disabled={isLoading}
        >
          <Text style={styles.createButtonText}>{submitLabel}</Text>
        </TouchableOpacity>
      </View>
    );
  },
);

ActionButtons.displayName = "ActionButtons";

const styles = StyleSheet.create({
  buttonsContainer: {
    flexDirection: "row",
    gap: moderateScale(12),
    marginBottom: moderateScale(80),
    marginTop: moderateScale(20),
    height: moderateScale(44),
  },
  cancelButton: {
    flex: 1,
    borderRadius: moderateScale(12),
    backgroundColor: SURFACE.primary,
    borderWidth: 1,
    borderColor: BORDER.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  cancelButtonText: {
    fontSize: responsiveFontSize(14),
    fontFamily: fonts.semibold,
    color: TEXT.secondary,
  },
  createButton: {
    flex: 1,
    borderRadius: moderateScale(12),
    backgroundColor: PRIMARY.main,
    alignItems: "center",
    justifyContent: "center",
  },
  createButtonDisabled: {
    opacity: 0.6,
  },
  createButtonText: {
    fontSize: responsiveFontSize(14),
    fontFamily: fonts.semibold,
    color: TEXT.button,
  },
});
