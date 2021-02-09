import { NgModule } from "@angular/core";
import { PreloadAllModules, RouterModule, Routes } from "@angular/router";

const routes: Routes = [
  {
    path: "",
    redirectTo: "home",
    pathMatch: "full",
  },
  {
    path: "home",
    loadChildren: () =>
      import("./pages/home/home.module").then((m) => m.HomePageModule),
  },
  {
    path: "history",
    loadChildren: () =>
      import("./pages/history/history.module").then((m) => m.HistoryPageModule),
  },

  {
    path: "task",
    loadChildren: () =>
      import("./pages/create-task/create-task.module").then(
        (m) => m.CreateTaskPageModule
      ),
  },
  {
    path: "edit",
    loadChildren: () =>
      import("./pages/edit-task/edit-task.module").then(
        (m) => m.EditTaskPageModule
      ),
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
