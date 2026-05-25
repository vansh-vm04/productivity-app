import * as Notifications from "expo-notifications";
import { Platform } from "react-native";

type ReminderNotificationInput = {
  id: string;
  entityType: "habit" | "task";
  time: string;
  label: string;
};

const ANDROID_CHANNEL_ID = "reminders";

let initializationPromise: Promise<void> | null = null;

const parseReminderTime = (time: string): { hour: number; minute: number } => {
  const [hourText, minuteText] = time.split(":");
  const hour = Number.parseInt(hourText, 10);
  const minute = Number.parseInt(minuteText, 10);

  if (
    Number.isNaN(hour) ||
    Number.isNaN(minute) ||
    hour < 0 ||
    hour > 23 ||
    minute < 0 ||
    minute > 59
  ) {
    throw new Error(`Invalid reminder time: ${time}`);
  }

  return { hour, minute };
};

const buildReminderBody = (
  entityType: "habit" | "task",
  label: string,
): string => {
  const trimmedLabel = label.trim();

  if (trimmedLabel.length > 0) {
    return trimmedLabel;
  }

  return entityType === "habit" ? "Habit reminder" : "Task reminder";
};

export const ensureReminderNotificationsAsync = async (): Promise<void> => {
  if (Platform.OS === "web") {
    return;
  }

  if (!initializationPromise) {
    initializationPromise = (async () => {
      Notifications.setNotificationHandler({
        handleNotification: async () => ({
          shouldPlaySound: true,
          shouldSetBadge: false,
          shouldShowBanner: true,
          shouldShowList: true,
        }),
      });

      if (Platform.OS === "android") {
        await Notifications.setNotificationChannelAsync(ANDROID_CHANNEL_ID, {
          name: "Reminders",
          importance: Notifications.AndroidImportance.MAX,
          lockscreenVisibility:
            Notifications.AndroidNotificationVisibility.PUBLIC,
          enableVibrate: false,
          lightColor: "#2563EB",
          sound: "reminder.mp3",
        });
      }

      const permissionStatus = await Notifications.getPermissionsAsync();
      if (!permissionStatus.granted) {
        const requestedPermission =
          await Notifications.requestPermissionsAsync();
        if (!requestedPermission.granted) {
          console.warn("Notification permission was not granted.");
        }
      }
    })();
  }

  await initializationPromise;
};

export const scheduleReminderNotificationAsync = async (
  reminder: ReminderNotificationInput,
): Promise<string | null> => {
  if (Platform.OS === "web") {
    return null;
  }

  await ensureReminderNotificationsAsync();

  try {
    const { hour, minute } = parseReminderTime(reminder.time);
    return await Notifications.scheduleNotificationAsync({
      content: {
        title:
          reminder.entityType === "habit" ? "Habit Reminder" : "Task Reminder",

        body:
          reminder.entityType === "habit"
            ? `Time for "${reminder.label}" 👀`
            : `Don't forget to complete "${reminder.label}"`,

        data: {
          reminderId: reminder.id,
          entityType: reminder.entityType,
        },

        sound: "reminder.mp3",

        priority: Notifications.AndroidNotificationPriority.MAX,
      },
      trigger: {
        hour: hour,
        minute: minute,
        repeats: true,
        type: Notifications.SchedulableTriggerInputTypes.DAILY,
        ANDROID_CHANNEL_ID
      } as any,
    });
  } catch (error) {
    console.error(
      `Failed to schedule notification for reminder ${reminder.id}:`,
      error,
    );
    return null;
  }
};

export const cancelReminderNotificationAsync = async (
  notificationId: string | null | undefined,
): Promise<void> => {
  if (Platform.OS === "web" || !notificationId) {
    return;
  }

  await ensureReminderNotificationsAsync();

  try {
    await Notifications.cancelScheduledNotificationAsync(notificationId);
  } catch (error) {
    console.error(`Failed to cancel notification ${notificationId}:`, error);
  }
};
