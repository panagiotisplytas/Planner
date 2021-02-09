import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { BehaviorSubject } from "rxjs";
import { AlertController } from "@ionic/angular";
import { Capacitor, Plugins } from "@capacitor/core";
import { capSQLiteChanges, JsonSQLite } from "@capacitor-community/sqlite";
import "@capacitor-community/sqlite";
import { Task } from "./task.model";
import { ReminderService } from "./reminder.service";
import { Reminder } from "./reminder.model";

const { CapacitorSQLite, Storage } = Plugins;
const DB_SETUP_KEY = "db_setup";
const DB_NAME_KEY = "db_name";

@Injectable({ providedIn: "root" })
export class DatabaseService {
  dbReady = new BehaviorSubject(false);
  dbName: string = "";
  handlerPermissions: any;
  sqlite: any;
  platform: string;
  tasks = new BehaviorSubject<Task[]>([]);

  constructor(
    private alertCtrl: AlertController,
    private http: HttpClient,
    private notificationsCtrl: ReminderService
  ) {}

  async initializePlugin(): Promise<void> {
    this.platform = Capacitor.platform;
    this.sqlite = CapacitorSQLite;
    if (this.platform === "android") {
      this.handlerPermissions = this.sqlite.addListener(
        "androidPermissionsRequest",
        async (data: any) => {
          if (data.permissionGranted === 1) {
            this.handlerPermissions.remove();
            this.openDataBase();
          } else {
            this.handlerPermissions.remove();
            this.sqlite = null;
          }
        }
      );
      try {
        this.sqlite.requestPermissions();
      } catch (e) {
        const alert = await this.alertCtrl.create({
          header: "No DB access",
          message: "This app can't work without Database access.",
          buttons: ["OK"],
        });
        await alert.present();
      }
    } else if (this.platform === "web" || this.platform === "electron") {
      console.log(
        "##### The Sqlite Plugin isn't available for ",
        this.platform,
        "yet!"
      );
    } else {
      this.openDataBase();
    }
  }

  private async openDataBase(): Promise<void> {
    const dbSetupDone = await Storage.get({ key: DB_SETUP_KEY });
    if (!dbSetupDone.value) {
      this.createDataBase();
    } else {
      this.dbName = (await Storage.get({ key: DB_NAME_KEY })).value;
      await CapacitorSQLite.open({ database: this.dbName });
      await this.readTasks();
      this.dbReady.next(true);
    }
  }

  private async createDataBase(): Promise<void> {
    this.http
      .get("https://api.jsonbin.io/b/6022d8813b303d3d964e39be")
      .subscribe(async (jsonExport: JsonSQLite) => {
        const jsonstring = JSON.stringify(jsonExport);
        const isValid = await CapacitorSQLite.isJsonValid({ jsonstring });
        if (isValid.result === true) {
          this.dbName = jsonExport.database;
          await Storage.set({ key: DB_NAME_KEY, value: this.dbName });
          await CapacitorSQLite.importFromJson({ jsonstring });
          await Storage.set({ key: DB_SETUP_KEY, value: "1" });
          this.dbReady.next(true);
        }
      });
  }

  /**
   *
   * @param task is the task to be created.
   */
  async createTask(task: Task): Promise<capSQLiteChanges> {
    const statement = `INSERT INTO task (title, description, startDate, endDate, urgency, status, reminder)
    VALUES (?,?,?,?,?,?,?);`;
    const response = await CapacitorSQLite.run({
      statement,
      values: [
        task.title,
        task.description,
        task.startDate,
        task.endDate,
        task.urgency,
        task.status,
        task.reminder,
      ],
    });
    if (
      response.changes.changes != -1 &&
      task.reminder !== null &&
      task.reminder !== undefined
    ) {
      const reminder = new Reminder(
        task.title,
        task.description,
        task.reminder,
        response.changes.lastId
      );
      await this.notificationsCtrl.setReminder(reminder);
    }
    await this.readTasks();
    return response;
  }

  async readTasks(): Promise<void> {
    const statement =
      "SELECT id, title, description, startDate, endDate, reminder, urgency, status FROM task ORDER BY endDate ASC;";
    const response = await CapacitorSQLite.query({ statement, values: [] });
    this.tasks.next(response.values as Task[]);
  }
  /**
   *
   * @param updatedTask Is the new task object.
   * @param oldTask Is the old task object.
   */
  async updateTask(
    updatedTask: Task,
    oldTask: Task
  ): Promise<capSQLiteChanges> {
    const statement =
      "UPDATE task SET title = ?, description = ?, startDate = ?, endDate = ?, reminder = ?, urgency = ? , status = ? WHERE id = ?;";
    const response = await CapacitorSQLite.run({
      statement,
      values: [
        updatedTask.title,
        updatedTask.description,
        updatedTask.startDate,
        updatedTask.endDate,
        updatedTask.reminder,
        updatedTask.urgency,
        updatedTask.status,
        updatedTask.id,
      ],
    });
    if (
      updatedTask.reminder !== oldTask.reminder &&
      updatedTask.reminder !== null &&
      updatedTask.reminder !== undefined
    ) {
      const reminder = new Reminder(
        updatedTask.title,
        updatedTask.description,
        updatedTask.reminder,
        updatedTask.id
      );
      if (oldTask.reminder === null || oldTask.reminder === undefined) {
        await this.notificationsCtrl.setReminder(reminder);
      } else {
        await this.notificationsCtrl.deleteReminder(updatedTask.id);
        await this.notificationsCtrl.setReminder(reminder);
      }
    }
    await this.readTasks();
    return response;
  }
  /**
   *
   * @param taskId The task's id to be deleted.
   */
  async deleteTask(taskId: number): Promise<capSQLiteChanges> {
    const statement = "DELETE FROM task WHERE id = ?;";
    const response = await CapacitorSQLite.run({ statement, values: [taskId] });
    await this.readTasks();
    await this.notificationsCtrl.deleteReminder(taskId);
    return response;
  }
}
