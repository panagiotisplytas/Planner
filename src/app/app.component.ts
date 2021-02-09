import { Component } from "@angular/core";
import { Platform } from "@ionic/angular";
import { DatabaseService } from "./shared/database.service";
import { Plugins } from "@capacitor/core";
import { ReminderService } from "./shared/reminder.service";
const { SplashScreen, StatusBar } = Plugins;

@Component({
  selector: "app-root",
  templateUrl: "app.component.html",
  styleUrls: ["app.component.scss"],
})
export class AppComponent {
  public appPages = [
    {
      title: "History",
      url: "/history",
      icon: "today",
    },
  ];
  selectedIndex = 0;
  constructor(
    private platform: Platform,
    private databaseService: DatabaseService,
    private notificationsCtrl: ReminderService
  ) {
    this.initializeApp();
  }

  async initializeApp() {
    this.platform.ready().then(async () => {
      await this.notificationsCtrl.initializePlugin();
      await this.databaseService.initializePlugin();
      this.databaseService.dbReady.subscribe((isReady) => {
        if (isReady) {
          this.databaseService.readTasks();
          StatusBar.show();
          SplashScreen.hide();
        }
      });
    });
  }
}
