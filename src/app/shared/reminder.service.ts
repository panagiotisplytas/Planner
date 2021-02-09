import { Injectable } from "@angular/core";
import { Plugins } from "@capacitor/core";
import { Reminder } from "./reminder.model";
const { LocalNotifications } = Plugins;

@Injectable({
  providedIn: "root",
})
export class ReminderService {
  constructor() {}
  async initializePlugin(): Promise<void> {
    if (!(await LocalNotifications.areEnabled()).value) {
      console.log(
        "#### Notifications aren't enabled requesting permissions..."
      );
      await LocalNotifications.requestPermissions();
    } else {
      console.log("#### Notifications permissions are granted.");
    }
  }
  /**
   *
   * @param reminder the remider that will be schedulled.
   */
  async setReminder(reminder: Reminder): Promise<void> {
    const date = new Date(reminder.date);
    const notifications = await LocalNotifications.schedule({
      notifications: [
        {
          title: reminder.title,
          body: reminder.description,
          id: reminder.id,
          schedule: { at: date },
        },
      ],
    });

    console.log("#### Scheduled notification:", notifications.notifications);
  }

  /**
   *
   * @param id reminder id to delete.
   */
  async deleteReminder(id: number): Promise<void> {
    const reminderExists = await this.reminderExists(id);
    if (reminderExists) {
      const idString: string = id.toString();
      await LocalNotifications.cancel({ notifications: [{ id: idString }] });
    } else {
      //Error handling to be implemented.
    }
  }
  /**
   *
   * @param id Task's id to check if it has schedulled reminder.
   */
  async reminderExists(id: number): Promise<boolean> {
    const idString: string = id.toString();
    const notification = (
      await LocalNotifications.getPending()
    ).notifications.find((n) => n.id === idString);
    if (notification.id) {
      return true;
    } else {
      return false;
    }
  }
}
