import { Component, OnDestroy, OnInit } from "@angular/core";
import { NavigationExtras, Router } from "@angular/router";
import { Subscription } from "rxjs";
import { AlertController, IonItemSliding, NavController } from "@ionic/angular";
import { Task } from "../../shared/task.model";
import { DatabaseService } from "../../shared/database.service";

@Component({
  selector: "app-history",
  templateUrl: "./history.page.html",
  styleUrls: ["./history.page.scss"],
})
export class HistoryPage implements OnInit, OnDestroy {
  private subscription: Subscription;

  tasks: Task[] = [];
  /**
   *
   * @param dataService DatabaseService to access data.
   * @param alertCtrl AlertControler to present alerts.
   * @param navCtrl NavControler to navigate with animations.
   * @param router Instance of Angular router to access current url.
   */
  constructor(
    private dataService: DatabaseService,
    private alertCtrl: AlertController,
    private navCtrl: NavController,
    private router: Router
  ) {}
  async ngOnInit(): Promise<void> {
    this.subscription = this.dataService.tasks.subscribe((tasks: Task[]) => {
      this.tasks = tasks.filter((task: Task) => {
        return task.status === 1;
      });
    });
  }
  /**
   *
   * @param id The id of the task to be edited.
   * @param slidingItem The IonItemSliding that has been slided must close.
   */
  editTask(id: number, slidingItem: IonItemSliding): void {
    const taskToEdit = this.tasks.find((task: Task) => {
      return task.id === id;
    });
    slidingItem.close();
    let navigationExtras: NavigationExtras = {
      queryParams: {
        special: JSON.stringify(taskToEdit),
        route: this.router,
      },
    };
    this.navCtrl.navigateForward("/edit", navigationExtras);
  }
  /**
   *
   * @param id The id of the task to be deleted.
   * @param slidingItem The IonItemSliding that has been slided must close.
   */
  async deleteTask(id: number, slidingItem: IonItemSliding): Promise<void> {
    slidingItem.close();
    const alert = await this.alertCtrl.create({
      header: "Warning!",
      message: "This will pemanently delete the task are you sure?",
      buttons: [
        {
          text: "Cancel",
          role: "cancel",
          cssClass: "secondary",
        },
        {
          text: "Delete",
          cssClass: "danger",
          handler: () => {
            this.dataService.deleteTask(id);
          },
        },
      ],
    });

    await alert.present();
  }
  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
