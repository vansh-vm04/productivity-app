import { CapsuleSelector } from "@/shared/components/CapsuleSelector";
import { EmojiPicker } from "@/shared/components/EmojiPicker";
import {
  DAYS_OF_WEEK,
  FREQUENCY_TYPES,
  HABIT_CATEGORIES,
  HABIT_EMOJIS,
  HABIT_TYPES,
} from "@/shared/constants/habits";
import { PRIORITY_TAGS, PriorityType } from "@/shared/constants/tags";
import {
  BACKGROUND,
  BORDER,
  PRIMARY,
  SURFACE,
  TEXT,
} from "@/shared/theme/colors";
import { fonts } from "@/shared/theme/fonts";
import { HabitData, Reminder } from "@/shared/types/habit";
import { moderateScale, responsiveFontSize } from "@/shared/utils/responsive";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function CreateHabit() {
  const router = useRouter();
  const params = useLocalSearchParams<{
    mode?: string;
    habitId?: string;
    name?: string;
    category?: string;
  }>();

  const isEditMode = params.mode === "edit";

  const [habitData, setHabitData] = useState<HabitData>({
    id: typeof params.habitId === "string" ? params.habitId : undefined,
    name: typeof params.name === "string" ? params.name : "",
    icon: "🎯",
    category: "health",
    priority: "normal",
    type: "binary",
    targetCount: 1,
    countUnit: "",
    targetDuration: 30,
    frequency: {
      type: "daily",
    },
    reminders: [
      {
        id: "1",
        time: "09:00",
        label: "morning",
        enabled: true,
      },
    ],
  });

  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showReminderTimePicker, setShowReminderTimePicker] = useState(false);
  const [selectedReminderIndex, setSelectedReminderIndex] = useState(0);
  const [customCategoryInput, setCustomCategoryInput] = useState("");

  const handleAddReminder = () => {
    const newReminder: Reminder = {
      id: `${habitData.reminders.length + 1}`,
      time: "09:00",
      label: "reminder",
      enabled: true,
    };
    setHabitData({
      ...habitData,
      reminders: [...habitData.reminders, newReminder],
    });
  };

  const handleRemoveReminder = (index: number) => {
    setHabitData({
      ...habitData,
      reminders: habitData.reminders.filter((_, i) => i !== index),
    });
  };

  const handleReminderTimeChange = (event: any, selectedTime?: Date) => {
    if (Platform.OS === "android") {
      setShowReminderTimePicker(false);
    }
    if (selectedTime) {
      const hours = String(selectedTime.getHours()).padStart(2, "0");
      const minutes = String(selectedTime.getMinutes()).padStart(2, "0");
      const timeString = `${hours}:${minutes}`;

      const updatedReminders = [...habitData.reminders];
      updatedReminders[selectedReminderIndex] = {
        ...updatedReminders[selectedReminderIndex],
        time: timeString,
      };
      setHabitData({ ...habitData, reminders: updatedReminders });
    }
  };

  const handleSpecificDaysToggle = (day: string) => {
    const currentDays = habitData.frequency.specificDays || [];
    const newDays = currentDays.includes(day)
      ? currentDays.filter((d) => d !== day)
      : [...currentDays, day];

    setHabitData({
      ...habitData,
      frequency: {
        ...habitData.frequency,
        specificDays: newDays,
      },
    });
  };

  const handleCreateHabit = () => {
    if (!habitData.name.trim()) {
      alert("Please enter a habit name");
      return;
    }

    console.log(isEditMode ? "Updating habit:" : "Creating habit:", {
      ...habitData,
      category:
        habitData.category === "custom"
          ? customCategoryInput
          : habitData.category,
    });

    // TODO: Save habit to database/state
    router.back();
  };

  const getReminderTime = (timeString: string): Date => {
    const [hours, minutes] = timeString.split(":").map(Number);
    const date = new Date();
    date.setHours(hours, minutes);
    return date;
  };

  return (
    <View style={styles.outerContainer}>
      <KeyboardAvoidingView
        style={styles.wrapper}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? moderateScale(60) : 0}
      >
        <ScrollView
          style={styles.container}
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity onPress={() => router.back()}>
              <MaterialCommunityIcons
                name="chevron-left"
                size={28}
                color={TEXT.primary}
              />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>
              {isEditMode ? "Edit Habit" : "Create Habit"}
            </Text>
            <View style={{ width: 28 }} />
          </View>
          {/* Habit Name Input */}
          <View>
            <Text style={styles.label}>Habit Name</Text>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder="Enter habit name..."
                placeholderTextColor={TEXT.tertiary}
                value={habitData.name}
                onChangeText={(text) =>
                  setHabitData({ ...habitData, name: text })
                }
                maxLength={50}
              />
            </View>
            <Text style={styles.charCount}>{habitData.name.length}/50</Text>
          </View>

          {/* Icon/Emoji Picker */}
          <View style={styles.section}>
            <Text style={styles.label}>Icon</Text>
            <TouchableOpacity
              style={styles.emojiPickerButton}
              onPress={() => setShowEmojiPicker(true)}
            >
              <Text style={styles.selectedEmoji}>{habitData.icon}</Text>
              <Text style={styles.emojiPickerButtonText}>
                Tap to change icon
              </Text>
              <MaterialCommunityIcons
                name="chevron-right"
                size={20}
                color={TEXT.secondary}
              />
            </TouchableOpacity>

            {/* Emoji Picker Modal */}
            <EmojiPicker
              visible={showEmojiPicker}
              emojis={HABIT_EMOJIS}
              selectedEmoji={habitData.icon}
              onSelect={(emoji) => {
                setHabitData({ ...habitData, icon: emoji });
              }}
              onClose={() => setShowEmojiPicker(false)}
              title="Choose Icon"
              numColumns={5}
            />
          </View>

          {/* Category Selection */}
          <View style={styles.section}>
            <Text style={styles.label}>Category</Text>
            <CapsuleSelector
              items={HABIT_CATEGORIES}
              selectedValue={habitData.category}
              onSelect={(key) =>
                setHabitData({
                  ...habitData,
                  category: key as typeof habitData.category,
                })
              }
              showCustomOption={true}
              onCustomSelect={() =>
                setHabitData({ ...habitData, category: "custom" })
              }
            />

            {/* Custom Category Input */}
            {habitData.category === "custom" && (
              <View
                style={[
                  styles.inputContainer,
                  { marginTop: moderateScale(12) },
                ]}
              >
                <TextInput
                  style={styles.input}
                  placeholder="Enter custom category..."
                  placeholderTextColor={TEXT.tertiary}
                  value={customCategoryInput}
                  onChangeText={setCustomCategoryInput}
                  maxLength={30}
                />
              </View>
            )}
          </View>

          {/* Priority Selection */}
          <View style={styles.section}>
            <Text style={styles.label}>Priority</Text>
            <CapsuleSelector
              items={PRIORITY_TAGS}
              selectedValue={habitData.priority}
              onSelect={(key) =>
                setHabitData({ ...habitData, priority: key as PriorityType })
              }
            />
          </View>

          {/* Habit Type Selection */}
          <View style={styles.section}>
            <Text style={styles.label}>Habit Type</Text>
            <View style={styles.typeSelectionContainer}>
              {(Object.entries(HABIT_TYPES) as [string, any][]).map(
                ([key, value]) => (
                  <TouchableOpacity
                    key={key}
                    style={[
                      styles.typeCard,
                      habitData.type === key && styles.activeTypeCard,
                    ]}
                    onPress={() =>
                      setHabitData({
                        ...habitData,
                        type: key as typeof habitData.type,
                      })
                    }
                  >
                    <Text style={styles.typeCardEmoji}>{value.emoji}</Text>
                    <View style={styles.typeCardTextContainer}>
                      <Text
                        style={[
                          styles.typeCardLabel,
                          habitData.type === key && styles.activeTypeCardLabel,
                        ]}
                      >
                        {value.label}
                      </Text>
                      <Text
                        style={[
                          styles.typeCardDescription,
                          habitData.type === key &&
                            styles.activeTypeCardDescription,
                        ]}
                      >
                        {value.description}
                      </Text>
                    </View>
                  </TouchableOpacity>
                ),
              )}
            </View>

            {/* Type-specific inputs */}
            {habitData.type === "count" && (
              <View style={styles.typeSpecificContainer}>
                <View style={styles.inputRow}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.label}>Target Count</Text>
                    <View style={styles.inputContainer}>
                      <TextInput
                        style={styles.input}
                        placeholder="e.g., 5"
                        placeholderTextColor={TEXT.tertiary}
                        value={String(habitData.targetCount || "")}
                        onChangeText={(text) =>
                          setHabitData({
                            ...habitData,
                            targetCount: parseInt(text) || 0,
                          })
                        }
                        keyboardType="number-pad"
                      />
                    </View>
                  </View>
                  <View style={{ flex: 1, marginLeft: moderateScale(12) }}>
                    <Text style={styles.label}>Unit</Text>
                    <View style={styles.inputContainer}>
                      <TextInput
                        style={styles.input}
                        placeholder="e.g., glasses"
                        placeholderTextColor={TEXT.tertiary}
                        value={habitData.countUnit || ""}
                        onChangeText={(text) =>
                          setHabitData({ ...habitData, countUnit: text })
                        }
                        maxLength={20}
                      />
                    </View>
                  </View>
                </View>
              </View>
            )}

            {habitData.type === "time" && (
              <View style={styles.typeSpecificContainer}>
                <Text style={styles.label}>Target Duration (minutes)</Text>
                <View style={styles.inputContainer}>
                  <TextInput
                    style={styles.input}
                    placeholder="e.g., 30"
                    placeholderTextColor={TEXT.tertiary}
                    value={String(habitData.targetDuration || "")}
                    onChangeText={(text) =>
                      setHabitData({
                        ...habitData,
                        targetDuration: parseInt(text) || 0,
                      })
                    }
                    keyboardType="number-pad"
                  />
                </View>
              </View>
            )}
          </View>

          {/* Frequency/Schedule */}
          <View style={styles.section}>
            <Text style={styles.label}>Frequency</Text>
            <CapsuleSelector
              items={FREQUENCY_TYPES}
              selectedValue={habitData.frequency.type}
              onSelect={(key) =>
                setHabitData({
                  ...habitData,
                  frequency: {
                    ...habitData.frequency,
                    type: key as typeof habitData.frequency.type,
                  },
                })
              }
            />

            {/* Specific Days Selection */}
            {habitData.frequency.type === "specific_days" && (
              <View style={styles.daysContainer}>
                <View style={styles.daysGrid}>
                  {DAYS_OF_WEEK.map((day) => {
                    const isSelected =
                      habitData.frequency.specificDays?.includes(day);
                    const dayAbr = day.slice(0, 3);
                    return (
                      <TouchableOpacity
                        key={day}
                        style={[
                          styles.dayButton,
                          isSelected && styles.activeDayButton,
                        ]}
                        onPress={() => handleSpecificDaysToggle(day)}
                      >
                        <Text
                          style={[
                            styles.dayButtonText,
                            isSelected && styles.activeDayButtonText,
                          ]}
                        >
                          {dayAbr}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </View>
            )}

            {habitData.frequency.type === "custom" && (
              <View style={styles.typeSpecificContainer}>
                <Text style={styles.label}>Repeat every (days)</Text>
                <View style={styles.inputContainer}>
                  <TextInput
                    style={styles.input}
                    placeholder="e.g., 2"
                    placeholderTextColor={TEXT.tertiary}
                    value={String(habitData.frequency.interval || "")}
                    onChangeText={(text) =>
                      setHabitData({
                        ...habitData,
                        frequency: {
                          ...habitData.frequency,
                          interval: parseInt(text) || 1,
                        },
                      })
                    }
                    keyboardType="number-pad"
                  />
                </View>
              </View>
            )}
          </View>

          {/* Reminder System */}
          <View style={styles.section}>
            <View style={styles.remindersHeader}>
              <Text style={styles.label}>Reminders</Text>
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

            {habitData.reminders.map((reminder, index) => (
              <View key={reminder.id} style={styles.reminderItem}>
                <TouchableOpacity
                  style={styles.reminderTimeButton}
                  onPress={() => {
                    setSelectedReminderIndex(index);
                    setShowReminderTimePicker(true);
                  }}
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
                  onChangeText={(text) => {
                    const updatedReminders = [...habitData.reminders];
                    updatedReminders[index] = {
                      ...updatedReminders[index],
                      label: text,
                    };
                    setHabitData({ ...habitData, reminders: updatedReminders });
                  }}
                  maxLength={20}
                />

                <TouchableOpacity
                  style={styles.reminderToggle}
                  onPress={() => {
                    const updatedReminders = [...habitData.reminders];
                    updatedReminders[index] = {
                      ...updatedReminders[index],
                      enabled: !updatedReminders[index].enabled,
                    };
                    setHabitData({ ...habitData, reminders: updatedReminders });
                  }}
                >
                  <MaterialCommunityIcons
                    name={
                      reminder.enabled ? "toggle-switch" : "toggle-switch-off"
                    }
                    size={24}
                    color={reminder.enabled ? PRIMARY.main : TEXT.tertiary}
                  />
                </TouchableOpacity>

                {habitData.reminders.length > 1 && (
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
          </View>

          {/* Time Picker Modal for Reminders */}
          {showReminderTimePicker && (
            <DateTimePicker
              value={getReminderTime(
                habitData.reminders[selectedReminderIndex]?.time || "09:00",
              )}
              mode="time"
              display="default"
              onValueChange={handleReminderTimeChange}
              onDismiss={() => setShowReminderTimePicker(false)}
            />
          )}

          {/* Action Buttons */}
          <View style={styles.buttonsContainer}>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => router.back()}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.createButton}
              onPress={handleCreateHabit}
            >
              <Text style={styles.createButtonText}>
                {isEditMode ? "Update Habit" : "Create Habit"}
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  outerContainer: {
    flex: 1,
    backgroundColor: BACKGROUND.secondary,
  },
  wrapper: {
    flex: 1,
  },
  container: {
    flex: 1,
    backgroundColor: BACKGROUND.secondary,
    paddingHorizontal: moderateScale(16),
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: moderateScale(16),
    paddingTop: moderateScale(50),
    marginBottom: moderateScale(16),
  },
  headerTitle: {
    fontSize: responsiveFontSize(18),
    fontFamily: fonts.semibold,
    color: TEXT.primary,
  },
  section: {
    marginVertical: moderateScale(16),
  },
  label: {
    fontSize: responsiveFontSize(14),
    fontFamily: fonts.medium,
    color: TEXT.primary,
    marginBottom: moderateScale(8),
  },
  inputContainer: {
    backgroundColor: SURFACE.primary,
    borderRadius: moderateScale(12),
    borderWidth: 1,
    borderColor: BORDER.primary,
    paddingHorizontal: moderateScale(14),
    paddingVertical: moderateScale(4),
  },
  input: {
    fontSize: responsiveFontSize(14),
    fontFamily: fonts.regular,
    color: TEXT.primary,
    paddingVertical: moderateScale(12),
  },
  charCount: {
    fontSize: responsiveFontSize(11),
    fontFamily: fonts.regular,
    color: TEXT.tertiary,
    marginTop: moderateScale(6),
    alignSelf: "flex-end",
  },
  emojiPickerButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: moderateScale(12),
    paddingHorizontal: moderateScale(14),
    paddingVertical: moderateScale(12),
    backgroundColor: SURFACE.primary,
    borderRadius: moderateScale(12),
    borderWidth: 1,
    borderColor: BORDER.primary,
  },
  selectedEmoji: {
    fontSize: responsiveFontSize(28),
  },
  emojiPickerButtonText: {
    flex: 1,
    fontSize: responsiveFontSize(13),
    fontFamily: fonts.medium,
    color: TEXT.secondary,
  },
  typeSelectionContainer: {
    flexDirection: "column",
    gap: moderateScale(12),
  },
  typeCard: {
    flex: 1,
    paddingHorizontal: moderateScale(12),
    paddingVertical: moderateScale(12),
    borderRadius: moderateScale(12),
    backgroundColor: SURFACE.primary,
    borderWidth: 1,
    borderColor: BORDER.primary,
    alignItems: "center",
    flexDirection: "row",
    gap: moderateScale(12),
  },
  typeCardTextContainer: {
    alignItems: "flex-start",
  },
  activeTypeCard: {
    backgroundColor: `${PRIMARY.main}15`,
    borderColor: PRIMARY.main,
  },
  typeCardEmoji: {
    fontSize: responsiveFontSize(24),
  },
  typeCardLabel: {
    fontSize: responsiveFontSize(13),
    fontFamily: fonts.semibold,
    color: TEXT.primary,
    lineHeight: moderateScale(24),
  },
  activeTypeCardLabel: {
    color: PRIMARY.main,
  },
  typeCardDescription: {
    fontSize: responsiveFontSize(10),
    fontFamily: fonts.regular,
    color: TEXT.tertiary,
  },
  activeTypeCardDescription: {
    color: PRIMARY.main,
  },
  typeSpecificContainer: {
    marginTop: moderateScale(12),
    padding: moderateScale(12),
    backgroundColor: `${PRIMARY.main}08`,
    borderRadius: moderateScale(12),
    borderWidth: 1,
    borderColor: `${PRIMARY.main}25`,
  },
  inputRow: {
    flexDirection: "row",
    gap: moderateScale(12),
  },
  daysContainer: {
    marginTop: moderateScale(12),
  },
  daysGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: moderateScale(8),
  },
  dayButton: {
    width: "13%",
    aspectRatio: 1,
    borderRadius: moderateScale(8),
    backgroundColor: SURFACE.primary,
    borderWidth: 1,
    borderColor: BORDER.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  activeDayButton: {
    backgroundColor: PRIMARY.main,
    borderColor: PRIMARY.main,
  },
  dayButtonText: {
    fontSize: responsiveFontSize(11),
    fontFamily: fonts.medium,
    color: TEXT.primary,
  },
  activeDayButtonText: {
    color: TEXT.primary,
  },
  remindersHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: moderateScale(12),
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
  buttonsContainer: {
    flexDirection: "row",
    gap: moderateScale(12),
    marginBottom: moderateScale(80),
    marginTop: moderateScale(20),
    height: moderateScale(44),
  },
  cancelButton: {
    flex: 1,
    borderRadius: moderateScale(12),
    backgroundColor: SURFACE.primary,
    borderWidth: 1,
    borderColor: BORDER.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  cancelButtonText: {
    fontSize: responsiveFontSize(14),
    fontFamily: fonts.semibold,
    color: TEXT.secondary,
  },
  createButton: {
    flex: 1,
    borderRadius: moderateScale(12),
    backgroundColor: PRIMARY.main,
    alignItems: "center",
    justifyContent: "center",
  },
  createButtonText: {
    fontSize: responsiveFontSize(14),
    fontFamily: fonts.semibold,
    color: TEXT.primary,
  },
});
