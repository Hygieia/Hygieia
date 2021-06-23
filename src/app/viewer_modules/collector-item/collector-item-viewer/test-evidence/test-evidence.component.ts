import {Component, OnInit} from '@angular/core';
import {MatTableDataSource} from '@angular/material/table';
import {BaseEvidenceComponent} from '../base-evidence/base-evidence.component';
import {ITest} from '../../../../widget_modules/test/interfaces';

@Component({
  selector: 'app-test-evidence',
  templateUrl: './test-evidence.component.html',
  styleUrls: ['./test-evidence.component.scss']
})
export class TestEvidenceComponent extends BaseEvidenceComponent implements OnInit {
  displayedColumns = ['executionId', 'type', 'timestamp', 'startTime', 'endTime', 'successCount', 'totalCount'];
  dataSource: MatTableDataSource<ITest>;

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
