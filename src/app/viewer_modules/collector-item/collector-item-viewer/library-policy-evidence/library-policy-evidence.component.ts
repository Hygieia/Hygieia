import {Component, OnInit} from '@angular/core';
import {MatTableDataSource} from '@angular/material/table';
import {BaseEvidenceComponent} from '../base-evidence/base-evidence.component';
import {IOpensourceScan} from '../../../../widget_modules/opensource-scan/interfaces';

@Component({
  selector: 'app-library-policy-evidence',
  templateUrl: './library-policy-evidence.component.html',
  styleUrls: ['./library-policy-evidence.component.scss']
})
export class LibraryPolicyEvidenceComponent extends BaseEvidenceComponent implements OnInit {
  displayedColumns = ['id', 'scanState', 'evaluationTimestamp', 'reportUrl'];
  dataSource: MatTableDataSource<IOpensourceScan>;

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
