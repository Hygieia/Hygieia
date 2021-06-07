import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { NgbActiveModal, NgbModule } from "@ng-bootstrap/ng-bootstrap";

import { CollectorItemRoutingModule } from "./collector-item-routing.module";
import { GenericEvidenceComponent } from "./collector-item-viewer/generic-evidence/generic-evidence.component";
import { TestEvidenceComponent } from "./collector-item-viewer/test-evidence/test-evidence.component";
import { ArtifactEvidenceComponent } from "./collector-item-viewer/artifact-evidence/artifact-evidence.component";
import { AuditEvidenceComponent } from "./collector-item-viewer/audit-evidence/audit-evidence.component";
import { BuildEvidenceComponent } from "./collector-item-viewer/build-evidence/build-evidence.component";
import { CodeQualityEvidenceComponent } from "./collector-item-viewer/code-quality-evidence/code-quality-evidence.component";
import { DeploymentEvidenceComponent } from "./collector-item-viewer/deployment-evidence/deployment-evidence.component";
import { LibraryPolicyEvidenceComponent } from "./collector-item-viewer/library-policy-evidence/library-policy-evidence.component";
import { SCMEvidenceComponent } from "./collector-item-viewer/scm-evidence/scm-evidence.component";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatPaginatorModule } from "@angular/material/paginator";
import { MatSortModule } from "@angular/material/sort";
import { MatTableModule } from "@angular/material/table";
// tslint:disable-next-line:max-line-length
import { StaticSecurityScanEvidenceComponent } from "./collector-item-viewer/static-security-scan-evidence/static-security-scan-evidence.component";
import { BaseEvidenceComponent } from "./collector-item-viewer/base-evidence/base-evidence.component";
import { CollectorItemService } from "./collector-item.service";
import { NbCardModule, NbInputModule } from "@nebular/theme";
import { ReactiveFormsModule } from "@angular/forms";

@NgModule({
  declarations: [
    CollectorItemRoutingModule.components,
    GenericEvidenceComponent,
    TestEvidenceComponent,
    ArtifactEvidenceComponent,
    AuditEvidenceComponent,
    BuildEvidenceComponent,
    CodeQualityEvidenceComponent,
    DeploymentEvidenceComponent,
    LibraryPolicyEvidenceComponent,
    SCMEvidenceComponent,
    StaticSecurityScanEvidenceComponent,
    BaseEvidenceComponent,
  ],
  imports: [
    CollectorItemRoutingModule,
    CommonModule,
    NgbModule,
    MatInputModule,
    MatFormFieldModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    NbInputModule,
    NbCardModule,
    ReactiveFormsModule,
  ],
  providers: [
    CollectorItemRoutingModule.components,
    CollectorItemService,
    NgbActiveModal,
  ],
  exports: [],
})
export class CollectorItemModule {}
