import {
  AfterViewInit,
  Component,
  OnDestroy,
  OnInit,
  ViewChild,
} from "@angular/core";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { MatTableDataSource } from "@angular/material/table";
import { Subscription } from "rxjs";
import { ActivatedRoute, Router } from "@angular/router";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { CollectorItemService } from "../../collector-item.service";
import { CollectorItemDetailsComponent } from "../collector-item-details/collector-item-details.component";

@Component({
  selector: "app-base-evidence",
  templateUrl: "./base-evidence.component.html",
  styleUrls: ["./base-evidence.component.scss"],
})
export class BaseEvidenceComponent implements OnInit, AfterViewInit, OnDestroy {
  displayedColumns = ["id", "timestamp"];
  dataSource: MatTableDataSource<any>;

  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: false }) sort: MatSort;

  // Reference to the subscription used to refresh the viewer
  protected intervalRefreshSubscription: Subscription;

  protected collectorEvidenceDetails: any[];
  dashboardTitle: string;
  protected componentId: string;
  collector: string;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private modalService: NgbModal,
    protected ciViewerService: CollectorItemService
  ) {}

  ngOnInit() {
    // Assign the data to the data source for the table to render
    this.dataSource = new MatTableDataSource(this.collectorEvidenceDetails);

    this.dashboardTitle = this.route.snapshot.paramMap.get("dashboardTitle");
    this.componentId = this.route.snapshot.paramMap.get("componentId");
    if (this.route.snapshot.url) {
      this.collector = this.route.snapshot.url[0].path;
    }
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // defaults to lowercase matches
    this.dataSource.filter = filterValue;
  }

  ngOnDestroy() {
    if (this.intervalRefreshSubscription) {
      // Unsubscribe from the refresh observable, which stops updating.
      this.intervalRefreshSubscription.unsubscribe();
    }
  }

  openDetails(ci: any) {
    const modalRef = this.modalService.open(CollectorItemDetailsComponent);
    modalRef.componentInstance.collector = this.collector;
    modalRef.componentInstance.collectorDetails = ci;
  }

  openCollectorViewer(dTitle: string) {
    this.router.navigate(["/collectorItem/viewer", { title: dTitle }]);
  }
}
