import { PRIMARY, TEXT } from "@/shared/theme/colors";
import { fonts } from "@/shared/theme/fonts";
import { Habit } from "@/shared/types/habit";
import { moderateScale, responsiveFontSize } from "@/shared/utils/responsive";
import React, { useMemo } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface HabitCardMonthlyProps {
  habit: Habit;
  onPress?: () => void;
  onLongPress?: () => void;
  completionDates: string[]; // Array of dates in "YYYY-MM-DD" format
  month?: number; // 0-11
  year?: number;
}

const WEEKDAY_HEADERS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export const HabitCardMonthly = React.memo(
  ({
    habit,
    onPress,
    onLongPress,
    completionDates,
    month,
    year,
  }: HabitCardMonthlyProps) => {
    // Get current month/year if not provided
    const currentDate = new Date();
    const displayMonth = month !== undefined ? month : currentDate.getMonth();
    const displayYear = year !== undefined ? year : currentDate.getFullYear();

    const calendarDays = useMemo(() => {
      const firstDay = new Date(displayYear, displayMonth, 1).getDay();
      const daysInMonth = new Date(displayYear, displayMonth + 1, 0).getDate();

      const days: {
        day: number | null;
        isCurrentMonth: boolean;
        isCompleted: boolean;
      }[] = [];

      // Add empty cells for days before month starts
      for (let i = 0; i < firstDay; i++) {
        days.push({ day: null, isCurrentMonth: false, isCompleted: false });
      }

      // Add days of current month
      for (let day = 1; day <= daysInMonth; day++) {
        const dateStr = `${displayYear}-${String(displayMonth + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
        days.push({
          day,
          isCurrentMonth: true,
          isCompleted: completionDates.includes(dateStr),
        });
      }

      return days;
    }, [displayMonth, displayYear, completionDates]);

    const getHeatmapColor = (isCompleted: boolean): string => {
      if (isCompleted) {
        return habit.accentColor;
      }
      return "rgba(0, 0, 0, 0.05)";
    };

    const monthName = new Date(displayYear, displayMonth).toLocaleString(
      "default",
      {
        month: "short",
      },
    );

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
        <View style={styles.content}>
          {/* Header with Icon and Name */}
          <View style={styles.header}>
            <View style={styles.iconContainer}>
              <Text style={styles.habitIcon}>{habit.icon}</Text>
            </View>
            <View style={styles.habitInfo}>
              <Text style={styles.habitName} numberOfLines={1}>
                {habit.name}
              </Text>
              <View style={styles.streakContainer}>
                <Text style={[styles.fireEmoji, { color: PRIMARY.main }]}>
                  🔥
                </Text>
                <Text style={[styles.streakText, { color: PRIMARY.main }]}>
                  {habit.streak} Days
                </Text>
              </View>
            </View>
            <View style={styles.monthLabel}>
              <Text style={[styles.monthText, { color: habit.accentColor }]}>
                {monthName}
              </Text>
            </View>
          </View>

          {/* Calendar Grid */}
          <View style={styles.calendarContainer}>
            {/* Weekday headers */}
            <View style={styles.weekdayRow}>
              {WEEKDAY_HEADERS.map((day) => (
                <View key={day} style={styles.weekdayCell}>
                  <Text style={styles.weekdayText}>{day}</Text>
                </View>
              ))}
            </View>
            {/* Calendar days */}
            <View style={styles.daysGrid}>
              {calendarDays.map((dayObj, index) => (
                <View
                  key={index}
                  style={[
                    styles.dayCell,
                    {
                      backgroundColor: getHeatmapColor(dayObj.isCompleted),
                    },
                  ]}
                >
                  {dayObj.isCurrentMonth && dayObj.day !== null && (
                    <Text
                      style={[
                        styles.dayNumber,
                        dayObj.isCompleted && { color: "#ffffff" },
                      ]}
                    >
                      {dayObj.day}
                    </Text>
                  )}
                </View>
              ))}
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  },
);

HabitCardMonthly.displayName = "HabitCardMonthly";

const styles = StyleSheet.create({
  habitCard: {
    width: "100%",
    borderRadius: moderateScale(16),
    padding: moderateScale(16),
    marginVertical: moderateScale(4),
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
  content: {
    gap: moderateScale(12),
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
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
  },
  streakText: {
    fontSize: responsiveFontSize(12),
    fontFamily: fonts.medium,
    color: TEXT.secondary,
    lineHeight: moderateScale(14),
  },
  monthLabel: {
    paddingHorizontal: moderateScale(8),
    paddingVertical: moderateScale(4),
    backgroundColor: "rgba(0, 0, 0, 0.05)",
    borderRadius: moderateScale(6),
  },
  monthText: {
    fontSize: responsiveFontSize(12),
    fontFamily: fonts.semibold,
    lineHeight: moderateScale(14),
  },
  calendarContainer: {
    gap: moderateScale(4),
  },
  weekdayRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  weekdayCell: {
    flex: 1,
    height: moderateScale(24),
    alignItems: "center",
    justifyContent: "center",
  },
  weekdayText: {
    fontSize: responsiveFontSize(10),
    fontFamily: fonts.medium,
    color: TEXT.secondary,
    lineHeight: moderateScale(12),
  },
  daysGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  dayCell: {
    width: `${100 / 7 - 2}%`,
    height: moderateScale(28),
    borderRadius: moderateScale(6),
    alignItems: "center",
    justifyContent: "center",
    margin: moderateScale(3),
  },
  dayNumber: {
    fontSize: responsiveFontSize(10),
    fontFamily: fonts.medium,
    color: TEXT.secondary,
    lineHeight: moderateScale(12),
  },
});
