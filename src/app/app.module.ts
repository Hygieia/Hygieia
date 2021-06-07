import { BrowserModule } from "@angular/platform-browser";
import { ErrorHandler, NgModule } from "@angular/core";

// 3rd Party imports
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";

// App imports
import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { CoreModule } from "./core/core.module";
import { SharedModule } from "./shared/shared.module";
import { DashboardMgrModule } from "./screen_modules/dashboard-manager/dashboard-manager.module";
import { LandingPageModule } from "./landing_page/landing-page.module";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import {
  NbActionsModule,
  NbIconModule,
  NbLayoutModule,
  NbSearchModule,
  NbThemeModule,
  NbUserModule,
} from "@nebular/theme";
import { NbEvaIconsModule } from "@nebular/eva-icons";
import { NgxUIModule } from "@swimlane/ngx-ui";
import { GlobalErrorHandler } from "./app.error.handler";

@NgModule({
  declarations: [AppComponent],
  imports: [
    AppRoutingModule,
    BrowserModule,
    BrowserAnimationsModule,
    CoreModule,
    DashboardMgrModule,
    LandingPageModule,
    NgbModule,
    SharedModule,
    NbThemeModule.forRoot({ name: "dark" }),
    NbLayoutModule,
    NbEvaIconsModule,
    NbActionsModule,
    NbUserModule,
    NgxUIModule,
    NbSearchModule,
    NbIconModule,
  ],
  providers: [{ provide: ErrorHandler, useClass: GlobalErrorHandler }],
  bootstrap: [AppComponent],
  exports: [],
})
export class AppModule {}
