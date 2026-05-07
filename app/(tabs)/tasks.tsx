import { TASKS_MOCKS } from "@/features/tasks/mocks/tasks.mocks";
import ActionModal, { ActionModalItem } from "@/shared/components/ActionModal";
import { AddButton } from "@/shared/components/AddButton";
import { TaskCard } from "@/shared/components/TaskCard";
import { useTasks } from "@/shared/hooks";
import { PRIMARY, TEXT, SCREEN } from "@/shared/theme/colors";
import { fonts } from "@/shared/theme/fonts";
import { Task } from "@/shared/types/task";
import { moderateScale, responsiveFontSize } from "@/shared/utils/responsive";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter, useFocusEffect } from "expo-router";
import { useState, useCallback } from "react";
import { ScrollView, StyleSheet, Text, View, ActivityIndicator } from "react-native";

export default function Tasks() {
  const {
    tasks,
    loading,
    error,
    refetch,
    toggleTaskCompletion,
    deleteTask,
  } = useTasks(true);

  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const router = useRouter();

  // Refetch tasks when screen is focused
  useFocusEffect(
    useCallback(() => {
      refetch();
    }, [refetch])
  );

  const handleToggleTask = useCallback(
    async (id: string) => {
      await toggleTaskCompletion(id);
    },
    [toggleTaskCompletion]
  );

  const handleLongPress = (task: Task) => {
    setSelectedTask(task);
    setModalVisible(true);
  };

  const handleComplete = useCallback(async () => {
    if (selectedTask) {
      await handleToggleTask(selectedTask.id);
    }
    setModalVisible(false);
  }, [selectedTask, handleToggleTask]);

  const handleDelete = useCallback(async () => {
    if (selectedTask) {
      await deleteTask(selectedTask.id);
    }
    setModalVisible(false);
  }, [selectedTask, deleteTask]);

  const handleEdit = useCallback(() => {
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
        dueDate: selectedTask.dueDate?.toISOString() || "",
      },
    });
  }, [selectedTask, router]);

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
    <LinearGradient
      colors={[SCREEN.gradientStart, SCREEN.gradientEnd]}
      start={{ x: 0.5, y: 0 }}
      end={{ x: 0.5, y: 1 }}
      style={styles.gradientBackground}
    >
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
          {tasks.map((task, index) => (
            <TaskCard
              key={task.id}
              task={task}
              index={index}
              onPress={() => handleToggleTask(task.id)}
              onLongPress={() => handleLongPress(task)}
            />
          ))}
        </ScrollView>

        <ActionModal
          visible={modalVisible}
          title={selectedTask?.name ?? "Task"}
          actions={taskActions}
          onClose={() => setModalVisible(false)}
        />
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradientBackground: {
    flex: 1,
  },
  container: {
    flex: 1,
    backgroundColor: "transparent",
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
  tipText: {
    fontSize: responsiveFontSize(14),
    fontFamily: fonts.regular,
    color: PRIMARY.main,
    textAlign: "center",
  },
  centerContent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    minHeight: 300,
  },
  loadingText: {
    fontSize: responsiveFontSize(14),
    fontFamily: fonts.regular,
    color: TEXT.primary,
    marginTop: moderateScale(12),
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
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    minHeight: 300,
  },
  emptyStateText: {
    fontSize: responsiveFontSize(18),
    fontFamily: fonts.semibold,
    color: TEXT.primary,
  },
  emptyStateSubtext: {
    fontSize: responsiveFontSize(14),
    fontFamily: fonts.regular,
    color: TEXT.tertiary,
    marginTop: moderateScale(8),
  },
});
