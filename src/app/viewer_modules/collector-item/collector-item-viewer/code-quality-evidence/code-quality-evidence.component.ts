import {Component, OnInit} from '@angular/core';
import {MatTableDataSource} from '@angular/material/table';
import {BaseEvidenceComponent} from '../base-evidence/base-evidence.component';
import {IStaticAnalysis} from '../../../../widget_modules/static-analysis/interfaces';

@Component({
  selector: 'app-code-quality-evidence',
  templateUrl: './code-quality-evidence.component.html',
  styleUrls: ['./code-quality-evidence.component.scss']
})
export class CodeQualityEvidenceComponent extends BaseEvidenceComponent implements OnInit {
  displayedColumns = ['id', 'name', 'url', 'version', 'timestamp'];
  dataSource: MatTableDataSource<IStaticAnalysis>;

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

