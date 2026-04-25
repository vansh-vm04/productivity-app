import {
    BORDER,
    PRIMARY,
    SURFACE,
    TEXT
} from "@/shared/theme/colors";
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
    View
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
    const handleAddReminder = () => {
      const newReminder: Reminder = {
        id: `${reminders.length + 1}`,
        time: "09:00",
        label: "reminder",
        enabled: true,
      };
      onRemindersChange([...reminders, newReminder]);
    };

    const handleRemoveReminder = (index: number) => {
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
          >
            <MaterialCommunityIcons
              name="plus"
              size={18}
              color={PRIMARY.main}
            />
            <Text style={styles.addReminderButtonText}>Add</Text>
          </TouchableOpacity>
        </View>

        {reminders.map((reminder, index) => (
          <View key={index} style={styles.reminderItem}>
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
                name={reminder.enabled ? "toggle-switch" : "toggle-switch-off"}
                size={36}
                color={reminder.enabled ? PRIMARY.main : TEXT.tertiary}
              />
            </TouchableOpacity>

            {reminders.length > 1 && (
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
            )}
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
            onValueChange={onTimeChange}
            onDismiss={onHideTimePicker}
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
    gap: moderateScale(4),
    paddingHorizontal: moderateScale(12),
    paddingVertical: moderateScale(6),
    borderRadius: moderateScale(8),
    backgroundColor: `${PRIMARY.main}15`,
  },
  addReminderButtonText: {
    fontSize: responsiveFontSize(12),
    fontFamily: fonts.medium,
    color: PRIMARY.main,
  },
  reminderItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: moderateScale(10),
    paddingHorizontal: moderateScale(12),
    paddingVertical: moderateScale(12),
    marginBottom: moderateScale(10),
    backgroundColor: SURFACE.primary,
    borderRadius: moderateScale(12),
    borderWidth: 1,
    borderColor: BORDER.primary,
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
});
