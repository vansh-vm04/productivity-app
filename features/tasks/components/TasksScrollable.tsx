import { TODAY_TASKS_MOCKS } from "@/features/tasks/mocks/tasks.mocks";
import { TaskCard } from "@/shared/components/TaskCard";
import { BORDER, SURFACE, TEXT } from "@/shared/theme/colors";
import { fonts } from "@/shared/theme/fonts";
import { Task } from "@/shared/types/task";
import { moderateScale, responsiveFontSize } from "@/shared/utils/responsive";
import React, { useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";

export default function TasksScrollable() {
  const [tasks, setTasks] = useState<Task[]>(TODAY_TASKS_MOCKS);

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
        {tasks.map((task, index) => (
          <TaskCard
            key={task.id}
            task={task}
            index={index}
            onPress={() => toggleTask(task.id)}
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
    marginVertical: moderateScale(10),
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
});
