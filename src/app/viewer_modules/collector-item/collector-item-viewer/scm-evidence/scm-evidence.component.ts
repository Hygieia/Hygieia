import {Component, OnInit} from '@angular/core';
import {MatTableDataSource} from '@angular/material/table';
import {BaseEvidenceComponent} from '../base-evidence/base-evidence.component';
import {IRepo} from '../../../../widget_modules/repo/interfaces';

@Component({
  selector: 'app-scmevidence',
  templateUrl: './scm-evidence.component.html',
  styleUrls: ['./scm-evidence.component.scss']
})
export class SCMEvidenceComponent extends BaseEvidenceComponent implements OnInit {
  displayedColumns = ['id', 'scmAuthor', 'scmCommitTimestamp', 'mergeAuthor', 'mergedAt'];
  dataSource: MatTableDataSource<IRepo>;

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
