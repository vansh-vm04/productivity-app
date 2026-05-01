import { PRIMARY, TEXT } from "@/shared/theme/colors";
import { fonts } from "@/shared/theme/fonts";
import { Habit } from "@/shared/types/habit";
import { moderateScale, responsiveFontSize } from "@/shared/utils/responsive";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface HabitCardWeeklyProps {
  habit: Habit;
  onPress?: () => void;
  onLongPress?: () => void;
  completedDays: string[]; // ["Monday", "Wednesday", "Friday"]
}

const WEEKDAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export const HabitCardWeekly = React.memo(
  ({ habit, onPress, onLongPress, completedDays }: HabitCardWeeklyProps) => {
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
        {/* Header section: Icon, Name, and Streak */}
        <View style={styles.headerSection}>
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
              style={styles.fireEmoji}
              />
              <Text style={[styles.streakText, { color: PRIMARY.main }]}>
                {habit.streak} days this week
              </Text>
            </View>
          </View>
        </View>

        {/* Week days section */}
        <View style={styles.weekDaysContainer}>
          {WEEKDAYS.map((day, index) => (
            <View
              key={day}
              style={[
                styles.dayBadge,
                completedDays.includes(day) && {
                  backgroundColor: "#059669",
                  borderColor: "#059669",
                },
                !completedDays.includes(day) && {
                  borderColor: "#a4a4a4",
                },
              ]}
            >
              <Text
                style={[
                  styles.dayText,
                  completedDays.includes(day) && { color: "#ffffff" },
                  !completedDays.includes(day) && { color: TEXT.secondary },
                ]}
              >
                {day}
              </Text>
            </View>
          ))}
        </View>
      </TouchableOpacity>
    );
  },
);

HabitCardWeekly.displayName = "HabitCardWeekly";

const styles = StyleSheet.create({
  habitCard: {
    width: "100%",
    borderRadius: moderateScale(16),
    padding: moderateScale(16),
    marginBottom: moderateScale(8),
    flexDirection: "column",
    gap: moderateScale(12),
    overflow: "hidden",
    shadowColor: "#000000",
    shadowOpacity: 0.04,
    shadowRadius: 3,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    elevation: 1,
    borderWidth: 0.5,
    borderColor: "#D1D5DB",
  },
  headerSection: {
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
    color: PRIMARY.main,
  },
  streakText: {
    fontSize: responsiveFontSize(12),
    fontFamily: fonts.medium,
    color: TEXT.secondary,
    lineHeight: moderateScale(14),
  },
  weekDaysContainer: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    gap: moderateScale(6),
  },
  dayBadge: {
    flex: 1,
    height: moderateScale(28),
    borderRadius: moderateScale(8),
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "transparent",
    borderStyle: "dotted",
  },
  dayText: {
    fontSize: responsiveFontSize(10),
    fontFamily: fonts.medium,
    lineHeight: moderateScale(13),
  },
});
