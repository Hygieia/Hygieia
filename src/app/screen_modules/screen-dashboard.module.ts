import { NgModule } from '@angular/core';

import { DashboardViewComponent } from './dashboard-view/dashboard-view.component';
import { SharedModule } from '../shared/shared.module';
import { ScreenDashboardRoutingModule } from './screen-dashboard-routing.module';
import { DasboardNavbarComponent } from 'src/app/core/dasboard-navbar/dasboard-navbar.component';
import {SecurityScanModule} from '../widget_modules/security-scan/security-scan.module';
import {StaticAnalysisModule} from '../widget_modules/static-analysis/static-analysis.module';
import {OpensourceScanModule} from '../widget_modules/opensource-scan/opensource-scan.module';
import {TestModule} from '../widget_modules/test/test.module';
import {BuildModule} from '../widget_modules/build/build.module';
import {RepoModule} from '../widget_modules/repo/repo.module';
import {DeployModule} from '../widget_modules/deploy/deploy.module';
import {FeatureModule} from '../widget_modules/feature/feature.module';
import {InfraScanModule} from '../widget_modules/infra-scan/infra-scan.module';
import {ProductModule} from '../widget_modules/product/product.module';

@NgModule({
  declarations: [
    DashboardViewComponent,
    DasboardNavbarComponent
  ],
  imports: [
    SharedModule,
    ScreenDashboardRoutingModule,
    SecurityScanModule,
    StaticAnalysisModule,
    OpensourceScanModule,
    TestModule,
    BuildModule,
    RepoModule,
    DeployModule,
    FeatureModule,
    InfraScanModule,
    ProductModule
  ],
  entryComponents: [
  ]
})
export class ScreenDashboardModule { }
