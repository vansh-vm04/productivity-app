import { BORDER, PRIMARY, SURFACE, TEXT, PROGRESS } from "@/shared/theme/colors";
import { moderateScale, responsiveFontSize } from "@/shared/utils/responsive";
import { useTasks } from "@/features/tasks/hooks/useTasks";
import { useHabits } from "@/features/habits/hooks/useHabits";
import React, { useEffect, useRef, useState } from "react";
import { Animated, Easing, StyleSheet, Text, View, ActivityIndicator } from "react-native";
import { AnimatedCircularProgress } from "react-native-circular-progress";
import EmptyStateCard from "./EmptyStateCard";

type ProgressType = "tasks" | "habits" | "empty";

interface ProgressData {
  completed: number;
  total: number;
  type: ProgressType;
  label: string;
}

export default function TodayProgress() {
  const { getTasksDueToday } = useTasks(true);
  const { habits } = useHabits(true);
  const [progressData, setProgressData] = useState<ProgressData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const animatedValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const fetchProgressData = async () => {
      try {
        setIsLoading(true);

        // Get tasks due today
        const tasksDueToday = await getTasksDueToday();
        const completedTasks = tasksDueToday.filter((task) => task.completed).length;

        // If we have tasks, show task progress
        if (tasksDueToday.length > 0) {
          setProgressData({
            completed: completedTasks,
            total: tasksDueToday.length,
            type: "tasks",
            label: "tasks",
          });
        } else if (habits.length > 0) {
          // If no tasks, check habits for today
          // Habits are already filtered for today by their frequency
          // We count habits that have completed: true (which means they have completion for today)
          const completedHabits = habits.filter((habit) => habit.completed).length;
          setProgressData({
            completed: completedHabits,
            total: habits.length,
            type: "habits",
            label: "habits",
          });
        } else {
          // No tasks and no habits
          setProgressData({
            completed: 0,
            total: 0,
            type: "empty",
            label: "empty",
          });
        }
      } catch (error) {
        console.error("Error fetching progress data:", error);
        setProgressData({
          completed: 0,
          total: 0,
          type: "empty",
          label: "empty",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchProgressData();
  }, [getTasksDueToday, habits]);

  useEffect(() => {
    if (progressData && progressData.total > 0) {
      const progress = Math.round((progressData.completed / progressData.total) * 100);
      Animated.timing(animatedValue, {
        toValue: progress,
        duration: 900,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: false,
      }).start();
    }
  }, [progressData, animatedValue]);

  const getProgressMessage = () => {
    if (!progressData) return "Loading...";

    const progress = Math.round((progressData.completed / progressData.total) * 100);

    if (progress === 0) return "Let's start your day 🚀";
    if (progress < 50) return "Nice start. Keep going 🔥";
    if (progress < 100) return `🔥 You're ${progress}% there. Keep the momentum!`;
    return "You crushed today 👏";
  };

  if (isLoading) {
    return (
      <View style={styles.card}>
        <Text style={styles.cardTitle}>{"Today's Progress"}</Text>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={PRIMARY.main} />
        </View>
      </View>
    );
  }

  if (!progressData || progressData.type === "empty") {
    return <EmptyStateCard />;
  }

  const progress = Math.round((progressData.completed / progressData.total) * 100);

  return (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>{"Today's Progress"}</Text>
      <View style={styles.progressContainer}>
        <AnimatedCircularProgress
          size={moderateScale(180)}
          width={moderateScale(12)}
          fill={progress}
          tintColor={PRIMARY.main}
          backgroundColor={PROGRESS.background}
          arcSweepAngle={180}
          rotation={270}
          lineCap="round"
        >
          {() => (
            <View style={styles.centerContent}>
              <Text style={styles.percentText}>{progress}%</Text>
              <Text style={styles.subText}>
                {progressData.completed} of {progressData.total} {progressData.label}
              </Text>
            </View>
          )}
        </AnimatedCircularProgress>

        <Text style={styles.message}>{getProgressMessage()}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: moderateScale(24),
    paddingHorizontal: moderateScale(12),
    paddingVertical: moderateScale(6),
    alignItems: "flex-start",
    width: "100%",
    marginVertical: moderateScale(12),
    backgroundColor: SURFACE.primary,
    borderWidth: 0.5,
    borderColor: BORDER.primary,
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    minHeight: moderateScale(220),
  },
  cardTitle: {
    fontSize: responsiveFontSize(16),
    fontFamily: "Poppins-Bold",
    color: TEXT.primary,
    borderBottomColor: BORDER.primary,
    borderBottomWidth: 0.5,
    paddingTop: moderateScale(6),
    paddingBottom: moderateScale(4),
    width: "100%",
    paddingHorizontal: moderateScale(8),
  },
  centerContent: {
    alignItems: "center",
  },
  percentText: {
    fontSize: responsiveFontSize(36),
    fontWeight: "900",
    color: TEXT.primary,
    marginTop: moderateScale(-10),
  },
  subText: {
    fontSize: responsiveFontSize(14),
    fontFamily: "Poppins-Regular",
    color: TEXT.primary,
    marginTop: moderateScale(4),
  },
  message: {
    fontSize: responsiveFontSize(13),
    color: TEXT.primary,
    textAlign: "center",
    marginTop: moderateScale(-36),
    fontFamily: "Poppins-Medium",
  },
  progressContainer: {
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    paddingTop: moderateScale(14),
    paddingBottom: moderateScale(8),
  },
  loadingContainer: {
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    paddingTop: moderateScale(20),
    paddingBottom: moderateScale(20),
  },
});
