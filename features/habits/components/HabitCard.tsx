import { Habit } from "@/shared/types/habit";
import { TEXT } from "@/shared/theme/colors";
import { fonts } from "@/shared/theme/fonts";
import { moderateScale, responsiveFontSize } from "@/shared/utils/responsive";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface HabitCardProps {
  habit: Habit;
  onPress?: () => void;
  onLongPress?: () => void;
  backgroundColor: string;
  accentColor: string;
}

export const HabitCard = React.memo(
  ({
    habit,
    onPress,
    onLongPress,
    backgroundColor,
    accentColor,
  }: HabitCardProps) => {
    return (
      <TouchableOpacity
        style={[
          styles.habitCard,
          {
            backgroundColor,
            borderColor: accentColor,
          },
        ]}
        onPress={onPress}
        onLongPress={onLongPress}
        delayLongPress={300}
        activeOpacity={0.8}
      >
        {/* Left section: Icon and Name */}
        <View style={styles.leftSection}>
          <Text style={styles.habitIcon}>{habit.icon}</Text>
          <View style={styles.habitInfo}>
            <Text style={styles.habitName} numberOfLines={1}>
              {habit.name}
            </Text>
            <View style={styles.streakContainer}>
              <Text style={styles.fireEmoji}>🔥</Text>
              <Text style={styles.streakText}>{habit.streak} Days</Text>
            </View>
          </View>
        </View>

        {/* Right section: Checkmark */}
        <View
          style={[
            styles.checkbox,
            habit.completed && {
              backgroundColor: accentColor,
              borderColor: accentColor,
            },
            !habit.completed && {
              borderColor: accentColor,
            },
          ]}
        >
          {habit.completed && (
            <MaterialCommunityIcons
              name="check"
              size={moderateScale(16)}
              color="#ffffff"
              style={{ fontWeight: "bold" }}
            />
          )}
        </View>
      </TouchableOpacity>
    );
  },
);

HabitCard.displayName = "HabitCard";

const styles = StyleSheet.create({
  habitCard: {
    width: "100%",
    minHeight: moderateScale(80),
    borderRadius: moderateScale(16),
    borderWidth: 0.5,
    padding: moderateScale(16),
    marginVertical: moderateScale(8),
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    overflow: "hidden",
  },
  leftSection: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: moderateScale(12),
  },
  habitIcon: {
    fontSize: responsiveFontSize(24),
    lineHeight: moderateScale(40),
  },
  habitInfo: {
    flex: 1,
    justifyContent: "center",
    gap: moderateScale(4),
  },
  habitName: {
    fontSize: responsiveFontSize(14),
    fontFamily: fonts.semibold,
    color: TEXT.primary,
    lineHeight: moderateScale(18),
  },
  streakContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: moderateScale(4),
  },
  fireEmoji: {
    fontSize: responsiveFontSize(14),
  },
  streakText: {
    fontSize: responsiveFontSize(12),
    fontFamily: fonts.medium,
    color: TEXT.secondary,
    lineHeight: moderateScale(14),
  },
  checkbox: {
    width: moderateScale(28),
    height: moderateScale(28),
    borderRadius: moderateScale(8),
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "transparent",
  },
});
