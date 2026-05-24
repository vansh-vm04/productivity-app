import { remindersRepository } from "@/storage";
import {
  cancelReminderNotificationAsync,
  ensureReminderNotificationsAsync,
  scheduleReminderNotificationAsync,
} from "./reminderNotifications.service";

export const syncReminderNotificationsAsync = async (): Promise<void> => {
  await ensureReminderNotificationsAsync();

  const reminders = await remindersRepository.getAllReminders();

  await Promise.all(
    reminders.map(async (reminder) => {
      if (reminder.notificationId) {
        await cancelReminderNotificationAsync(reminder.notificationId);
      }

      if (reminder.enabled) {
        const notificationId = await scheduleReminderNotificationAsync({
          id: reminder.id,
          entityType: reminder.entityType,
          time: reminder.time,
          label: reminder.label,
        });

        await remindersRepository.updateReminderNotificationId(
          reminder.id,
          notificationId,
        );
      } else if (reminder.notificationId) {
        await remindersRepository.updateReminderNotificationId(reminder.id, null);
      }
    }),
  );
};
