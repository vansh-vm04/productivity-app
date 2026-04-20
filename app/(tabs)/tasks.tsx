import { TASKS_MOCKS } from "@/features/tasks/mocks/tasks.mocks";
import {
  formatTaskDueDate,
  getTaskCardColors,
  getTaskCategoryIcon,
} from "@/features/tasks/ui/tasks.helper";
import ActionModal, { ActionModalItem } from "@/shared/components/ActionModal";
import { AddButton } from "@/shared/components/AddButton";
import { CATEGORY_TAGS, PRIORITY_TAGS } from "@/shared/constants/tags";
import { BACKGROUND, PRIMARY, TAG, TEXT } from "@/shared/theme/colors";
import { fonts } from "@/shared/theme/fonts";
import { Task } from "@/shared/types/task";
import { moderateScale, responsiveFontSize } from "@/shared/utils/responsive";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function Tasks() {
  const [tasks, setTasks] = useState<Task[]>(TASKS_MOCKS);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const router = useRouter();

  const toggleTask = (id: string) => {
    setTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task,
      ),
    );
  };

  const handleLongPress = (task: Task) => {
    setSelectedTask(task);
    setModalVisible(true);
  };

  const handleComplete = () => {
    if (selectedTask) {
      toggleTask(selectedTask.id);
    }
    setModalVisible(false);
  };

  const handleDelete = () => {
    if (selectedTask) {
      setTasks(tasks.filter((task) => task.id !== selectedTask.id));
    }
    setModalVisible(false);
  };

  const handleEdit = () => {
    if (!selectedTask) return;

    setModalVisible(false);
    router.push({
      pathname: "/create/task",
      params: {
        mode: "edit",
        taskId: selectedTask.id,
        name: selectedTask.name,
        category: selectedTask.category,
        priority: selectedTask.priority,
        dueDate: selectedTask.dueDate.toISOString(),
      },
    });
  };

  const taskActions: ActionModalItem[] = [
    {
      key: "edit",
      label: "Edit",
      icon: "pencil" as const,
      iconColor: PRIMARY.main,
      onPress: handleEdit,
    },
    {
      key: "complete",
      label: selectedTask?.completed ? "Mark Incomplete" : "Mark Complete",
      icon: selectedTask?.completed ? "undo" : "check",
      iconColor: "#34D399",
      onPress: handleComplete,
    },
    {
      key: "delete",
      label: "Delete",
      icon: "trash-can" as const,
      iconColor: "#EF4444",
      danger: true,
      onPress: handleDelete,
    },
  ];

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Tasks</Text>
        <AddButton
          label="New Task"
          onPress={() => router.push("/create/task")}
        />
      </View>

      {/* Tasks List */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        bounces={true}
      >
        <Text style={styles.tipText}>Long press a task for more options</Text>
        {tasks.map((task, index) => {
          const colors = getTaskCardColors(index);
          return (
            <TouchableOpacity
              key={task.id}
              onPress={() => toggleTask(task.id)}
              onLongPress={() => handleLongPress(task)}
              delayLongPress={300}
              style={[
                styles.taskCard,
                {
                  backgroundColor: colors.base,
                  borderColor: colors.glow,
                },
              ]}
              activeOpacity={0.8}
            >
              {/* Card content */}
              <View style={styles.cardContent}>
                {/* Top row: Icon, Title, and Checkbox */}
                <View style={styles.cardHeader}>
                  {getTaskCategoryIcon(task.category)}
                  <Text
                    style={[
                      styles.taskName,
                      task.completed && styles.taskNameCompleted,
                    ]}
                    numberOfLines={1}
                  >
                    {task.name}
                  </Text>
                  {/* Checkbox */}
                  <View
                    style={[
                      styles.checkbox,
                      task.completed && {
                        backgroundColor: colors.glow,
                        borderColor: colors.glow,
                      },
                      !task.completed && {
                        borderColor: colors.glow,
                      },
                    ]}
                  >
                    {task.completed && (
                      <FontAwesome5
                        name="check"
                        size={14}
                        color="#ffffff"
                        style={{ fontWeight: "bold" }}
                      />
                    )}
                  </View>
                </View>

                {/* Bottom row: Tags and Due Date */}
                <View style={styles.cardFooter}>
                  {/* Tags Container */}
                  <View style={styles.tagsContainer}>
                    {/* Priority Tag */}
                    <View style={[styles.tag, styles.priorityTag]}>
                      <Text style={styles.tagText}>
                        {PRIORITY_TAGS[task.priority].label}
                      </Text>
                    </View>

                    {/* Category Tag */}
                    <View style={[styles.tag, styles.categoryTag]}>
                      <Text style={styles.tagText}>
                        {CATEGORY_TAGS[task.category].label}
                      </Text>
                    </View>
                  </View>

                  {/* Due Date */}
                  <View style={styles.dueDateInline}>
                    <MaterialCommunityIcons
                      name="clock-outline"
                      size={moderateScale(14)}
                      color={TEXT.secondary}
                    />
                    <Text style={styles.dueDateText}>
                      {formatTaskDueDate(task.dueDate)}
                    </Text>
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      <ActionModal
        visible={modalVisible}
        title={selectedTask?.name ?? "Task"}
        actions={taskActions}
        onClose={() => setModalVisible(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BACKGROUND.secondary,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    paddingHorizontal: moderateScale(16),
    paddingVertical: moderateScale(10),
    borderBottomWidth: 0.5,
    borderBottomColor: "#000000",
    paddingTop: moderateScale(50),
  },
  headerTitle: {
    fontSize: responsiveFontSize(24),
    fontFamily: fonts.regular,
    color: TEXT.primary,
    lineHeight: moderateScale(32),
  },

  scrollContent: {
    paddingHorizontal: moderateScale(16),
    paddingVertical: moderateScale(10),
    paddingBottom: moderateScale(40),
  },
  taskCard: {
    width: "100%",
    height: moderateScale(110),
    borderRadius: moderateScale(16),
    overflow: "hidden",
    borderWidth: 0.5,
    padding: moderateScale(16),
    justifyContent: "space-between",
    alignItems: "flex-start",
    flexDirection: "column",
    marginVertical: moderateScale(6),
  },
  cardContent: {
    width: "100%",
    justifyContent: "space-between",
    alignItems: "flex-start",
    zIndex: 1,
    flexDirection: "column",
    gap: moderateScale(30),
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: moderateScale(10),
    width: "100%",
    justifyContent: "space-between",
  },
  taskName: {
    fontSize: responsiveFontSize(13),
    fontFamily: fonts.semibold,
    color: TEXT.primary,
    flex: 1,
    lineHeight: moderateScale(16),
    paddingTop: moderateScale(2),
  },
  taskNameCompleted: {
    color: TEXT.tertiary,
    textDecorationLine: "line-through",
  },
  dueDateInline: {
    flexDirection: "row",
    alignItems: "center",
    gap: moderateScale(4),
  },
  dueDateText: {
    fontSize: responsiveFontSize(11),
    fontFamily: fonts.medium,
    color: TEXT.secondary,
    paddingTop: moderateScale(2),
  },
  cardFooter: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: moderateScale(8),
  },
  tagsContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: moderateScale(6),
    flex: 1,
  },
  tag: {
    paddingHorizontal: moderateScale(10),
    paddingVertical: moderateScale(3),
    borderRadius: moderateScale(12),
    alignItems: "center",
    justifyContent: "center",
  },
  priorityTag: {
    backgroundColor: TAG.background,
  },
  categoryTag: {
    backgroundColor: TAG.background,
  },
  tagText: {
    fontSize: responsiveFontSize(11),
    fontFamily: fonts.medium,
    color: TAG.text,
  },
  checkbox: {
    width: moderateScale(24),
    height: moderateScale(24),
    borderRadius: moderateScale(6),
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "transparent",
  },
  tipText: {
    fontSize: responsiveFontSize(14),
    fontFamily: fonts.regular,
    color: PRIMARY.main,
    textAlign: "center",
  },
});
