import {
  HabitCard,
  HabitCardMonthly,
  HabitCardWeekly,
} from "@/features/habits/components";
import ActionModal, { ActionModalItem } from "@/shared/components/ActionModal";
import { AddButton } from "@/shared/components/AddButton";
import { EmptyState } from "@/shared/components/EmptyState";
import ScreenWrapper from "@/shared/components/ScreenWrapper";
import { HABIT_PERIODS, HabitPeriod } from "@/shared/constants/habits";
import { useHabits } from "@/features/habits/hooks/useHabits";
import { PRIMARY, TEXT } from "@/shared/theme/colors";
import { fonts } from "@/shared/theme/fonts";
import { Habit } from "@/shared/types/habit";
import { moderateScale, responsiveFontSize } from "@/shared/utils/responsive";
import { useFocusEffect, useRouter } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function Habits() {
  const router = useRouter();
  const {
    habits,
    deleteHabit,
    getHabitCompletionValuesByDate,
    getHabitCompletionsByHabitId,
    removeHabitCompletion,
    setHabitCompletionValue,
    toggleHabitCompletion,
    refetch,
  } = useHabits();
  const [activePeriod, setActivePeriod] = useState<HabitPeriod>("today");
  const [selectedHabit, setSelectedHabit] = useState<Habit | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [todayCompletionValues, setTodayCompletionValues] = useState<
    Record<string, number>
  >({});
  const [weeklyCompletions, setWeeklyCompletions] = useState<
    Record<string, string[]>
  >({});
  const [monthlyCompletions, setMonthlyCompletions] = useState<
    Record<string, string[]>
  >({});

  useFocusEffect(
    useCallback(() => {
      refetch();
    }, [refetch]),
  );

  // Helper function to generate weekly completion data
  const getWeeklyCompletedDays = useCallback(async (habit: Habit): Promise<string[]> => {
    const weekdays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    const completedDates = await getHabitCompletionsByHabitId(habit.id);
    const days: string[] = [];
    completedDates.forEach(
      (dateStr: {
        id: string;
        habitId: string;
        completedDate: Date;
        createdAt: number;
        value: number;
      }) => {
        const date = new Date(dateStr.completedDate);
        const dayName = weekdays[date.getDay() === 0 ? 6 : date.getDay() - 1];
        days.push(dayName);
      },
    );
    return days;
  }, [getHabitCompletionsByHabitId]);

  // Helper function to generate monthly completion dates
  const getMonthlyCompletionDates = useCallback((habit: Habit): string[] => {
    const dates: string[] = [];
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth();
    const streak = habit.streak;

    // Generate dates based on streak, working backwards from today
    for (let i = 0; i < Math.min(streak, 30); i++) {
      const date = new Date(year, month, today.getDate() - i);
      if (date.getMonth() === month) {
        const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
        dates.push(dateStr);
      }
    }
    return dates;
  }, []);

  useEffect(() => {
    const loadCompletionData = async () => {
      const values = await getHabitCompletionValuesByDate(new Date());
      setTodayCompletionValues(values);

      const weekly: Record<string, string[]> = {};
      for (const habit of habits) {
        weekly[habit.id] = await getWeeklyCompletedDays(habit);
      }
      setWeeklyCompletions(weekly);

      const monthly: Record<string, string[]> = {};
      for (const habit of habits) {
        monthly[habit.id] = getMonthlyCompletionDates(habit);
      }
      setMonthlyCompletions(monthly);
    };

    if (habits.length > 0) {
      loadCompletionData();
    }
  }, [habits, getHabitCompletionValuesByDate, getWeeklyCompletedDays, getMonthlyCompletionDates]);

  const toggleHabit = async (id: string) => {
    const habit = habits.find((item) => item.id === id);
    const completionValue =
      habit?.type === "time"
        ? (habit?.targetDuration ?? 1)
        : habit?.type === "count"
          ? (habit?.targetCount ?? 1)
          : 1;

    await toggleHabitCompletion(id, new Date(), completionValue);
  };

  const updateHabitValue = async (habitId: string, value: number) => {
    if (value <= 0) {
      setTodayCompletionValues((prev) => {
        const next = { ...prev };
        delete next[habitId];
        return next;
      });
      await removeHabitCompletion(habitId, new Date());
      return;
    }

    setTodayCompletionValues((prev) => ({
      ...prev,
      [habitId]: value,
    }));
    await setHabitCompletionValue(habitId, new Date(), value);
  };

  const handleLongPress = (habit: Habit) => {
    setSelectedHabit(habit);
    setModalVisible(true);
  };

  const handleComplete = async () => {
    if (selectedHabit) {
      await toggleHabit(selectedHabit.id);
    }
    setModalVisible(false);
  };

  const handleDelete = async () => {
    if (selectedHabit) {
      await deleteHabit(selectedHabit.id);
    }
    setModalVisible(false);
  };

  const handleEdit = () => {
    if (!selectedHabit) return;

    setModalVisible(false);
    router.push({
      pathname: "/create/habit",
      params: {
        mode: "edit",
        habitId: selectedHabit.id,
        name: selectedHabit.name,
        icon: selectedHabit.icon,
        frequency: selectedHabit.frequency,
      },
    });
  };

  const habitActions: ActionModalItem[] = [
    {
      key: "edit",
      label: "Edit",
      icon: "pencil" as const,
      iconColor: PRIMARY.main,
      onPress: handleEdit,
    },
    {
      key: "complete",
      label: selectedHabit?.completed ? "Mark Incomplete" : "Mark Complete",
      icon: selectedHabit?.completed ? "undo" : "check",
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
    <ScreenWrapper scrollable={false}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Habits</Text>
          <AddButton
            label="New Habit"
            onPress={() => router.push("/create/habit")}
          />
        </View>

        {/* Period Capsules */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.periodScrollContent}
        >
          {HABIT_PERIODS.map((option) => {
            const selected = activePeriod === option.key;
            return (
              <TouchableOpacity
                key={option.key}
                style={[
                  styles.periodCapsule,
                  selected && styles.periodCapsuleActive,
                ]}
                onPress={() => setActivePeriod(option.key)}
                activeOpacity={0.8}
              >
                <Text
                  style={[
                    styles.periodCapsuleText,
                    selected && styles.periodCapsuleTextActive,
                  ]}
                >
                  {option.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* Habits List */}
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
          bounces={true}
        >
          {habits.length === 0 ? (
            <EmptyState
              title="No habits yet"
              subtitle="Create your first habit to get started"
            />
          ) : (
            habits.map((habit) => {
              if (activePeriod === "weekly") {
                return (
                  <HabitCardWeekly
                    key={habit.id}
                    habit={habit}
                    completedDays={weeklyCompletions[habit.id] || []}
                    onLongPress={() => handleLongPress(habit)}
                  />
                );
              }

              if (activePeriod === "monthly") {
                return (
                  <HabitCardMonthly
                    key={habit.id}
                    habit={habit}
                    completionDates={monthlyCompletions[habit.id] || []}
                    onLongPress={() => handleLongPress(habit)}
                  />
                );
              }

              // Default to today view
              return (
                <HabitCard
                  key={habit.id}
                  habit={habit}
                  onPress={
                    habit.type === "binary"
                      ? () => toggleHabit(habit.id)
                      : undefined
                  }
                  onCountChange={(value) => updateHabitValue(habit.id, value)}
                  onDurationChange={(value) =>
                    updateHabitValue(habit.id, value)
                  }
                  completionValue={todayCompletionValues[habit.id] ?? 0}
                  onLongPress={() => handleLongPress(habit)}
                />
              );
            })
          )}
        </ScrollView>

        <ActionModal
          visible={modalVisible}
          title={selectedHabit?.name ?? "Habit"}
          actions={habitActions}
          onClose={() => setModalVisible(false)}
        />
      </View>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
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
    paddingTop: moderateScale(20),
  },
  headerTitle: {
    fontSize: responsiveFontSize(24),
    fontFamily: fonts.regular,
    color: TEXT.primary,
    lineHeight: moderateScale(32),
  },
  periodScrollContent: {
    paddingHorizontal: moderateScale(16),
    gap: moderateScale(8),
    paddingVertical: moderateScale(12),
    marginBottom: moderateScale(8),
  },
  periodCapsule: {
    paddingHorizontal: moderateScale(16),
    paddingVertical: moderateScale(4),
    borderRadius: moderateScale(20),
    borderWidth: 0.5,
    borderColor: "#000000",
    backgroundColor: "rgba(255,255,255,0.08)",
    height: moderateScale(30),
  },
  periodCapsuleActive: {
    backgroundColor: PRIMARY.main,
    borderColor: PRIMARY.main,
  },
  periodCapsuleText: {
    fontSize: responsiveFontSize(13),
    fontFamily: fonts.medium,
    color: TEXT.capsules,
  },
  periodCapsuleTextActive: {
    color: TEXT.capsulesActive,
  },
  scrollContent: {
    paddingHorizontal: moderateScale(16),
    paddingBottom: moderateScale(40),
  },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    minHeight: moderateScale(300),
  },
  emptyStateText: {
    fontSize: responsiveFontSize(16),
    fontFamily: fonts.semibold,
    color: TEXT.primary,
    marginBottom: moderateScale(8),
  },
  emptyStateSubText: {
    fontSize: responsiveFontSize(13),
    fontFamily: fonts.regular,
    color: TEXT.secondary,
  },
});
