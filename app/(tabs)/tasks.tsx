import { TASKS_MOCKS } from "@/features/tasks/mocks/tasks.mocks";
import ActionModal, { ActionModalItem } from "@/shared/components/ActionModal";
import { AddButton } from "@/shared/components/AddButton";
import { TaskCard } from "@/shared/components/TaskCard";
import { PRIMARY, TEXT, SCREEN } from "@/shared/theme/colors";
import { fonts } from "@/shared/theme/fonts";
import { Task } from "@/shared/types/task";
import { moderateScale, responsiveFontSize } from "@/shared/utils/responsive";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";

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
              onPress={() => toggleTask(task.id)}
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
});
