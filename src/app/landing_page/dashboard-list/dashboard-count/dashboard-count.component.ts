import { Component, OnInit } from "@angular/core";
import { DashboardService } from "../../../shared/dashboard.service";
import { take } from "rxjs/operators";

export interface IPieData {
  name: string;
  value: number;
}

@Component({
  selector: "app-dashboard-count",
  templateUrl: "./dashboard-count.component.html",
  styleUrls: ["./dashboard-count.component.scss"],
})
export class DashboardCountComponent implements OnInit {
  dCount: IPieData[] = [];
  view: any[] = [450, 200];

  // options
  gradient = true;
  showLegend = false;
  label = " Total dashboards";

  colorScheme = {
    domain: ["green", "brown"],
  };

  constructor(private dashboardService: DashboardService) {
    this.loadCounts();
  }

  ngOnInit(): void {}

  private loadCounts() {
    const counts = new Set();
    this.dashboardService.dashboardCountConfig$
      .pipe(take(2))
      .subscribe((count) => {
        counts.add(count);
        this.dCount = [...counts] as IPieData[];
      });
  }
}
