import { NgModule } from "@angular/core";

import { SharedModule } from "../shared/shared.module";

import { LandingPageRoutingModule } from "./landing-page-routing.module";
import { DashboardListService } from "./dashboard-list/dashboard-list.service";
import { DashboardListComponent } from "./dashboard-list/dashboard-list.component";
import {
  NbActionsModule,
  NbButtonModule,
  NbCardModule,
  NbCheckboxModule,
  NbIconModule,
  NbInputModule,
  NbListModule,
  NbMenuModule,
  NbRadioModule,
  NbSearchModule,
  NbSelectModule,
  NbStepperModule,
  NbTableModule,
  NbLayoutModule,
  NbTabsetModule,
  NbTreeGridModule,
  NbUserModule,
  NbDialogModule,
} from "@nebular/theme";
import { DashboardCreateComponent } from "./dashboard-create/dashboard-create.component";
import { FormsModule } from "@angular/forms";
import { NgbTypeaheadModule } from "@ng-bootstrap/ng-bootstrap";
import { DashboardCountComponent } from "./dashboard-list/dashboard-count/dashboard-count.component";
import { PieChartModule } from "@swimlane/ngx-charts";

@NgModule({
  declarations: [
    LandingPageRoutingModule.components,
    DashboardListComponent,
    DashboardCreateComponent,
    DashboardCountComponent,
  ],
  imports: [
    SharedModule,
    LandingPageRoutingModule,
    NbTabsetModule,
    NbSearchModule,
    NbCardModule,
    NbIconModule,
    NbListModule,
    NbUserModule,
    NbTableModule,
    NbTreeGridModule,
    NbMenuModule,
    NbInputModule,
    NbButtonModule,
    NbActionsModule,
    NbLayoutModule,
    NbSelectModule,
    NbRadioModule,
    NbDialogModule.forRoot(),
    NbStepperModule,
    NbCheckboxModule,
    FormsModule,
    NgbTypeaheadModule,
    PieChartModule,
  ],
  entryComponents: [DashboardCreateComponent, DashboardListComponent],
  providers: [DashboardListService],
})
export class LandingPageModule {}
