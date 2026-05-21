import { PRIMARY, TEXT } from "@/shared/theme/colors";
import { fonts } from "@/shared/theme/fonts";
import { Habit } from "@/shared/types/habit";
import { moderateScale, responsiveFontSize } from "@/shared/utils/responsive";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import React from "react";
import { Modal, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";

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

interface TimeInputModalProps {
  isVisible: boolean;
  currentMinutes: number;
  onConfirm: (minutes: number) => void;
  onClose: () => void;
}

const TimeInputModal = ({ isVisible, currentMinutes, onConfirm, onClose }: TimeInputModalProps) => {
  const initialHours = Math.floor(currentMinutes / 60);
  const initialMins = currentMinutes % 60;
  const [hours, setHours] = React.useState(String(initialHours).padStart(2, "0"));
  const [minutes, setMinutes] = React.useState(String(initialMins).padStart(2, "0"));

  React.useEffect(() => {
    setHours(String(initialHours));
    setMinutes(String(initialMins));
  }, [isVisible, initialHours, initialMins]);

  const handleConfirm = () => {
    const h = Math.max(0, parseInt(hours || "0", 10));
    const m = Math.max(0, Math.min(59, parseInt(minutes || "0", 10)));
    onConfirm(h * 60 + m);
    onClose();
  };

  return (
    <Modal visible={isVisible} transparent={true} animationType="fade">
      <TouchableOpacity
        style={styles.modalOverlay}
        activeOpacity={1}
        onPress={onClose}
      >
        <TouchableOpacity
          style={styles.modalContent}
          activeOpacity={1}
          onPress={(e) => e.stopPropagation()}
        >
          <Text style={styles.modalTitle}>Completed Duration</Text>

          <View style={styles.timeInputRow}>
            <View style={styles.timeInputColumn}>
              <Text style={styles.timeInputLabel}>Hours</Text>
              <TextInput
                style={styles.timeInput}
                value={hours}
                onChangeText={(text) => {
                  const filtered = text.replace(/[^0-9]/g, '');
                  setHours(filtered);
                }}
                keyboardType="number-pad"
                maxLength={2}
                placeholder="00"
                placeholderTextColor={TEXT.tertiary}
                autoFocus
              />
            </View>

            <Text style={styles.timeInputSeparator}>:</Text>

            <View style={styles.timeInputColumn}>
              <Text style={styles.timeInputLabel}>Minutes</Text>
              <TextInput
                style={styles.timeInput}
                value={minutes}
                onChangeText={(text) => {
                  const filtered = text.replace(/[^0-9]/g, '');
                  setMinutes(filtered);
                }}
                keyboardType="number-pad"
                maxLength={2}
                placeholder="00"
                placeholderTextColor={TEXT.tertiary}
              />
            </View>
          </View>

          <View style={styles.modalButtonRow}>
            <TouchableOpacity style={[styles.modalButton, styles.modalButtonCancel]} onPress={onClose}>
              <Text style={styles.modalButtonCancelText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.modalButton, styles.modalButtonConfirm]} onPress={handleConfirm}>
              <Text style={styles.modalButtonConfirmText}>Confirm</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
  );
};


export const HabitCard = React.memo(
  ({ habit, onPress, onLongPress, onCountChange, onDurationChange, completionValue }: HabitCardProps) => {
    const isBinaryHabit = habit.type === "binary";
    const isCountHabit = habit.type === "count";
    const isTimeHabit = habit.type === "time";
    const [timeModalVisible, setTimeModalVisible] = React.useState(false);
    const countValue = isCountHabit ?  completionValue : 0;
    const durationValue = isTimeHabit ? completionValue : 0;
    const isCompleted = isBinaryHabit ? habit.completed : isCountHabit ?  completionValue >= (habit.targetCount || 0) : completionValue >= (habit.targetDuration || 0);

    const handleCountChange = (delta: number) => {
      if (!isCountHabit) {
        return;
      }

      const nextValue = Math.max(0, countValue + delta);
      onCountChange?.(nextValue);
    };

    return (
      <TouchableOpacity
        style={[
          styles.habitCard,
          {
            backgroundColor: "#ffffff",
          },
        ]}
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
                  color={isCompleted ? "#059669" : PRIMARY.main}
                  style={styles.fireEmoji}
                />
                <Text style={[styles.streakText, { color: isCompleted ? "#059669" : PRIMARY.main }]}>
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
                  isCompleted && styles.completeButtonActive,
                ]}
                onPress={onPress}
                activeOpacity={0.85}
              >
                {isCompleted && (<MaterialCommunityIcons
                  name={"check-circle"}
                  size={moderateScale(18)}
                  color={"#ffffff"}
                />)}
                
                <Text
                  style={[
                    styles.completeButtonText,
                    isCompleted && styles.completeButtonTextActive,
                  ]}
                >
                  {isCompleted ? "Completed" : "Complete"}
                </Text>
              </TouchableOpacity>
            )}

            {isCountHabit && (
              <View style={styles.controlPanel}>
                <View style={styles.controlHeader}>
                  <Text style={styles.controlLabel}>Today&apos;s target</Text>
                  <Text style={styles.controlSubLabel} numberOfLines={1}>
                    {habit.targetCount ? `${habit.targetCount} ${habit.countUnit || ""}` : "Set target"}
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
                      ? `Target: ${formatDuration(habit.targetDuration)}`
                      : "Set target"}
                  </Text>
                </View>

                <TouchableOpacity
                  style={styles.timeDisplayBox}
                  onPress={() => setTimeModalVisible(true)}
                  activeOpacity={0.7}
                >
                  <Text style={styles.timeDisplayValue}>{formatDuration(durationValue)}</Text>
                  <MaterialCommunityIcons
                    name="pencil"
                    size={moderateScale(16)}
                    color={PRIMARY.main}
                  />
                </TouchableOpacity>

                <TimeInputModal
                  isVisible={timeModalVisible}
                  currentMinutes={durationValue}
                  onConfirm={(minutes) => onDurationChange?.(minutes)}
                  onClose={() => setTimeModalVisible(false)}
                />
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
    lineHeight: moderateScale(18),
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
  stepButton: {
    minHeight: moderateScale(44),
    minWidth: moderateScale(44),
    borderRadius: moderateScale(10),
    borderWidth: 1,
    borderColor: "rgba(0, 0, 0, 0.08)",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(0, 0, 0, 0.02)",
  },
  stepButtonDisabled: {
    opacity: 0.5,
  },
  timeDisplayBox: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: moderateScale(12),
    minHeight: moderateScale(48),
    borderRadius: moderateScale(12),
    backgroundColor: "rgba(0, 104, 217, 0.08)",
    borderWidth: 1,
    borderColor: PRIMARY.main,
    paddingHorizontal: moderateScale(16),
  },
  timeDisplayValue: {
    fontSize: responsiveFontSize(22),
    fontFamily: fonts.bold,
    color: PRIMARY.main,
    lineHeight: moderateScale(36),
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "#ffffff",
    borderRadius: moderateScale(20),
    padding: moderateScale(24),
    width: "85%",
    gap: moderateScale(20),
  },
  modalTitle: {
    fontSize: responsiveFontSize(18),
    fontFamily: fonts.semibold,
    color: TEXT.primary,
    textAlign: "center",
  },
  timeInputRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "center",
    gap: moderateScale(12),
  },
  timeInputColumn: {
    alignItems: "center",
    gap: moderateScale(8),
  },
  timeInputLabel: {
    fontSize: responsiveFontSize(12),
    fontFamily: fonts.medium,
    color: TEXT.secondary,
  },
  timeInput: {
    fontSize: responsiveFontSize(24),
    fontFamily: fonts.bold,
    color: TEXT.primary,
    borderWidth: 1,
    borderColor: PRIMARY.main,
    borderRadius: moderateScale(12),
    paddingHorizontal: moderateScale(12),
    paddingVertical: moderateScale(8),
    width: moderateScale(60),
    textAlign: "center",
  },
  timeInputSeparator: {
    fontSize: responsiveFontSize(24),
    fontFamily: fonts.bold,
    color: TEXT.primary,
    marginBottom: moderateScale(8),
  },
  modalButtonRow: {
    flexDirection: "row",
    gap: moderateScale(12),
  },
  modalButton: {
    flex: 1,
    minHeight: moderateScale(44),
    borderRadius: moderateScale(10),
    alignItems: "center",
    justifyContent: "center",
  },
  modalButtonCancel: {
    backgroundColor: "rgba(0, 0, 0, 0.06)",
  },
  modalButtonCancelText: {
    fontSize: responsiveFontSize(14),
    fontFamily: fonts.semibold,
    color: TEXT.primary,
  },
  modalButtonConfirm: {
    backgroundColor: PRIMARY.main,
  },
  modalButtonConfirmText: {
    fontSize: responsiveFontSize(14),
    fontFamily: fonts.semibold,
    color: "#ffffff",
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
});
