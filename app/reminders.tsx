import ScreenWrapper from "@/shared/components/ScreenWrapper";
import { remindersRepository } from "@/storage";
import { ReminderWithEntityName } from "@/storage/repositories/reminders.repository";
import { BACKGROUND, BORDER, PRIMARY, SURFACE, TEXT } from "@/shared/theme/colors";
import { fonts } from "@/shared/theme/fonts";
import { moderateScale, responsiveFontSize } from "@/shared/utils/responsive";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { useFocusEffect, useRouter } from "expo-router";
import React, { useCallback, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function RemindersScreen() {
  const router = useRouter();
  const [reminders, setReminders] = useState<ReminderWithEntityName[]>([]);
  const [loading, setLoading] = useState(false);

  const loadReminders = useCallback(async () => {
    setLoading(true);
    try {
      const rows = await remindersRepository.getAllRemindersWithEntityName();
      setReminders(rows);
    } catch (error) {
      console.error("Failed to load reminders:", error);
      setReminders([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadReminders();
    }, [loadReminders]),
  );

  return (
    <ScreenWrapper scrollable={false}>
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.iconButton}>
            <MaterialCommunityIcons
              name="chevron-left"
              size={26}
              color={TEXT.primary}
            />
          </TouchableOpacity>

          <Text style={styles.headerTitle}>Reminders</Text>

          <TouchableOpacity style={styles.iconButton} onPress={loadReminders}>
            <MaterialCommunityIcons
              name="refresh"
              size={20}
              color={TEXT.primary}
            />
          </TouchableOpacity>
        </View>

        <ScrollView
          style={styles.list}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        >
          {loading ? (
            <Text style={styles.statusText}>Loading reminders...</Text>
          ) : reminders.length === 0 ? (
            <Text style={styles.statusText}>No reminders found</Text>
          ) : (
            reminders.map((reminder) => (
              <View key={reminder.id} style={styles.card}>
                <View style={styles.cardTopRow}>
                  <View style={styles.entityRow}>
                    <MaterialCommunityIcons
                      name={
                        reminder.entityType === "task"
                          ? "checkbox-marked-circle-outline"
                          : "calendar-check-outline"
                      }
                      size={18}
                      color={PRIMARY.main}
                    />
                    <Text style={styles.entityName} numberOfLines={1}>
                      {reminder.entityName}
                    </Text>
                  </View>

                  <View
                    style={[
                      styles.statusChip,
                      reminder.enabled
                        ? styles.activeChip
                        : styles.inactiveChip,
                    ]}
                  >
                    <Text
                      style={[
                        styles.statusChipText,
                        reminder.enabled
                          ? styles.activeChipText
                          : styles.inactiveChipText,
                      ]}
                    >
                      {reminder.enabled ? "Active" : "Inactive"}
                    </Text>
                  </View>
                </View>

                <View style={styles.detailRow}>
                  <MaterialCommunityIcons
                    name="clock-outline"
                    size={16}
                    color={TEXT.secondary}
                  />
                  <Text style={styles.detailText}>{reminder.time}</Text>
                </View>

                <View style={styles.detailRow}>
                  <MaterialCommunityIcons
                    name="label-outline"
                    size={16}
                    color={TEXT.secondary}
                  />
                  <Text style={styles.detailText} numberOfLines={1}>
                    {reminder.label || "Reminder"}
                  </Text>
                </View>
              </View>
            ))
          )}
        </ScrollView>
      </View>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "transparent",
    paddingHorizontal: moderateScale(16),
    paddingTop: moderateScale(20),
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: moderateScale(12),
  },
  iconButton: {
    width: moderateScale(44),
    height: moderateScale(44),
    borderRadius: moderateScale(22),
    backgroundColor: SURFACE.primary,
    borderWidth: 1,
    borderColor: BORDER.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    fontSize: responsiveFontSize(20),
    fontFamily: fonts.semibold,
    color: TEXT.primary,
  },
  list: {
    flex: 1,
  },
  listContent: {
    paddingBottom: moderateScale(42),
    gap: moderateScale(10),
  },
  statusText: {
    marginTop: moderateScale(20),
    fontSize: responsiveFontSize(14),
    fontFamily: fonts.medium,
    color: TEXT.secondary,
    textAlign: "center",
  },
  card: {
    backgroundColor: SURFACE.primary,
    borderRadius: moderateScale(14),
    borderWidth: 1,
    borderColor: BORDER.primary,
    padding: moderateScale(12),
    gap: moderateScale(10),
  },
  cardTopRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: moderateScale(8),
  },
  entityRow: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: moderateScale(8),
  },
  entityName: {
    flex: 1,
    fontSize: responsiveFontSize(14),
    fontFamily: fonts.semibold,
    color: TEXT.primary,
  },
  statusChip: {
    paddingHorizontal: moderateScale(10),
    paddingVertical: moderateScale(4),
    borderRadius: moderateScale(999),
  },
  activeChip: {
    backgroundColor: "#D1FAE5",
  },
  inactiveChip: {
    backgroundColor: BACKGROUND.secondary,
    borderWidth: 1,
    borderColor: BORDER.secondary,
  },
  statusChipText: {
    fontSize: responsiveFontSize(10),
    fontFamily: fonts.semibold,
  },
  activeChipText: {
    color: "#065F46",
  },
  inactiveChipText: {
    color: TEXT.secondary,
  },
  detailRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: moderateScale(8),
  },
  detailText: {
    flex: 1,
    fontSize: responsiveFontSize(12),
    fontFamily: fonts.medium,
    color: TEXT.secondary,
  },
});
