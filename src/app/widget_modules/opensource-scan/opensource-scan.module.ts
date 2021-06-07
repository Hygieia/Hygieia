import { NgModule } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { OSSWidgetComponent } from './oss-widget/oss-widget.component';
import { OSSDetailComponent } from './oss-detail/oss-detail.component';
import { OSSConfigFormComponent } from './oss-config-form/oss-config-form.component';
import {CommonModule} from '@angular/common';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import { OSSDetailAllComponent } from './oss-detail-all/oss-detail-all.component';
import {OSSDeleteFormComponent} from './oss-delete-form/oss-delete-form.component';

@NgModule({
  declarations: [OSSWidgetComponent, OSSDetailComponent, OSSConfigFormComponent, OSSDetailAllComponent, OSSDeleteFormComponent],
  entryComponents: [OSSWidgetComponent, OSSDetailComponent, OSSConfigFormComponent, OSSDetailAllComponent, OSSDeleteFormComponent],
  imports: [
    CommonModule,
    NgbModule,
    SharedModule
  ],
})
export class OpensourceScanModule { }
