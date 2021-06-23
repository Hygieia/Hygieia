import {Component, OnInit} from '@angular/core';
import {MatTableDataSource} from '@angular/material/table';
import {BaseEvidenceComponent} from '../base-evidence/base-evidence.component';
import {IAuditResult} from '../../interfaces';

@Component({
  selector: 'app-audit-evidence',
  templateUrl: './audit-evidence.component.html',
  styleUrls: ['./audit-evidence.component.scss']
})
export class AuditEvidenceComponent extends BaseEvidenceComponent implements OnInit {
  displayedColumns = ['id', 'auditType', 'auditTypeStatus', 'auditStatus', 'timestamp'];
  dataSource: MatTableDataSource<IAuditResult>;

  ngOnInit() {
    super.ngOnInit();
    this.intervalRefreshSubscription = this.ciViewerService.getCollectorItemDetails(
      this.dashboardTitle, this.componentId, this.collector).subscribe(response => {
        this.collectorEvidenceDetails = response;
        this.dataSource.data = this.collectorEvidenceDetails;
        this.dataSource.sort = this.sort;
      });
  }
}
