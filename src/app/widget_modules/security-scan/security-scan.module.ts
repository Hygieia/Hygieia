import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SecurityScanRoutingModule } from './security-scan-routing.module';
import {ReactiveFormsModule} from '@angular/forms';
import {SharedModule} from '../../shared/shared.module';
import {SecurityScanWidgetComponent} from './security-scan-widget/security-scan-widget.component';
import {SecurityScanConfigComponent} from './security-scan-config/security-scan-config.component';
import {SecurityScanDeleteFormComponent} from './security-scan-delete-form/security-scan-delete-form.component';
import {NgbTypeaheadModule} from '@ng-bootstrap/ng-bootstrap';

@NgModule({
  declarations: [SecurityScanWidgetComponent, SecurityScanConfigComponent, SecurityScanDeleteFormComponent],
  entryComponents: [SecurityScanWidgetComponent, SecurityScanConfigComponent, SecurityScanDeleteFormComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    SharedModule,
    SecurityScanRoutingModule,
    NgbTypeaheadModule
  ],
  exports: [SecurityScanWidgetComponent, SecurityScanConfigComponent]
})
export class SecurityScanModule { }
