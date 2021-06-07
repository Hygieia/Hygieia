import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

const routes: Routes = [
  {
    path: "user",
    loadChildren: () => import("./user/user.module").then((m) => m.UserModule),
  },
  {
    path: "build",
    loadChildren: () =>
      import("./widget_modules/build/build.module").then((m) => m.BuildModule),
  },
  {
    path: "collectorItem",
    loadChildren: () =>
      import("./viewer_modules/collector-item/collector-item.module").then(
        (m) => m.CollectorItemModule
      ),
  },
  {
    path: "dashboard",
    loadChildren: () =>
      import(
        "./screen_modules/dashboard-manager/dashboard-manager.module"
      ).then((m) => m.DashboardMgrModule),
  },
  {
    path: "admin",
    loadChildren: () =>
      import("./admin_modules/admin_dashboard/admin-dashboard-modules").then(
        (m) => m.AdminDashboardModule
      ),
  },
  {
    path: "audits",
    loadChildren: () =>
      import("./screen_modules/nfrr/nfrr.module").then((m) => m.NfrrModule),
  },
  {
    path: "",
    loadChildren: () =>
      import("./landing_page/landing-page.module").then(
        (m) => m.LandingPageModule
      ),
    pathMatch: "full",
  },
  { path: "**", redirectTo: "" },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
