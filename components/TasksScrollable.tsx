import {
    CATEGORY_TAGS,
    CategoryType,
    PRIORITY_TAGS,
    PriorityType,
} from "@/constants/tags";
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
  },
  {
    id: "2",
    name: "Gym Workout",
    category: "health" as CategoryType,
    priority: "important" as PriorityType,
    completed: true,
  },
  {
    id: "3",
    name: "Buy Groceries",
    category: "personal" as CategoryType,
    priority: "normal" as PriorityType,
    completed: false,
  },
  {
    id: "4",
    name: "Team Meeting",
    category: "work" as CategoryType,
    priority: "urgent" as PriorityType,
    completed: false,
  },
  {
    id: "5",
    name: "Read Book",
    category: "growth" as CategoryType,
    priority: "low" as PriorityType,
    completed: true,
  },
];

interface Task {
  id: string;
  name: string;
  category: CategoryType;
  priority: PriorityType;
  completed: boolean;
}

interface CardColors {
  base: string;
  glow: string;
  accent: string;
}

const COLOR_PALETTES: CardColors[] = [
  {
    base: "#0F172A",
    glow: "#60A5FA",
    accent: "#3B82F6",
  },
  {
    base: "#1A132F",
    glow: "#A78BFA",
    accent: "#7C3AED",
  },
  {
    base: "#052E2B",
    glow: "#34D399",
    accent: "#10B981",
  },
  {
    base: "#083344",
    glow: "#22D3EE",
    accent: "#06B6D4",
  },
  {
    base: "#2A0E1E",
    glow: "#F472B6",
    accent: "#EC4899",
  },
  {
    base: "#2C1A0E",
    glow: "#FDBA74",
    accent: "#FB923C",
  },
];

const getCardColors = (index: number): CardColors => {
  return COLOR_PALETTES[index % COLOR_PALETTES.length];
};

const getCategoryIcon = (category: CategoryType) => {
  switch (category) {
    case "work":
      return (
        <FontAwesome5
          name="briefcase"
          size={18}
          color="#ffffff"
          style={styles.icon}
        />
      );
    case "health":
      return (
        <MaterialCommunityIcons
          name="dumbbell"
          size={18}
          color="#ffffff"
          style={styles.icon}
        />
      );
    case "personal":
      return (
        <MaterialCommunityIcons
          name="home"
          size={18}
          color="#ffffff"
          style={styles.icon}
        />
      );
    case "growth":
      return (
        <MaterialCommunityIcons
          name="sprout"
          size={18}
          color="#ffffff"
          style={styles.icon}
        />
      );
    case "deepwork":
      return (
        <MaterialCommunityIcons
          name="brain"
          size={18}
          color="#ffffff"
          style={styles.icon}
        />
      );
    default:
      return (
        <FontAwesome5
          name="tasks"
          size={18}
          color="#ffffff"
          style={styles.icon}
        />
      );
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
      <Text style={styles.sectionTitle}>All Tasks</Text>
      <ScrollView
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
                {/* Top row: Icon and Title */}
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
                </View>

                {/* Bottom row: Tags and Checkbox */}
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
    marginVertical: 14,
    backgroundColor: "#202020",
    paddingHorizontal: 20,
    paddingVertical: 6,
    borderRadius: 24,
    borderWidth: 0.5,
    borderColor: "#3d3d3d",
  },
  sectionTitle: {
    fontSize: 16,
    fontFamily: "Poppins-Bold", 
    color: "#ffffff",
    borderBottomColor: "#3d3d3d",
    borderBottomWidth: 0.5,
    paddingTop: 6,
    paddingBottom: 4,
    width: "100%",
    marginBottom: 8,
  },
  scrollView: {
    width: "100%",
  },
  scrollContent: {
    paddingBottom: 16,
  },
  taskCard: {
    width: "100%",
    height: 110,
    borderRadius: 16,
    overflow: "hidden",
    borderWidth: 0.5,
    padding: 16,
    justifyContent: "space-between",
    alignItems: "flex-start",
    flexDirection: "column",
    marginVertical: 8,
  },
  cardContent: {
    width: "100%",
    height: "100%",
    justifyContent: "space-between",
    alignItems: "flex-start",
    zIndex: 1,
    flexDirection: "column",
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
    flex: 1,
    width: "100%",
  },
  icon: {
    flexShrink: 0,
  },
  taskName: {
    fontSize: 13,
    fontFamily: "Poppins-SemiBold",
    color: "#ffffff",
    flex: 1,
    lineHeight: 16,
    paddingTop: 2,
  },
  taskNameCompleted: {
    color: "rgba(255, 255, 255, 0.6)",
    textDecorationLine: "line-through",
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "transparent",
  },
  checkboxCompleted: {
    backgroundColor: "#E10600",
    borderColor: "#E10600",
  },
  cardFooter: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 8,
  },
  tagsContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    flex: 1,
  },
  tag: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  priorityTag: {
    backgroundColor: "rgba(255, 255, 255, 0.15)",
  },
  categoryTag: {
    backgroundColor: "rgba(255, 255, 255, 0.15)",
  },
  tagText: {
    fontSize: 11,
    fontFamily: "Poppins-Medium",
    color: "#ffffff",
  },
});
