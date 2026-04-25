import { HabitCard } from "@/features/habits/components/HabitCard";
import { HABITS_MOCKS } from "@/features/habits/mocks/habits.mocks";
import { filterHabitsByPeriod } from "@/features/habits/ui/habits.helper";
import ActionModal, { ActionModalItem } from "@/shared/components/ActionModal";
import { AddButton } from "@/shared/components/AddButton";
import { HABIT_PERIODS, HabitPeriod } from "@/shared/constants/habits";
import { CARD_PALETTES, PRIMARY, SCREEN, TEXT } from "@/shared/theme/colors";
import { fonts } from "@/shared/theme/fonts";
import { Habit } from "@/shared/types/habit";
import { moderateScale, responsiveFontSize } from "@/shared/utils/responsive";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useMemo, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function Habits() {
  const router = useRouter();
  const [activePeriod, setActivePeriod] = useState<HabitPeriod>("today");
  const [selectedHabit, setSelectedHabit] = useState<Habit | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [habits, setHabits] = useState<Habit[]>(HABITS_MOCKS);

  const filteredHabits = useMemo(() => {
    return filterHabitsByPeriod(habits, activePeriod);
  }, [activePeriod, habits]);

  const toggleHabit = (id: string) => {
    setHabits(
      habits.map((habit) =>
        habit.id === id
          ? {
              ...habit,
              completed: !habit.completed,
              lastCompletedAt: !habit.completed
                ? new Date()
                : habit.lastCompletedAt,
            }
          : habit,
      ),
    );
  };

  const handleLongPress = (habit: Habit) => {
    setSelectedHabit(habit);
    setModalVisible(true);
  };

  const handleComplete = () => {
    if (selectedHabit) {
      toggleHabit(selectedHabit.id);
    }
    setModalVisible(false);
  };

  const handleDelete = () => {
    if (selectedHabit) {
      setHabits(habits.filter((habit) => habit.id !== selectedHabit.id));
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
    <LinearGradient
      colors={[SCREEN.gradientStart, SCREEN.gradientEnd]}
      start={{ x: 0.5, y: 0 }}
      end={{ x: 0.5, y: 1 }}
      style={styles.gradientBackground}
    >
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
          {filteredHabits.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateText}>No habits yet</Text>
              <Text style={styles.emptyStateSubText}>
                Create your first habit to get started!
              </Text>
            </View>
          ) : (
            filteredHabits.map((habit, index) => {
              const colors = CARD_PALETTES[index % CARD_PALETTES.length];
              return (
                <HabitCard
                  key={habit.id}
                  habit={habit}
                  backgroundColor={colors.base}
                  accentColor={colors.accent}
                  onPress={() => toggleHabit(habit.id)}
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

  periodScrollContent: {
    paddingHorizontal: moderateScale(16),
    paddingVertical: moderateScale(12),
    gap: moderateScale(8),
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
    paddingVertical: moderateScale(10),
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
