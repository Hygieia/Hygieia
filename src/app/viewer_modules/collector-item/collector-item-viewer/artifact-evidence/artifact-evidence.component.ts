import {Component, OnInit} from '@angular/core';
import {MatTableDataSource} from '@angular/material/table';
import {BaseEvidenceComponent} from '../base-evidence/base-evidence.component';
import {IAuditResult} from '../../interfaces';

@Component({
  selector: 'app-artifact-evidence',
  templateUrl: './artifact-evidence.component.html',
  styleUrls: ['./artifact-evidence.component.scss']
})
export class ArtifactEvidenceComponent extends BaseEvidenceComponent implements OnInit {
  displayedColumns = ['id', 'timestamp'];  // TODO: get the proper columns
  dataSource: MatTableDataSource<IAuditResult>; // TODO: get the proper interface name for IArtifact

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
