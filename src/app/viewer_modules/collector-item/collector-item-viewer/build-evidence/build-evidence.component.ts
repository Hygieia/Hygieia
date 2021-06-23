import {Component, OnInit} from '@angular/core';
import {MatTableDataSource} from '@angular/material/table';
import {BaseEvidenceComponent} from '../base-evidence/base-evidence.component';
import {IBuild} from '../../../../widget_modules/build/interfaces';

@Component({
  selector: 'app-build-evidence',
  templateUrl: './build-evidence.component.html',
  styleUrls: ['./build-evidence.component.scss']
})
export class BuildEvidenceComponent extends BaseEvidenceComponent implements OnInit {
  displayedColumns = ['id', 'timestamp', 'startTime', 'endTime', 'buildStatus'];
  dataSource: MatTableDataSource<IBuild>;

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
