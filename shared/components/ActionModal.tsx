import {
    BACKGROUND,
    BORDER,
    MODAL,
    SURFACE,
    TEXT,
} from "@/shared/theme/colors";
import { fonts } from "@/shared/theme/fonts";
import { moderateScale, responsiveFontSize } from "@/shared/utils/responsive";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import React from "react";
import { Modal, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export type ActionModalItem = {
  key: string;
  label: string;
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
  iconColor: string;
  danger?: boolean;
  onPress: () => void;
};

type Props = {
  visible: boolean;
  title: string;
  actions: ActionModalItem[];
  onClose: () => void;
  cancelLabel?: string;
};

export default function ActionModal({
  visible,
  title,
  actions,
  onClose,
  cancelLabel = "Cancel",
}: Props) {
  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.content}>
          <Text style={styles.title}>{title}</Text>

          {actions.map((action) => (
            <TouchableOpacity
              key={action.key}
              style={[styles.button, action.danger && styles.dangerButton]}
              onPress={action.onPress}
              activeOpacity={0.7}
            >
              <MaterialCommunityIcons
                name={action.icon}
                size={moderateScale(20)}
                color={action.iconColor}
              />
              <Text
                style={[styles.buttonText, action.danger && styles.dangerText]}
              >
                {action.label}
              </Text>
            </TouchableOpacity>
          ))}

          <TouchableOpacity
            style={styles.cancelButton}
            onPress={onClose}
            activeOpacity={0.7}
          >
            <Text style={styles.cancelText}>{cancelLabel}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: MODAL.overlay,
    justifyContent: "center",
    paddingHorizontal: moderateScale(20),
  },
  content: {
    backgroundColor: SURFACE.primary,
    borderRadius: moderateScale(24),
    padding: moderateScale(20),
    paddingBottom: moderateScale(15),
  },
  title: {
    fontSize: responsiveFontSize(18),
    fontFamily: fonts.bold,
    color: TEXT.primary,
    marginBottom: moderateScale(10),
    textAlign: "center",
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    gap: moderateScale(10),
    paddingVertical: moderateScale(14),
    paddingHorizontal: moderateScale(16),
    borderRadius: moderateScale(12),
    marginVertical: moderateScale(4),
    backgroundColor: BACKGROUND.secondary,
    borderWidth: 0.5,
    borderColor: BORDER.primary,
  },
  buttonText: {
    paddingTop: moderateScale(2),
    fontSize: responsiveFontSize(14),
    fontFamily: fonts.semibold,
    color: TEXT.primary,
    flex: 1,
  },
  dangerButton: {
    borderColor: "rgba(239, 68, 68, 0.3)",
  },
  dangerText: {
    color: "#EF4444",
  },
  cancelButton: {
    paddingVertical: moderateScale(12),
    marginTop: moderateScale(12),
  },
  cancelText: {
    fontSize: responsiveFontSize(14),
    fontFamily: fonts.semibold,
    color: TEXT.secondary,
    textAlign: "center",
  },
});
