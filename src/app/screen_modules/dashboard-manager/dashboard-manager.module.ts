import { NgModule } from "@angular/core";

import { CaponeTemplateComponent } from "../team-dashboard/templates/capone-template/capone-template.component";
import { StechTeamTemplateComponent } from "../team-dashboard/templates/stech-template/stech-team-template.component";
import { StechProdTemplateComponent } from "../product-dashboard/stech-template/stech-prod-template.component";

import { DashboardViewComponent } from "./dashboard-view/dashboard-view.component";
import { SharedModule } from "../../shared/shared.module";
import { DashboardMgrRoutingModule } from "./dashboard-manager-routing.module";
import { DasboardNavbarComponent } from "./dasboard-navbar/dasboard-navbar.component";
import { SecurityScanModule } from "../../widget_modules/security-scan/security-scan.module";
import { StaticAnalysisModule } from "../../widget_modules/static-analysis/static-analysis.module";
import { OpensourceScanModule } from "../../widget_modules/opensource-scan/opensource-scan.module";
import { TestModule } from "../../widget_modules/test/test.module";
import { BuildModule } from "../../widget_modules/build/build.module";
import { ProductModule } from "../../widget_modules/product/product.module";
import { RepoModule } from "../../widget_modules/repo/repo.module";
import { DeployModule } from "../../widget_modules/deploy/deploy.module";
import { FeatureModule } from "../../widget_modules/feature/feature.module";

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
import { FormsModule } from "@angular/forms";
import { NgbTypeaheadModule } from "@ng-bootstrap/ng-bootstrap";

@NgModule({
  declarations: [
    DashboardViewComponent,
    DasboardNavbarComponent,
    CaponeTemplateComponent,
    StechTeamTemplateComponent,
    StechProdTemplateComponent,
  ],
  imports: [
    SharedModule,
    DashboardMgrRoutingModule,
    SecurityScanModule,
    StaticAnalysisModule,
    OpensourceScanModule,
    TestModule,
    BuildModule,
    ProductModule,
    RepoModule,
    DeployModule,
    FeatureModule,
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
    NgbTypeaheadModule,
  ],
  entryComponents: [
    DashboardViewComponent,
    DasboardNavbarComponent,
    CaponeTemplateComponent,
    StechTeamTemplateComponent,
    StechProdTemplateComponent,
  ],
  exports: [
    DashboardViewComponent,
    DasboardNavbarComponent,
    CaponeTemplateComponent,
    StechTeamTemplateComponent,
    StechProdTemplateComponent,
  ],
})
export class DashboardMgrModule {}
