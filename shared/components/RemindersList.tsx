import { BORDER, PRIMARY, SURFACE, TEXT } from "@/shared/theme/colors";
import { fonts } from "@/shared/theme/fonts";
import { Reminder } from "@/shared/types/habit";
import { moderateScale, responsiveFontSize } from "@/shared/utils/responsive";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import DateTimePicker from "@react-native-community/datetimepicker";
import React from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

interface RemindersListProps {
  reminders: Reminder[];
  onRemindersChange: (reminders: Reminder[]) => void;
  showTimePicker: boolean;
  selectedReminderIndex: number;
  onShowTimePicker: (index: number) => void;
  onHideTimePicker: () => void;
  onTimeChange: (event: any, selectedTime?: Date) => void;
}

export const RemindersList = React.memo(
  ({
    reminders,
    onRemindersChange,
    showTimePicker,
    selectedReminderIndex,
    onShowTimePicker,
    onHideTimePicker,
    onTimeChange,
  }: RemindersListProps) => {
    const maxReminders = 5;
    const canAddReminder = reminders.length < maxReminders;

    const createReminderId = () =>
      `reminder_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;

    const handleAddReminder = () => {
      if (!canAddReminder) return;

      const newReminder: Reminder = {
        id: createReminderId(),
        time: "09:00",
        label: "reminder",
        enabled: true,
        repeatInterval: null,
      };
      onRemindersChange([...reminders, newReminder]);
    };

    const handleRemoveReminder = (index: number) => {
      onHideTimePicker();
      onRemindersChange(reminders.filter((_, i) => i !== index));
    };

    const handleUpdateReminder = (
      index: number,
      updates: Partial<Reminder>,
    ) => {
      const updatedReminders = [...reminders];
      updatedReminders[index] = {
        ...updatedReminders[index],
        ...updates,
      };
      onRemindersChange(updatedReminders);
    };

    const handleToggleRepeat = (index: number) => {
      const reminder = reminders[index];
      handleUpdateReminder(index, {
        repeatInterval: reminder.repeatInterval ? null : 2,
      });
    };

    const handleAdjustInterval = (index: number, delta: number) => {
      const reminder = reminders[index];
      const current = reminder.repeatInterval || 2;
      const next = Math.min(24, Math.max(1, current + delta));
      handleUpdateReminder(index, { repeatInterval: next });
    };

    const getReminderTime = (timeString: string): Date => {
      const [hours, minutes] = timeString.split(":").map(Number);
      const date = new Date();
      date.setHours(hours, minutes);
      return date;
    };

    return (
      <View>
        <View style={styles.remindersHeader}>
          <Text style={styles.reminderLabel}>Reminders</Text>
          <TouchableOpacity
            style={styles.addReminderButton}
            onPress={handleAddReminder}
            disabled={!canAddReminder}
          >
            <MaterialCommunityIcons
              name="plus"
              size={18}
              color={canAddReminder ? PRIMARY.main : TEXT.tertiary}
            />
            <Text
              style={[
                styles.addReminderButtonText,
                !canAddReminder && { color: TEXT.tertiary },
              ]}
            >
              Add
            </Text>
          </TouchableOpacity>
        </View>

        {reminders.map((reminder, index) => (
          <View key={reminder.id} style={styles.reminderItem}>
            <View style={styles.reminderTopRow}>
              <TouchableOpacity
                style={styles.reminderTimeButton}
                onPress={() => onShowTimePicker(index)}
              >
                <MaterialCommunityIcons
                  name="clock"
                  size={18}
                  color={PRIMARY.main}
                />
                <Text style={styles.reminderTimeText}>{reminder.time}</Text>
              </TouchableOpacity>

              <TextInput
                style={styles.reminderLabelInput}
                placeholder="e.g., Morning"
                placeholderTextColor={TEXT.tertiary}
                value={reminder.label}
                onChangeText={(text) =>
                  handleUpdateReminder(index, { label: text })
                }
                maxLength={20}
              />

              <TouchableOpacity
                style={styles.reminderToggle}
                onPress={() =>
                  handleUpdateReminder(index, { enabled: !reminder.enabled })
                }
              >
                <MaterialCommunityIcons
                  name={
                    reminder.enabled ? "toggle-switch" : "toggle-switch-off"
                  }
                  size={36}
                  color={reminder.enabled ? PRIMARY.main : TEXT.tertiary}
                />
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.removeReminderButton}
                onPress={() => handleRemoveReminder(index)}
              >
                <MaterialCommunityIcons
                  name="close"
                  size={18}
                  color={TEXT.tertiary}
                />
              </TouchableOpacity>
            </View>

            <View style={styles.repeatSection}>
              <View style={styles.repeatDivider} />

              <View style={styles.repeatToggleRow}>
                <TouchableOpacity
                  style={styles.repeatLabelBtn}
                  onPress={() => handleToggleRepeat(index)}
                  activeOpacity={0.7}
                  hitSlop={{ top: 8, bottom: 8, left: 4, right: 4 }}
                >
                  <MaterialCommunityIcons
                    name={reminder.repeatInterval ? "repeat" : "repeat-off"}
                    size={18}
                    color={reminder.repeatInterval ? PRIMARY.main : TEXT.tertiary}
                  />
                  <Text
                    style={[
                      styles.repeatToggleLabel,
                      reminder.repeatInterval ? styles.repeatToggleActive : null,
                    ]}
                  >
                    {reminder.repeatInterval ? "Repeat every" : "Repeat"}
                  </Text>
                </TouchableOpacity>

                {reminder.repeatInterval ? (
                  <View style={styles.repeatStepper}>
                    <TouchableOpacity
                      style={styles.stepperBtn}
                      onPress={() => handleAdjustInterval(index, -1)}
                      hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                    >
                      <MaterialCommunityIcons
                        name="minus"
                        size={16}
                        color={TEXT.primary}
                      />
                    </TouchableOpacity>

                    <View style={styles.repeatValuePill}>
                      <Text style={styles.repeatValueText}>
                        {reminder.repeatInterval}h
                      </Text>
                    </View>

                    <TouchableOpacity
                      style={styles.stepperBtn}
                      onPress={() => handleAdjustInterval(index, 1)}
                      hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                    >
                      <MaterialCommunityIcons
                        name="plus"
                        size={16}
                        color={TEXT.primary}
                      />
                    </TouchableOpacity>
                  </View>
                ) : null}
              </View>
            </View>
          </View>
        ))}

        {/* Time Picker Modal */}
        {showTimePicker && (
          <DateTimePicker
            value={getReminderTime(
              reminders[selectedReminderIndex]?.time || "09:00",
            )}
            mode="time"
            display="default"
            onChange={onTimeChange}
          />
        )}
      </View>
    );
  },
);
RemindersList.displayName = "RemindersList";

const styles = StyleSheet.create({
  remindersHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: moderateScale(12),
  },
  reminderLabel: {
    fontSize: responsiveFontSize(14),
    fontFamily: fonts.medium,
    color: TEXT.primary,
  },
  addReminderButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: moderateScale(2),
    paddingHorizontal: moderateScale(12),
    paddingVertical: moderateScale(6),
    borderRadius: moderateScale(8),
    backgroundColor: `${PRIMARY.main}15`,
  },
  addReminderButtonText: {
    fontSize: responsiveFontSize(13),
    fontFamily: fonts.medium,
    color: PRIMARY.main,
    lineHeight: moderateScale(16),
  },
  reminderItem: {
    paddingHorizontal: moderateScale(12),
    paddingVertical: moderateScale(12),
    marginBottom: moderateScale(10),
    backgroundColor: SURFACE.primary,
    borderRadius: moderateScale(12),
    borderWidth: 1,
    borderColor: BORDER.primary,
  },
  reminderTopRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: moderateScale(10),
  },
  reminderTimeButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: moderateScale(6),
    paddingHorizontal: moderateScale(10),
    paddingVertical: moderateScale(8),
    borderRadius: moderateScale(8),
    backgroundColor: `${PRIMARY.main}15`,
  },
  reminderTimeText: {
    fontSize: responsiveFontSize(12),
    fontFamily: fonts.medium,
    color: PRIMARY.main,
  },
  reminderLabelInput: {
    flex: 1,
    fontSize: responsiveFontSize(12),
    fontFamily: fonts.regular,
    color: TEXT.primary,
    paddingVertical: moderateScale(4),
  },
  reminderToggle: {
    paddingHorizontal: moderateScale(8),
  },
  removeReminderButton: {
    paddingHorizontal: moderateScale(8),
  },
  repeatSection: {
    marginTop: moderateScale(10),
  },
  repeatDivider: {
    height: 1,
    backgroundColor: BORDER.primary,
    marginBottom: moderateScale(10),
    marginHorizontal: moderateScale(-12),
  },
  repeatToggleRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: moderateScale(6),
  },
  repeatLabelBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: moderateScale(6),
  },
  repeatToggleLabel: {
    fontSize: responsiveFontSize(12),
    fontFamily: fonts.regular,
    color: TEXT.secondary,
  },
  repeatToggleActive: {
    color: PRIMARY.main,
  },
  repeatStepper: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: moderateScale(4),
    gap: moderateScale(4),
  },
  stepperBtn: {
    width: moderateScale(26),
    height: moderateScale(26),
    borderRadius: moderateScale(13),
    backgroundColor: `${PRIMARY.main}12`,
    alignItems: "center",
    justifyContent: "center",
  },
  repeatValuePill: {
    minWidth: moderateScale(40),
    paddingHorizontal: moderateScale(10),
    paddingVertical: moderateScale(4),
    borderRadius: moderateScale(12),
    backgroundColor: `${PRIMARY.main}15`,
    alignItems: "center",
    justifyContent: "center",
  },
  repeatValueText: {
    fontSize: responsiveFontSize(12),
    fontFamily: fonts.semibold,
    color: PRIMARY.main,
  },
});
