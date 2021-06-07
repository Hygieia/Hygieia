import { Component, ViewEncapsulation } from "@angular/core";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { dataTypeMap } from "@swimlane/ngx-ui";
import { DashStatus } from "../../dash-status/DashStatus";
import { DetailModalComponent } from "../../modals/detail-modal/detail-modal.component";
import { ChartComponent } from "../chart/chart.component";
import { IClickListData, IClickListItem } from "./click-list-interfaces";

@Component({
  selector: "app-click-list",
  templateUrl: "./click-list.component.html",
  styleUrls: ["./click-list.component.scss"],
  encapsulation: ViewEncapsulation.None,
})
export class ClickListComponent extends ChartComponent {
  DashStatus: typeof DashStatus = DashStatus;

  constructor(private modalService: NgbModal) {
    super();
  }

  getStyle(iterIndex: number): any {
    if (
      this.data &&
      this.data.colorScheme &&
      iterIndex < this.data.colorScheme.length
    ) {
      return { color: this.data.colorScheme[iterIndex] };
    }
    return {};
  }
  openDetailView(item: IClickListItem) {
    if (this.data && (this.data as IClickListData).clickableContent) {
      const modalRef = this.modalService.open(DetailModalComponent);
      modalRef.componentInstance.title =
        item && item.title ? item.title : "Details";
      modalRef.componentInstance.detailData = item;
      (modalRef.componentInstance as DetailModalComponent).detailView = this.data.clickableContent;
    }
  }

  openHeaderView(items: IClickListItem[], title: string) {
    if (this.data && (this.data as IClickListData).clickableHeader) {
      const modalRef = this.modalService.open(DetailModalComponent);
      modalRef.componentInstance.title = title ? title : "Details";
      modalRef.componentInstance.detailData = items;
      (modalRef.componentInstance as DetailModalComponent).detailView = this.data.clickableHeader;
    }
  }

  isDate(obj): boolean {
    return obj instanceof Date;
  }
}
