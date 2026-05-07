import {
  formatTaskDate,
  formatTaskTime,
  isTaskCategoryType,
  isTaskPriorityType,
} from "@/features/tasks/ui/tasks.helper";
import { ActionButtons } from "@/shared/components/ActionButtons";
import { CapsuleSelector } from "@/shared/components/CapsuleSelector";
import { RemindersList } from "@/shared/components/RemindersList";
import {
  CATEGORY_TAGS,
  CategoryType,
  PRIORITY_TAGS,
  PriorityType,
} from "@/shared/constants/tags";
import {
  BACKGROUND,
  BORDER,
  PRIMARY,
  SURFACE,
  TEXT,
} from "@/shared/theme/colors";
import { fonts } from "@/shared/theme/fonts";
import { TaskData } from "@/shared/types/task";
import { useTasks } from "@/shared/hooks";
import { moderateScale, responsiveFontSize } from "@/shared/utils/responsive";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useState, useEffect } from "react";
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

export default function CreateTask() {
  const router = useRouter();
  const params = useLocalSearchParams<{
    mode?: string;
    taskId?: string;
    name?: string;
    category?: string;
    priority?: string;
    dueDate?: string;
  }>();

  const { createTask, updateTask, getTaskById } = useTasks(false);
  const [isLoading, setIsLoading] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  const isEditMode = params.mode === "edit";

  const initialCategory =
    typeof params.category === "string" && isTaskCategoryType(params.category)
      ? params.category
      : "personal";
  const initialPriority =
    typeof params.priority === "string" && isTaskPriorityType(params.priority)
      ? params.priority
      : "normal";
  const initialDueDate =
    typeof params.dueDate === "string" && params.dueDate
      ? new Date(params.dueDate)
      : null;

  // Generate unique ID if not in edit mode
  const generateTaskId = () => `task_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

  const [taskData, setTaskData] = useState<TaskData>({
    id: typeof params.taskId === "string" ? params.taskId : generateTaskId(),
    name: typeof params.name === "string" ? params.name : "",
    priority: initialPriority,
    category: initialCategory,
    customCategory: "",
    dueDate: initialDueDate,
    reminders: [
      {
        id: "1",
        time: "09:00",
        label: "reminder",
        enabled: true,
      },
    ],
  });

  const [customCategoryInput, setCustomCategoryInput] = useState("");
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [showReminderTimePicker, setShowReminderTimePicker] = useState(false);
  const [selectedReminderIndex, setSelectedReminderIndex] = useState(0);

  // Load existing task data if in edit mode
  useEffect(() => {
    if (isEditMode && typeof params.taskId === "string") {
      const loadTaskData = async () => {
        try {
          setIsLoading(true);
          const existingTask = await getTaskById(params.taskId as string);
          if (existingTask) {
            // Check if the category is a predefined one or custom
            const isPredefinedCategory = Object.keys(CATEGORY_TAGS).includes(
              existingTask.category
            );

            // If it's not a predefined category, treat it as custom
            const loadedCategory = isPredefinedCategory
              ? existingTask.category
              : ("custom" as CategoryType | "custom");

            // If it's custom, the custom category name is stored in the category field
            const loadedCustomCategoryInput = !isPredefinedCategory
              ? existingTask.category
              : "";

            setTaskData({
              id: existingTask.id,
              name: existingTask.name,
              priority: existingTask.priority,
              category: loadedCategory,
              customCategory:
                existingTask.customCategory || loadedCustomCategoryInput,
              dueDate: existingTask.dueDate,
              reminders: [
                {
                  id: "1",
                  time: "09:00",
                  label: "reminder",
                  enabled: true,
                },
              ],
            });

            // Populate customCategoryInput if it's a custom category
            if (!isPredefinedCategory) {
              setCustomCategoryInput(existingTask.category);
            }
          }
        } catch (error) {
          console.error("Failed to load task:", error);
          setSaveError("Failed to load task");
        } finally {
          setIsLoading(false);
        }
      };
      loadTaskData();
    }
  }, [isEditMode, params.taskId, getTaskById]);

  const handleDateChange = (event: any, selectedDate?: Date) => {
    if (Platform.OS === "android") {
      setShowDatePicker(false);
    }
    if (selectedDate) {
      setTaskData({ ...taskData, dueDate: selectedDate });
    }
  };

  const handleTimeChange = (event: any, selectedTime?: Date) => {
    if (Platform.OS === "android") {
      setShowTimePicker(false);
    }
    if (selectedTime && taskData.dueDate) {
      const newDate = new Date(taskData.dueDate);
      newDate.setHours(selectedTime.getHours(), selectedTime.getMinutes());
      setTaskData({ ...taskData, dueDate: newDate });
    }
  };

  const handleReminderTimeChange = (event: any, selectedTime?: Date) => {
    if (Platform.OS === "android") {
      setShowReminderTimePicker(false);
    }
    if (selectedTime && taskData.reminders) {
      const hours = String(selectedTime.getHours()).padStart(2, "0");
      const minutes = String(selectedTime.getMinutes()).padStart(2, "0");
      const timeString = `${hours}:${minutes}`;

      const updatedReminders = [...taskData.reminders];
      updatedReminders[selectedReminderIndex] = {
        ...updatedReminders[selectedReminderIndex],
        time: timeString,
      };
      setTaskData({ ...taskData, reminders: updatedReminders });
    }
  };

  const handleCreateTask = async () => {
    if (!taskData.name.trim()) {
      setSaveError("Please enter a task name");
      return;
    }

    try {
      setIsLoading(true);
      setSaveError(null);

      const finalCategory =
        taskData.category === "custom" ? customCategoryInput : taskData.category;

      const taskPayload: TaskData & { id: string } = {
        id: taskData.id || generateTaskId(),
        name: taskData.name,
        priority: taskData.priority,
        category: finalCategory as CategoryType,
        customCategory:
          taskData.category === "custom" ? customCategoryInput : "",
        dueDate: taskData.dueDate,
        reminders: taskData.reminders,
      };

      if (isEditMode) {
        await updateTask(taskPayload.id, {
          name: taskPayload.name,
          priority: taskPayload.priority,
          category: taskPayload.category,
          customCategory: taskPayload.customCategory || "",
          dueDate: taskPayload.dueDate,
        });
      } else {
        await createTask(taskPayload);
      }

      router.back();
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to save task";
      setSaveError(message);
      console.error("Error saving task:", error);
    } finally {
      setIsLoading(false);
    }
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
              {isEditMode ? "Edit Task" : "Create Task"}
            </Text>
            <View style={{ width: 28 }} />
          </View>

          {/* Task Name Input */}
          <View>
            <Text style={styles.label}>Task Name</Text>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder="Enter task name..."
                placeholderTextColor={TEXT.tertiary}
                value={taskData.name}
                onChangeText={(text) =>
                  setTaskData({ ...taskData, name: text })
                }
                maxLength={50}
              />
            </View>
            <Text style={styles.charCount}>{taskData.name.length}/50</Text>
          </View>

          {/* Priority Selection */}
          <View style={styles.section}>
            <Text style={styles.label}>Priority</Text>
            <CapsuleSelector
              items={PRIORITY_TAGS}
              selectedValue={taskData.priority}
              onSelect={(key) =>
                setTaskData({ ...taskData, priority: key as PriorityType })
              }
            />
          </View>

          {/* Category Selection */}
          <View style={styles.section}>
            <Text style={styles.label}>Category</Text>
            <CapsuleSelector
              items={CATEGORY_TAGS}
              selectedValue={taskData.category}
              onSelect={(key) =>
                setTaskData({
                  ...taskData,
                  category: key as CategoryType | "custom",
                })
              }
              showCustomOption={true}
              onCustomSelect={() =>
                setTaskData({ ...taskData, category: "custom" })
              }
            />

            {/* Custom Category Input */}
            {taskData.category === "custom" && (
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

          {/* Due Date & Time */}
          <View style={styles.section}>
            <Text style={styles.label}>Due Date & Time</Text>
            <View style={styles.dateTimeContainer}>
              <TouchableOpacity
                style={styles.dateTimeButton}
                onPress={() => setShowDatePicker(true)}
              >
                <MaterialCommunityIcons
                  name="calendar"
                  size={20}
                  color={PRIMARY.main}
                />
                <Text style={styles.dateTimeButtonText}>
                  {formatTaskDate(taskData.dueDate)}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.dateTimeButton,
                  !taskData.dueDate && styles.dateTimeButtonDisabled,
                ]}
                onPress={() => taskData.dueDate && setShowTimePicker(true)}
                disabled={!taskData.dueDate}
              >
                <MaterialCommunityIcons
                  name="clock"
                  size={20}
                  color={taskData.dueDate ? PRIMARY.main : TEXT.tertiary}
                />
                <Text
                  style={[
                    styles.dateTimeButtonText,
                    !taskData.dueDate && styles.dateTimeButtonDisabledText,
                  ]}
                >
                  {formatTaskTime(taskData.dueDate)}
                </Text>
              </TouchableOpacity>
            </View>

            {taskData.dueDate && (
              <TouchableOpacity
                onPress={() => setTaskData({ ...taskData, dueDate: null })}
                style={styles.clearDateButton}
              >
                <Text style={styles.clearDateText}>Clear date & time</Text>
              </TouchableOpacity>
            )}
          </View>

          {/* Date Picker Modal */}
          {showDatePicker && (
            <DateTimePicker
              value={taskData.dueDate || new Date()}
              mode="date"
              display="default"
              onChange={(event, selectedDate) => {
                handleDateChange(event, selectedDate);
              }}
            />
          )}

          {/* Time Picker Modal */}
          {showTimePicker && (
            <DateTimePicker
              value={taskData.dueDate || new Date()}
              mode="time"
              display="default"
              onChange={(event, selectedTime) => {
                handleTimeChange(event, selectedTime);
              }}
            />
          )}

          {/* Reminders */}
          {taskData.reminders && taskData.reminders.length > 0 && (
            <View style={styles.section}>
              <RemindersList
                reminders={taskData.reminders}
                onRemindersChange={(reminders) =>
                  setTaskData({ ...taskData, reminders })
                }
                showTimePicker={showReminderTimePicker}
                selectedReminderIndex={selectedReminderIndex}
                onShowTimePicker={(index) => {
                  setSelectedReminderIndex(index);
                  setShowReminderTimePicker(true);
                }}
                onHideTimePicker={() => setShowReminderTimePicker(false)}
                onTimeChange={handleReminderTimeChange}
              />
            </View>
          )}

          {/* Error Message */}
          {saveError && (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>{saveError}</Text>
            </View>
          )}

          {/* Action Buttons */}
          <ActionButtons
            onCancel={() => router.back()}
            onSubmit={handleCreateTask}
            submitLabel={isEditMode ? "Update Task" : "Create Task"}
            isLoading={isLoading}
          />
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
    marginBottom: moderateScale(4),
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
  },
  charCount: {
    fontSize: responsiveFontSize(11),
    fontFamily: fonts.regular,
    color: TEXT.tertiary,
    marginTop: moderateScale(6),
    alignSelf: "flex-end",
  },
  dateTimeContainer: {
    flexDirection: "row",
    gap: moderateScale(10),
    alignItems: "center",
  },
  dateTimeButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: moderateScale(10),
    paddingHorizontal: moderateScale(14),
    paddingVertical: moderateScale(12),
    backgroundColor: SURFACE.primary,
    borderRadius: moderateScale(12),
    borderWidth: 1,
    borderColor: BORDER.primary,
  },
  dateTimeButtonText: {
    fontSize: responsiveFontSize(13),
    fontFamily: fonts.medium,
    color: TEXT.primary,
    flex: 1,
  },
  dateTimeButtonDisabled: {
    opacity: 0.5,
  },
  dateTimeButtonDisabledText: {
    color: TEXT.tertiary,
  },
  dueDateSection: {
    flexDirection: "row",
    gap: moderateScale(10),
    alignItems: "center",
  },
  dueDateToggle: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: moderateScale(10),
    paddingHorizontal: moderateScale(14),
    paddingVertical: moderateScale(12),
    backgroundColor: SURFACE.primary,
    borderRadius: moderateScale(12),
    borderWidth: 1,
    borderColor: BORDER.primary,
  },
  dueDateToggleActive: {
    backgroundColor: `${PRIMARY.main}15`,
    borderColor: PRIMARY.main,
  },
  dueDateToggleText: {
    fontSize: responsiveFontSize(13),
    fontFamily: fonts.medium,
    color: TEXT.secondary,
    flex: 1,
  },
  dueDateToggleTextActive: {
    color: PRIMARY.main,
  },
  clearDateButton: {
    paddingVertical: moderateScale(8),
  },
  clearDateText: {
    fontSize: responsiveFontSize(12),
    fontFamily: fonts.medium,
    color: PRIMARY.main,
  },
  errorContainer: {
    backgroundColor: "#fee",
    borderRadius: moderateScale(12),
    borderWidth: 1,
    borderColor: "#fcc",
    paddingHorizontal: moderateScale(12),
    paddingVertical: moderateScale(10),
    marginVertical: moderateScale(12),
  },
  errorText: {
    fontSize: responsiveFontSize(12),
    fontFamily: fonts.medium,
    color: "#c33",
  },
});
