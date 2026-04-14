import {
  CATEGORY_TAGS,
  CategoryType,
  PRIORITY_TAGS,
  PriorityType,
} from "@/shared/constants/tags";
import {
  BACKGROUND,
  BORDER,
  CARD_PALETTES,
  MODAL,
  PRIMARY,
  SURFACE,
  TAG,
  TEXT,
} from "@/shared/theme/colors";
import { fonts } from "@/shared/theme/fonts";
import { moderateScale, responsiveFontSize } from "@/shared/utils/responsive";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

// Mock data with due dates
const MOCK_TASKS = [
  {
    id: "1",
    name: "Finish Project Report",
    category: "work" as CategoryType,
    priority: "urgent" as PriorityType,
    completed: false,
    dueDate: new Date(2026, 3, 14, 18, 0),
  },
  {
    id: "2",
    name: "Gym Workout",
    category: "health" as CategoryType,
    priority: "important" as PriorityType,
    completed: false,
    dueDate: new Date(2026, 3, 12, 7, 0),
  },
  {
    id: "3",
    name: "Buy Groceries",
    category: "personal" as CategoryType,
    priority: "normal" as PriorityType,
    completed: false,
    dueDate: new Date(2026, 3, 13, 14, 30),
  },
  {
    id: "4",
    name: "Team Meeting",
    category: "work" as CategoryType,
    priority: "urgent" as PriorityType,
    completed: false,
    dueDate: new Date(2026, 3, 12, 10, 0),
  },
  {
    id: "5",
    name: "Read Book",
    category: "growth" as CategoryType,
    priority: "low" as PriorityType,
    completed: true,
    dueDate: new Date(2026, 3, 15, 20, 0),
  },
  {
    id: "6",
    name: "Deep Work Session",
    category: "deepwork" as CategoryType,
    priority: "important" as PriorityType,
    completed: false,
    dueDate: new Date(2026, 3, 14, 9, 0),
  },
  {
    id: "7",
    name: "Client Call",
    category: "work" as CategoryType,
    priority: "urgent" as PriorityType,
    completed: false,
    dueDate: new Date(2026, 3, 12, 15, 0),
  },
  {
    id: "8",
    name: "Meditation",
    category: "health" as CategoryType,
    priority: "normal" as PriorityType,
    completed: false,
    dueDate: new Date(2026, 3, 14, 7, 0),
  },
  {
    id: "9",
    name: "Code Review",
    category: "work" as CategoryType,
    priority: "important" as PriorityType,
    completed: false,
    dueDate: new Date(2026, 3, 13, 11, 0),
  },
  {
    id: "10",
    name: "Personal Project",
    category: "personal" as CategoryType,
    priority: "low" as PriorityType,
    completed: true,
    dueDate: new Date(2026, 3, 16, 19, 0),
  },
];

interface Task {
  id: string;
  name: string;
  category: CategoryType;
  priority: PriorityType;
  completed: boolean;
  dueDate: Date;
}

const getCardColors = (index: number) => {
  return CARD_PALETTES[index % CARD_PALETTES.length];
};

const getCategoryIcon = (category: CategoryType) => {
  const iconSize = moderateScale(18);
  switch (category) {
    case "work":
      return <FontAwesome5 name="briefcase" size={iconSize} color="#ffffff" />;
    case "health":
      return (
        <MaterialCommunityIcons
          name="dumbbell"
          size={iconSize}
          color="#ffffff"
        />
      );
    case "personal":
      return (
        <MaterialCommunityIcons name="home" size={iconSize} color="#ffffff" />
      );
    case "growth":
      return (
        <MaterialCommunityIcons name="sprout" size={iconSize} color="#ffffff" />
      );
    case "deepwork":
      return (
        <MaterialCommunityIcons name="brain" size={iconSize} color="#ffffff" />
      );
    default:
      return <FontAwesome5 name="tasks" size={iconSize} color="#ffffff" />;
  }
};

const formatDueDate = (date: Date) => {
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");
  const time = `${hours}:${minutes}`;

  if (date.toDateString() === today.toDateString()) {
    return `Today ${time}`;
  } else if (date.toDateString() === tomorrow.toDateString()) {
    return `Tomorrow ${time}`;
  } else {
    const monthDay = date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
    return `${monthDay} ${time}`;
  }
};

export default function Tasks() {
  const [tasks, setTasks] = useState<Task[]>(MOCK_TASKS);
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

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Tasks</Text>
        <TouchableOpacity
          style={styles.addButton}
          activeOpacity={0.7}
          onPress={() => {
            router.push("/create/task");
          }}
        >
          <Text style={styles.addButtonIcon}>+</Text>
          <Text style={styles.addButtonText}>New Task</Text>
        </TouchableOpacity>
      </View>

      {/* Tasks List */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        bounces={true}
      >
        <Text style={styles.tipText}>Long press a task for more options</Text>
        {tasks.map((task, index) => {
          const colors = getCardColors(index);
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
                  {getCategoryIcon(task.category)}
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
                      {formatDueDate(task.dueDate)}
                    </Text>
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* Modal */}
      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{selectedTask?.name}</Text>

            <TouchableOpacity
              style={styles.modalButton}
              onPress={handleEdit}
              activeOpacity={0.7}
            >
              <MaterialCommunityIcons
                name="pencil"
                size={moderateScale(20)}
                color={PRIMARY.main}
              />
              <Text style={styles.modalButtonText}>Edit</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.modalButton}
              onPress={handleComplete}
              activeOpacity={0.7}
            >
              <MaterialCommunityIcons
                name={selectedTask?.completed ? "undo" : "check"}
                size={moderateScale(20)}
                color="#34D399"
              />
              <Text style={styles.modalButtonText}>
                {selectedTask?.completed ? "Mark Incomplete" : "Mark Complete"}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.modalButton, styles.deleteButton]}
              onPress={handleDelete}
              activeOpacity={0.7}
            >
              <MaterialCommunityIcons
                name="trash-can"
                size={moderateScale(20)}
                color="#EF4444"
              />
              <Text style={[styles.modalButtonText, styles.deleteButtonText]}>
                Delete
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.modalCancelButton}
              onPress={() => setModalVisible(false)}
              activeOpacity={0.7}
            >
              <Text style={styles.modalCancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
  addButton: {
    flexDirection: "row",
    paddingHorizontal: moderateScale(16),
    paddingVertical: moderateScale(2),
    borderRadius: moderateScale(12),
    backgroundColor: PRIMARY.main,
    justifyContent: "center",
    alignItems: "center",
    gap: moderateScale(6),
  },
  addButtonText: {
    fontSize: responsiveFontSize(12),
    fontFamily: fonts.medium,
    color: TEXT.primary,
  },
  addButtonIcon: {
    paddingTop: moderateScale(2),
    fontSize: responsiveFontSize(16),
    fontFamily: fonts.medium,
    color: TEXT.primary,
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
  /* Modal Styles */
  modalOverlay: {
    flex: 1,
    backgroundColor: MODAL.overlay,
    justifyContent: "center",
    paddingHorizontal: moderateScale(20),
  },
  modalContent: {
    backgroundColor: SURFACE.primary,
    borderRadius: moderateScale(24),
    padding: moderateScale(20),
    paddingBottom: moderateScale(15),
  },
  modalTitle: {
    fontSize: responsiveFontSize(18),
    fontFamily: fonts.bold,
    color: TEXT.primary,
    marginBottom: moderateScale(10),
    textAlign: "center",
  },
  modalButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: moderateScale(10),
    paddingVertical: moderateScale(14),
    paddingHorizontal: moderateScale(16),
    borderRadius: moderateScale(12),
    marginVertical: moderateScale(4),
    backgroundColor: BACKGROUND.secondary,
    borderWidth: 0.5,
    borderColor: BORDER.primary,
  },
  modalButtonText: {
    paddingTop: moderateScale(2),
    fontSize: responsiveFontSize(14),
    fontFamily: fonts.semibold,
    color: TEXT.primary,
    flex: 1,
  },
  deleteButton: {
    borderColor: "rgba(239, 68, 68, 0.3)",
  },
  deleteButtonText: {
    color: "#EF4444",
  },
  modalCancelButton: {
    paddingVertical: moderateScale(12),
    marginTop: moderateScale(12),
  },
  modalCancelButtonText: {
    fontSize: responsiveFontSize(14),
    fontFamily: fonts.semibold,
    color: TEXT.secondary,
    textAlign: "center",
  },
  tipText: {
    fontSize: responsiveFontSize(14),
    fontFamily: fonts.regular,
    color: PRIMARY.main,
    textAlign: "center",
  },
});
