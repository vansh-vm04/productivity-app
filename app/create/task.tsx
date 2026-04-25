import {
  formatTaskDate,
  formatTaskTime,
  isTaskCategoryType,
  isTaskPriorityType,
} from "@/features/tasks/ui/tasks.helper";
import { CapsuleSelector } from "@/shared/components/CapsuleSelector";
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
import { moderateScale, responsiveFontSize } from "@/shared/utils/responsive";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useState } from "react";
import {
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

  const [taskData, setTaskData] = useState<TaskData>({
    id: typeof params.taskId === "string" ? params.taskId : undefined,
    name: typeof params.name === "string" ? params.name : "",
    priority: initialPriority,
    category: initialCategory,
    customCategory: "",
    dueDate: initialDueDate,
  });

  const [customCategoryInput, setCustomCategoryInput] = useState("");
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);

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

  const handleCreateTask = () => {
    if (!taskData.name.trim()) {
      alert("Please enter a task name");
      return;
    }

    console.log(isEditMode ? "Updating task:" : "Creating task:", {
      ...taskData,
      category:
        taskData.category === "custom"
          ? customCategoryInput
          : taskData.category,
    });

    // TODO: Save task to database/state
    router.back();
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
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
            onChangeText={(text) => setTaskData({ ...taskData, name: text })}
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
            style={[styles.inputContainer, { marginTop: moderateScale(12) }]}
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
          onValueChange={handleDateChange}
          onDismiss={() => setShowDatePicker(false)}
        />
      )}

      {/* Time Picker Modal */}
      {showTimePicker && (
        <DateTimePicker
          value={taskData.dueDate || new Date()}
          mode="time"
          display="default"
          onValueChange={handleTimeChange}
          onDismiss={() => setShowTimePicker(false)}
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
          onPress={handleCreateTask}
        >
          <Text style={styles.createButtonText}>
            {isEditMode ? "Update Task" : "Create Task"}
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
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
  buttonsContainer: {
    flexDirection: "row",
    gap: moderateScale(12),
    marginBottom: moderateScale(40),
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
