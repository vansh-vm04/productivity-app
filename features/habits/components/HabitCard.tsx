import { PRIMARY, TEXT } from "@/shared/theme/colors";
import { fonts } from "@/shared/theme/fonts";
import { Habit } from "@/shared/types/habit";
import { formatTimestamp } from "@/shared/utils/formatTimestamp";
import { moderateScale, responsiveFontSize } from "@/shared/utils/responsive";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface HabitCardProps {
  habit: Habit;
  onPress?: () => void;
  onLongPress?: () => void;
}

export const HabitCard = React.memo(
  ({ habit, onPress, onLongPress }: HabitCardProps) => {
    return (
      <TouchableOpacity
        style={[
          styles.habitCard,
          {
            backgroundColor: "#ffffff",
          },
        ]}
        onPress={onPress}
        onLongPress={onLongPress}
        delayLongPress={300}
        activeOpacity={0.8}
      >
        {/* Left section: Icon and Name */}
        <View style={styles.leftSection}>
          <View style={styles.iconContainer}>
            <Text style={styles.habitIcon}>{habit.icon}</Text>
          </View>
          <View style={styles.habitInfo}>
            <Text style={styles.habitName} numberOfLines={1}>
              {habit.name}
            </Text>
            <View style={styles.streakContainer}>
              <MaterialCommunityIcons
                name="check"
                size={moderateScale(16)}
                color="#ffffff"
                style={styles.fireEmoji}
              />
              <Text style={[styles.streakText, { color: PRIMARY.main }]}>
                {habit.streak} days completed
              </Text>
            </View>
            <Text style={styles.timestampText}>
              {formatTimestamp(habit.createdAt)}
            </Text>
          </View>
        </View>

        {/* Right section: Checkmark */}
        <View
          style={[
            styles.checkbox,
            habit.completed && {
              backgroundColor: "#059669",
              borderColor: "#059669",
            },
            !habit.completed && {
              borderColor: PRIMARY.main,
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
    borderColor: "#D1D5DB",
    padding: moderateScale(16),
    marginBottom: moderateScale(8),
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    overflow: "hidden",
    shadowColor: "#000000",
    shadowOpacity: 0.04,
    shadowRadius: 3,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    elevation: 1,
  },
  leftSection: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: moderateScale(12),
  },
  iconContainer: {
    width: moderateScale(48),
    height: moderateScale(48),
    borderRadius: moderateScale(8),
    backgroundColor: "rgba(0, 0, 0, 0.05)",
    alignItems: "center",
    justifyContent: "center",
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
    color: PRIMARY.main,
  },
  streakText: {
    fontSize: responsiveFontSize(12),
    fontFamily: fonts.medium,
    color: TEXT.secondary,
    lineHeight: moderateScale(14),
  },
  timestampText: {
    fontSize: responsiveFontSize(11),
    fontFamily: fonts.regular,
    color: TEXT.tertiary,
    marginTop: moderateScale(4),
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
