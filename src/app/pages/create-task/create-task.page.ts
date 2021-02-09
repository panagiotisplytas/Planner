import { Component, OnInit } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { ISODateString } from "@capacitor/core";
import { LoadingController, NavController } from "@ionic/angular";
import { DatabaseService } from "../../shared/database.service";
import { Task } from "../../shared/task.model";

@Component({
  selector: "app-create-task",
  templateUrl: "./create-task.page.html",
  styleUrls: ["./create-task.page.scss"],
})
export class CreateTaskPage implements OnInit {
  taskForm: FormGroup;
  /**
   *
   * @param dataService DatabaseService to access data.
   * @param loadingCtrl Controller to display loading indicator.
   * @param navCtrl Ionic navigation controller to use proper animations.
   */
  constructor(
    private dataService: DatabaseService,
    private loadingCtrl: LoadingController,
    private navCtrl: NavController
  ) {}

  ngOnInit() {
    this.taskForm = new FormGroup({
      title: new FormControl(null, {
        updateOn: "change",
        validators: [Validators.required],
      }),
      description: new FormControl(null, {
        updateOn: "change",
        validators: [Validators.required, Validators.maxLength(255)],
      }),
      completed: new FormControl(false, { updateOn: "change" }),
      startDate: new FormControl(null, {
        updateOn: "change",
        validators: [Validators.required],
      }),
      endDate: new FormControl(null, {
        updateOn: "change",
        validators: [Validators.required],
      }),
      urgency: new FormControl("low", {
        updateOn: "change",
        validators: [Validators.required],
      }),
      reminder: new FormControl(null, {
        updateOn: "change",
      }),
    });
  }
  onSubmit() {
    if (!this.taskForm.valid) {
      return;
    }
    this.loadingCtrl
      .create({
        message: "Creating task...",
      })
      .then((loadingEl) => {
        loadingEl.present();
        const newTask = new Task(
          this.taskForm.value.title.trim(),
          this.taskForm.value.description.trim(),
          this.taskForm.value.startDate as ISODateString,
          this.taskForm.value.endDate as ISODateString,
          this.taskForm.value.completed ? 1 : 0,
          this.taskForm.value.urgency.trim(),
          this.taskForm.value.reminder as ISODateString
        );

        this.dataService.createTask(newTask).then(() => {
          loadingEl.dismiss();
          this.taskForm.reset();
          this.navCtrl.pop();
        });
      });
  }
}
