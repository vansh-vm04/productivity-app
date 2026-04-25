import { BORDER, PRIMARY, SURFACE, TEXT } from "@/shared/theme/colors";
import { fonts } from "@/shared/theme/fonts";
import { moderateScale, responsiveFontSize } from "@/shared/utils/responsive";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export interface CapsuleItem {
  label: string;
  emoji: string;
}

interface CapsuleSelectorProps {
  items: Record<string, CapsuleItem>;
  selectedValue: string;
  onSelect: (key: string) => void;
  showCustomOption?: boolean;
  onCustomSelect?: () => void;
}

export const CapsuleSelector = React.memo(
  ({
    items,
    selectedValue,
    onSelect,
    showCustomOption = false,
    onCustomSelect,
  }: CapsuleSelectorProps) => {
    return (
      <View style={styles.capsulesContainer}>
        {(Object.entries(items) as [string, CapsuleItem][]).map(
          ([key, value]) => (
            <TouchableOpacity
              key={key}
              style={[
                styles.capsule,
                selectedValue === key && styles.activeCapsule,
              ]}
              onPress={() => onSelect(key)}
            >
              <Text style={styles.capsuleEmoji}>{value.emoji}</Text>
              <Text
                style={[
                  styles.capsuleLabel,
                  selectedValue === key && styles.activeCapsuleLabel,
                ]}
              >
                {value.label}
              </Text>
            </TouchableOpacity>
          ),
        )}

        {showCustomOption && (
          <TouchableOpacity
            style={[
              styles.capsule,
              selectedValue === "custom" && styles.activeCapsule,
            ]}
            onPress={onCustomSelect}
          >
            <Text style={styles.capsuleEmoji}>✏️</Text>
            <Text
              style={[
                styles.capsuleLabel,
                selectedValue === "custom" && styles.activeCapsuleLabel,
              ]}
            >
              Custom
            </Text>
          </TouchableOpacity>
        )}
      </View>
    );
  },
);

CapsuleSelector.displayName = "CapsuleSelector";

const styles = StyleSheet.create({
  capsulesContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: moderateScale(10),
  },
  capsule: {
    flexDirection: "row",
    alignItems: "center",
    gap: moderateScale(4),
    paddingHorizontal: moderateScale(12),
    paddingVertical: moderateScale(6),
    borderRadius: moderateScale(20),
    backgroundColor: SURFACE.primary,
    borderWidth: 1,
    borderColor: BORDER.primary,
  },
  activeCapsule: {
    backgroundColor: `${PRIMARY.main}25`,
    borderColor: PRIMARY.main,
  },
  capsuleEmoji: {
    fontSize: responsiveFontSize(14),
  },
  capsuleLabel: {
    fontSize: responsiveFontSize(12),
    fontFamily: fonts.medium,
    color: TEXT.secondary,
  },
  activeCapsuleLabel: {
    color: PRIMARY.main,
  },
});
