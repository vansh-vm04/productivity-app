import {
    CATEGORY_TAGS,
    CategoryType,
    PRIORITY_TAGS,
    PriorityType,
} from "@/constants/tags";
import {
    BORDER,
    CARD_PALETTES,
    PRIMARY,
    SURFACE,
    TAG,
    TEXT,
} from "@/theme/colors";
import { fonts } from "@/theme/fonts";
import { moderateScale, responsiveFontSize } from "@/utils/responsive";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import React, { useState } from "react";
import {
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

// Mock data - replace with actual data source
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
    completed: true,
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
      return (
        <FontAwesome5
          name="briefcase"
          size={iconSize}
          color="#ffffff"
          style={styles.icon}
        />
      );
    case "health":
      return (
        <MaterialCommunityIcons
          name="dumbbell"
          size={iconSize}
          color="#ffffff"
          style={styles.icon}
        />
      );
    case "personal":
      return (
        <MaterialCommunityIcons
          name="home"
          size={iconSize}
          color="#ffffff"
          style={styles.icon}
        />
      );
    case "growth":
      return (
        <MaterialCommunityIcons
          name="sprout"
          size={iconSize}
          color="#ffffff"
          style={styles.icon}
        />
      );
    case "deepwork":
      return (
        <MaterialCommunityIcons
          name="brain"
          size={iconSize}
          color="#ffffff"
          style={styles.icon}
        />
      );
    default:
      return (
        <FontAwesome5
          name="tasks"
          size={iconSize}
          color="#ffffff"
          style={styles.icon}
        />
      );
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

export default function TasksScrollable() {
  const [tasks, setTasks] = useState<Task[]>(MOCK_TASKS);

  const toggleTask = (id: string) => {
    setTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task,
      ),
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>{"Today's Tasks"}</Text>
      <ScrollView
        nestedScrollEnabled={true}
        alwaysBounceVertical
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        style={styles.scrollView}
        scrollEventThrottle={16}
      >
        {tasks.map((task, index) => {
          const colors = getCardColors(index);
          return (
            <TouchableOpacity
              key={task.id}
              onPress={() => toggleTask(task.id)}
              onLongPress={() => {
                // TODO: Handle long press if needed
              }}
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
                      size={moderateScale(12)}
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    marginVertical: moderateScale(14),
    backgroundColor: SURFACE.primary,
    paddingHorizontal: moderateScale(12),
    paddingVertical: moderateScale(6),
    borderRadius: moderateScale(24),
    borderWidth: 0.5,
    borderColor: BORDER.primary,
  },
  sectionTitle: {
    fontSize: responsiveFontSize(16),
    fontFamily: fonts.bold,
    color: TEXT.primary,
    borderBottomColor: BORDER.primary,
    borderBottomWidth: 0.5,
    paddingTop: moderateScale(6),
    paddingBottom: moderateScale(4),
    width: "100%",
    marginBottom: moderateScale(8),
    paddingHorizontal: moderateScale(8),
  },
  scrollView: {
    width: "100%",
    maxHeight: moderateScale(650),
  },
  scrollContent: {
    paddingBottom: moderateScale(16),
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
  icon: {
    flexShrink: 0,
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
  checkbox: {
    width: moderateScale(24),
    height: moderateScale(24),
    borderRadius: moderateScale(6),
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "transparent",
  },
  checkboxCompleted: {
    backgroundColor: PRIMARY.main,
    borderColor: PRIMARY.main,
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
});
