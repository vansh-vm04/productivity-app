import { PRIMARY, TEXT } from "@/shared/theme/colors";
import { fonts } from "@/shared/theme/fonts";
import { Habit } from "@/shared/types/habit";
import { moderateScale, responsiveFontSize } from "@/shared/utils/responsive";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface HabitCardProps {
  completionValue: number;
  habit: Habit;
  onPress?: () => void;
  onLongPress?: () => void;
  onCountChange?: (value: number) => void;
  onDurationChange?: (value: number) => void;
}

const formatDuration = (minutes: number): string => {
  const safeMinutes = Math.max(0, minutes);
  const hours = Math.floor(safeMinutes / 60);
  const remainingMinutes = safeMinutes % 60;

  return `${String(hours).padStart(2, "0")}:${String(remainingMinutes).padStart(2, "0")}`;
};

export const HabitCard = React.memo(
  ({ habit, onPress, onLongPress, onCountChange, onDurationChange, completionValue }: HabitCardProps) => {
    const isBinaryHabit = habit.type === "binary";
    const isCountHabit = habit.type === "count";
    const isTimeHabit = habit.type === "time";
    const countValue = isCountHabit ?  completionValue : 0;
    const durationValue = isTimeHabit ? completionValue : 0;
    const durationHours = Math.floor(durationValue / 60);
    const durationMinutes = durationValue % 60;

    const handleCountChange = (delta: number) => {
      if (!isCountHabit) {
        return;
      }

      const nextValue = Math.max(0, countValue + delta);
      onCountChange?.(nextValue);
    };

    const handleDurationChange = (delta: number) => {
      if (!isTimeHabit) {
        return;
      }

      const nextValue = Math.max(0, durationValue + delta);
      onDurationChange?.(nextValue);
    };

    return (
      <TouchableOpacity
        style={[
          styles.habitCard,
          {
            backgroundColor: "#ffffff",
          },
        ]}
        onPress={isBinaryHabit ? onPress : undefined}
        onLongPress={onLongPress}
        delayLongPress={300}
        activeOpacity={isBinaryHabit ? 0.8 : 1}
      >
        <View style={styles.content}>
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
            </View>
          </View>

          <View style={styles.actionPanel}>
            {isBinaryHabit && (
              <TouchableOpacity
                style={[
                  styles.completeButton,
                  habit.completed && styles.completeButtonActive,
                ]}
                onPress={onPress}
                activeOpacity={0.85}
              >
                <MaterialCommunityIcons
                  name={habit.completed ? "check-circle" : "checkbox-blank-circle-outline"}
                  size={moderateScale(18)}
                  color={habit.completed ? "#ffffff" : PRIMARY.main}
                />
                <Text
                  style={[
                    styles.completeButtonText,
                    habit.completed && styles.completeButtonTextActive,
                  ]}
                >
                  {habit.completed ? "Completed" : "Complete"}
                </Text>
              </TouchableOpacity>
            )}

            {isCountHabit && (
              <View style={styles.controlPanel}>
                <View style={styles.controlHeader}>
                  <Text style={styles.controlLabel}>Count</Text>
                  <Text style={styles.controlSubLabel} numberOfLines={1}>
                    {habit.targetCount ? `Goal ${habit.targetCount}` : "Set target"}
                  </Text>
                </View>

                <View style={styles.countRow}>
                  <TouchableOpacity
                    style={[
                      styles.stepButton,
                      countValue === 0 && styles.stepButtonDisabled,
                    ]}
                    onPress={() => handleCountChange(-1)}
                    activeOpacity={0.8}
                    disabled={countValue === 0}
                  >
                    <MaterialCommunityIcons
                      name="minus"
                      size={moderateScale(16)}
                      color={countValue === 0 ? TEXT.tertiary : TEXT.primary}
                    />
                  </TouchableOpacity>

                  <View style={styles.countValueBox}>
                    <Text style={styles.countValueText}>{countValue}</Text>
                    <Text style={styles.countUnitText} numberOfLines={1}>
                      {habit.countUnit || "items"}
                    </Text>
                  </View>

                  <TouchableOpacity
                    style={styles.stepButton}
                    onPress={() => handleCountChange(1)}
                    activeOpacity={0.8}
                  >
                    <MaterialCommunityIcons
                      name="plus"
                      size={moderateScale(16)}
                      color={PRIMARY.main}
                    />
                  </TouchableOpacity>
                </View>
              </View>
            )}

            {isTimeHabit && (
              <View style={styles.controlPanel}>
                <View style={styles.controlHeader}>
                  <Text style={styles.controlLabel}>Duration</Text>
                  <Text style={styles.controlSubLabel} numberOfLines={1}>
                    {habit.targetDuration
                      ? `Goal ${formatDuration(habit.targetDuration)}`
                      : "Set goal"}
                  </Text>
                </View>

                <View style={styles.timeRow}>
                  <View style={styles.timeColumn}>
                    <Text style={styles.timeUnitLabel}>Hours</Text>
                    <View style={styles.timeValueBox}>
                      <Text style={styles.timeValueText}>
                        {String(durationHours).padStart(2, "0")}
                      </Text>
                    </View>
                    <View style={styles.stepperRow}>
                      <TouchableOpacity
                        style={styles.stepButton}
                        onPress={() => handleDurationChange(-60)}
                        activeOpacity={0.8}
                        disabled={durationValue === 0}
                      >
                        <MaterialCommunityIcons
                          name="minus"
                          size={moderateScale(16)}
                          color={durationValue === 0 ? TEXT.tertiary : TEXT.primary}
                        />
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={styles.stepButton}
                        onPress={() => handleDurationChange(60)}
                        activeOpacity={0.8}
                      >
                        <MaterialCommunityIcons
                          name="plus"
                          size={moderateScale(16)}
                          color={PRIMARY.main}
                        />
                      </TouchableOpacity>
                    </View>
                  </View>

                  <View style={styles.timeColumn}>
                    <Text style={styles.timeUnitLabel}>Minutes</Text>
                    <View style={styles.timeValueBox}>
                      <Text style={styles.timeValueText}>
                        {String(durationMinutes).padStart(2, "0")}
                      </Text>
                    </View>
                    <View style={styles.stepperRow}>
                      <TouchableOpacity
                        style={styles.stepButton}
                        onPress={() => handleDurationChange(-1)}
                        activeOpacity={0.8}
                        disabled={durationValue === 0}
                      >
                        <MaterialCommunityIcons
                          name="minus"
                          size={moderateScale(16)}
                          color={durationValue === 0 ? TEXT.tertiary : TEXT.primary}
                        />
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={styles.stepButton}
                        onPress={() => handleDurationChange(1)}
                        activeOpacity={0.8}
                      >
                        <MaterialCommunityIcons
                          name="plus"
                          size={moderateScale(16)}
                          color={PRIMARY.main}
                        />
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              </View>
            )}
          </View>
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
    flexDirection: "column",
    gap: moderateScale(14),
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
    flexDirection: "row",
    alignItems: "center",
    gap: moderateScale(12),
  },
  content: {
    gap: moderateScale(14),
  },
  actionPanel: {
    width: "100%",
    gap: moderateScale(8),
  },
  completeButton: {
    minHeight: moderateScale(44),
    borderRadius: moderateScale(12),
    borderWidth: 1,
    borderColor: PRIMARY.main,
    backgroundColor: "rgba(0, 104, 217, 0.06)",
    paddingHorizontal: moderateScale(14),
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: moderateScale(8),
  },
  completeButtonActive: {
    backgroundColor: "#059669",
    borderColor: "#059669",
  },
  completeButtonText: {
    fontSize: responsiveFontSize(13),
    fontFamily: fonts.semibold,
    color: PRIMARY.main,
  },
  completeButtonTextActive: {
    color: "#ffffff",
  },
  controlPanel: {
    width: "100%",
    gap: moderateScale(8),
    alignItems: "stretch",
  },
  controlHeader: {
    alignItems: "flex-start",
    gap: moderateScale(2),
  },
  controlLabel: {
    fontSize: responsiveFontSize(12),
    fontFamily: fonts.semibold,
    color: TEXT.primary,
  },
  controlSubLabel: {
    fontSize: responsiveFontSize(10),
    fontFamily: fonts.regular,
    color: TEXT.tertiary,
  },
  countRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: moderateScale(8),
  },
  countValueBox: {
    flex: 1,
    minHeight: moderateScale(44),
    borderRadius: moderateScale(12),
    backgroundColor: "rgba(0, 0, 0, 0.04)",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: moderateScale(8),
  },
  countValueText: {
    fontSize: responsiveFontSize(18),
    fontFamily: fonts.bold,
    color: TEXT.primary,
    lineHeight: moderateScale(22),
  },
  countUnitText: {
    fontSize: responsiveFontSize(10),
    fontFamily: fonts.medium,
    color: TEXT.tertiary,
  },
  timeRow: {
    flexDirection: "row",
    gap: moderateScale(8),
  },
  timeColumn: {
    flex: 1,
    gap: moderateScale(6),
    alignItems: "stretch",
  },
  timeUnitLabel: {
    fontSize: responsiveFontSize(11),
    fontFamily: fonts.semibold,
    color: TEXT.secondary,
    textAlign: "center",
  },
  timeValueBox: {
    minHeight: moderateScale(44),
    borderRadius: moderateScale(12),
    backgroundColor: "rgba(0, 0, 0, 0.04)",
    alignItems: "center",
    justifyContent: "center",
  },
  timeValueText: {
    fontSize: responsiveFontSize(18),
    fontFamily: fonts.bold,
    color: TEXT.primary,
    lineHeight: moderateScale(22),
  },
  stepperRow: {
    flexDirection: "row",
    gap: moderateScale(6),
  },
  stepButton: {
    flex: 1,
    minHeight: moderateScale(32),
    borderRadius: moderateScale(10),
    borderWidth: 1,
    borderColor: "rgba(0, 0, 0, 0.08)",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(0, 0, 0, 0.02)",
  },
  stepButtonDisabled: {
    opacity: 0.45,
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
});
