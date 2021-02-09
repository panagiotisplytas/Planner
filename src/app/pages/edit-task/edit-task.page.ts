import { Component, OnDestroy, OnInit } from "@angular/core";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { ActivatedRoute } from "@angular/router";
import { LoadingController, NavController } from "@ionic/angular";
import { Subscription } from "rxjs";
import { Task } from "../../shared/task.model";
import { DatabaseService } from "../../shared/database.service";

@Component({
  selector: "app-edit-task",
  templateUrl: "./edit-task.page.html",
  styleUrls: ["./edit-task.page.scss"],
})
export class EditTaskPage implements OnInit, OnDestroy {
  private paramSub: Subscription;
  task: Task;
  taskForm: FormGroup;
  previousURL: string = "";

  constructor(
    private databaseService: DatabaseService,
    private navCtrl: NavController,
    private loadingCtrl: LoadingController,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.taskForm = new FormGroup({
      title: new FormControl(null, {
        updateOn: "change",
        validators: [Validators.required],
      }),
      description: new FormControl(null, {
        updateOn: "change",
        validators: [Validators.required],
      }),
      completed: new FormControl(null, { updateOn: "change" }),
      startDate: new FormControl(null, {
        updateOn: "change",
        validators: [Validators.required],
      }),
      endDate: new FormControl(null, {
        updateOn: "change",
        validators: [Validators.required],
      }),
      urgency: new FormControl(null, {
        updateOn: "change",
        validators: [Validators.required],
      }),
      reminder: new FormControl(null, {
        updateOn: "change",
      }),
    });
    this.loadingCtrl.create({ message: "Loading..." }).then((loadingEl) => {
      loadingEl.present();
      this.paramSub = this.route.queryParams.subscribe((params) => {
        this.task = JSON.parse(params.special);
        this.previousURL = params.route;
      });

      if (this.task.reminder === undefined) this.task.reminder = null;
      this.taskForm.setValue({
        title: this.task.title,
        description: this.task.description,
        completed: this.task.status === 1 ? true : false,
        startDate: this.task.startDate,
        endDate: this.task.endDate,
        urgency: this.task.urgency,
        reminder: this.task.reminder,
      });
      this.loadingCtrl.dismiss();
    });
  }
  onSubmit() {
    if (!this.taskForm.valid) {
      return;
    }
    this.loadingCtrl
      .create({
        message: "Updating task...",
      })
      .then((loadingEl) => {
        loadingEl.present();
        const newTask = new Task(
          this.taskForm.value.title.trim(),
          this.taskForm.value.description.trim(),
          this.taskForm.value.startDate,
          this.taskForm.value.endDate,
          this.taskForm.value.completed ? 1 : 0,
          this.taskForm.value.urgency.trim(),
          this.taskForm.value.reminder,
          this.task.id
        );
        this.databaseService.updateTask(newTask, this.task).then(() => {
          loadingEl.dismiss();
          this.taskForm.reset();
          this.navCtrl.pop();
        });
      });
  }
  ngOnDestroy() {
    if (this.paramSub) {
      this.paramSub.unsubscribe();
    }
  }
}
