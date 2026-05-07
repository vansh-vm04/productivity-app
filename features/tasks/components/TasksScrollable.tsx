import { TaskCard } from "@/shared/components/TaskCard";
import { useTasks } from "@/shared/hooks";
import { BORDER, SURFACE, TEXT } from "@/shared/theme/colors";
import { fonts } from "@/shared/theme/fonts";
import { Task } from "@/shared/types/task";
import { moderateScale, responsiveFontSize } from "@/shared/utils/responsive";
import { useFocusEffect } from "expo-router";
import React, { useState, useEffect, useCallback } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";

export default function TasksScrollable() {
  const { getTasksDueToday, toggleTaskCompletion } = useTasks(false);
  const [tasks, setTasks] = useState<Task[]>([]);

  // Load today's tasks
  const loadTodaysTasks = useCallback(async () => {
    try {
      const todaysTasks = await getTasksDueToday();
      setTasks(todaysTasks);
    } catch (err) {
      console.error("Failed to load today's tasks:", err);
    }
  }, [getTasksDueToday]);

  // Load on mount
  useEffect(() => {
    loadTodaysTasks();
  }, [loadTodaysTasks]);

  // Reload when page/tab comes into focus
  useFocusEffect(
    useCallback(() => {
      loadTodaysTasks();
    }, [loadTodaysTasks])
  );

  const handleToggleTask = useCallback(
    async (id: string) => {
      await toggleTaskCompletion(id);
      // Refetch today's tasks
      await loadTodaysTasks();
    },
    [toggleTaskCompletion, loadTodaysTasks]
  );

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
        {tasks.map((task, index) => (
          <TaskCard
            key={task.id}
            task={task}
            index={index}
            onPress={() => handleToggleTask(task.id)}
            onLongPress={() => {
              // TODO: Handle long press if needed
            }}
            dueIconSize={moderateScale(12)}
            categoryIconStyle={styles.icon}
          />
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    marginBottom: moderateScale(10),
    backgroundColor: SURFACE.primary,
    paddingHorizontal: moderateScale(2),
    paddingVertical: moderateScale(6),
    borderRadius: moderateScale(24),
    borderWidth: 0.5,
    borderColor: BORDER.primary,
    shadowColor: "#00000074",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    flexDirection: "column",
    alignItems: "center",
    minHeight: moderateScale(400),
  },
  sectionTitle: {
    fontSize: responsiveFontSize(16),
    fontFamily: fonts.bold,
    color: TEXT.primary,
    borderBottomColor: BORDER.primary,
    borderBottomWidth: 0.5,
    paddingTop: moderateScale(6),
    paddingBottom: moderateScale(4),
    width: "92%",
    marginBottom: moderateScale(8),
    paddingHorizontal: moderateScale(6),
  },
  scrollView: {
    width: "100%",
    maxHeight: moderateScale(650),
    paddingHorizontal: moderateScale(10),
  },
  scrollContent: {
    paddingBottom: moderateScale(16),
  },
  icon: {
    flexShrink: 0,
  },
  centerContent: {
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: moderateScale(24),
  },
  loadingText: {
    fontSize: responsiveFontSize(12),
    fontFamily: fonts.regular,
    color: TEXT.tertiary,
    marginTop: moderateScale(8),
  },
  errorContainer: {
    width: "100%",
    backgroundColor: "#fee",
    borderRadius: moderateScale(12),
    borderWidth: 1,
    borderColor: "#fcc",
    paddingHorizontal: moderateScale(12),
    paddingVertical: moderateScale(10),
    marginVertical: moderateScale(8),
  },
  errorText: {
    fontSize: responsiveFontSize(12),
    fontFamily: fonts.medium,
    color: "#c33",
  },
  emptyContainer: {
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: moderateScale(24),
  },
  emptyText: {
    fontSize: responsiveFontSize(14),
    fontFamily: fonts.regular,
    color: TEXT.tertiary,
  },
});
