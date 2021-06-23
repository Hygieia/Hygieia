import {Component, OnInit} from '@angular/core';
import {MatTableDataSource} from '@angular/material/table';
import {BaseEvidenceComponent} from '../base-evidence/base-evidence.component';
import {IDeploy} from '../../../../widget_modules/deploy/interfaces';

@Component({
  selector: 'app-deployment-evidence',
  templateUrl: './deployment-evidence.component.html',
  styleUrls: ['./deployment-evidence.component.scss']
})
export class DeploymentEvidenceComponent extends BaseEvidenceComponent implements OnInit {
  displayedColumns = ['name', 'url'];
  dataSource: MatTableDataSource<IDeploy>;

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
