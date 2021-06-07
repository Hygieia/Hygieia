import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ComponentFactoryResolver,
  OnDestroy,
  OnInit,
  ViewChild,
} from "@angular/core";
import { of, Subscription } from "rxjs";
import { distinctUntilChanged, startWith, switchMap } from "rxjs/operators";
import {
  IClickListData,
  IClickListItemBuild,
  IClickListItem,
} from "src/app/shared/charts/click-list/click-list-interfaces";
import { DashStatus } from "src/app/shared/dash-status/DashStatus";
import { DashboardService } from "src/app/shared/dashboard.service";
import { LayoutDirective } from "src/app/shared/layouts/layout.directive";
import { TwoByTwoLayoutComponent } from "src/app/shared/layouts/two-by-two-layout/two-by-two-layout.component";
import { WidgetComponent } from "src/app/shared/widget/widget.component";
import { BuildDetailComponent } from "../build-detail/build-detail.component";
import { BuildService } from "../build.service";
import { IBuild } from "../interfaces";
import { BUILD_CHARTS, OLD_BUILD_CHARTS } from "./build-charts";
// @ts-ignore
import moment from "moment";
import { groupBy } from "lodash";

import { WidgetState } from "../../../shared/widget-header/widget-state";

@Component({
  selector: "app-build-widget",
  templateUrl: "./build-widget.component.html",
  styleUrls: ["./build-widget.component.scss"],
})
export class BuildWidgetComponent
  extends WidgetComponent
  implements OnInit, AfterViewInit, OnDestroy {
  private readonly BUILDS_PER_DAY_TIME_RANGE = 14;
  private readonly TOTAL_BUILD_COUNTS_TIME_RANGES = [7, 14];

  private buildTimeThreshold: number;
  private readonly useOldTotalBuildCharts = false;

  // Default build time threshold
  private readonly BUILD_TIME_THRESHOLD = 900000;

  // Reference to the subscription used to refresh the widget
  private intervalRefreshSubscription: Subscription;

  @ViewChild(LayoutDirective, { static: false })
  childLayoutTag: LayoutDirective;

  constructor(
    componentFactoryResolver: ComponentFactoryResolver,
    cdr: ChangeDetectorRef,
    dashboardService: DashboardService,
    private buildService: BuildService
  ) {
    super(componentFactoryResolver, cdr, dashboardService);
  }

  // Initialize the widget and set layout and charts.
  ngOnInit() {
    this.widgetId = "build0";
    this.layout = TwoByTwoLayoutComponent;
    // Chart configuration moved to external file
    if (this.useOldTotalBuildCharts) {
      this.charts = OLD_BUILD_CHARTS;
    } else {
      this.charts = BUILD_CHARTS;
    }

    this.auditType = "";
    this.init();
  }

  // After the view is ready start the refresh interval.
  ngAfterViewInit() {
    this.startRefreshInterval();
  }

  ngOnDestroy() {
    this.stopRefreshInterval();
  }

  // Start a subscription to the widget configuration for this widget and refresh the graphs each
  // cycle.
  startRefreshInterval() {
    this.intervalRefreshSubscription = this.dashboardService.dashboardRefresh$
      .pipe(
        startWith(-1), // Refresh this widget separate from dashboard (ex. config is updated)
        distinctUntilChanged(), // If dashboard is loaded the first time, ignore widget double refresh
        switchMap((_) => this.getCurrentWidgetConfig()),
        switchMap((widgetConfig) => {
          if (!widgetConfig) {
            return of([]);
          }
          this.widgetConfigExists = true;
          this.state = WidgetState.READY;
          this.buildTimeThreshold =
            1000 * 60 * widgetConfig.options.buildDurationThreshold;
          return this.buildService.fetchDetails(
            widgetConfig.componentId,
            this.BUILDS_PER_DAY_TIME_RANGE
          );
        })
      )
      .subscribe((result) => {
        this.hasData = result && result.length > 0;
        if (this.hasData) {
          this.loadCharts(result);
        } else {
          this.setDefaultIfNoData();
        }
      });
  }

  // Unsubscribe from the widget refresh observable, which stops widget updating.
  stopRefreshInterval() {
    if (this.intervalRefreshSubscription) {
      this.intervalRefreshSubscription.unsubscribe();
    }
  }

  loadCharts(result: IBuild[]) {
    this.generateBuildsPerDay(result);
    this.generateAverageBuildDuration(result);
    this.generateLatestBuilds(result);
    if (this.useOldTotalBuildCharts) {
      this.generateTotalBuildCounts(result);
    } else {
      this.newGenerateTotalBuildCounts(result);
    }

    super.loadComponent(this.childLayoutTag);
  }

  // *********************** BUILDS PER DAY ****************************

  private generateBuildsPerDay(result: IBuild[]) {
    const startDate = this.toMidnight(new Date());
    startDate.setDate(startDate.getDate() - this.BUILDS_PER_DAY_TIME_RANGE + 1);
    const allBuilds = result.filter(
      (build) =>
        this.checkBuildAfterDate(build, startDate) &&
        !this.checkBuildStatus(build, "InProgress")
    );
    const failedBuilds = result.filter(
      (build) =>
        this.checkBuildAfterDate(build, startDate) &&
        !this.checkBuildStatus(build, "InProgress") &&
        !this.checkBuildStatus(build, "Success")
    );
    this.charts[0].data.dataPoints[0].series = this.collectDataArray(
      this.countBuildsPerDay(allBuilds)
    );
    this.charts[0].data.dataPoints[1].series = this.collectDataArray(
      this.countBuildsPerDay(failedBuilds)
    );
  }

  private countBuildsPerDay(builds: IBuild[]): any[] {
    const dataArray = builds.map((build) => {
      return {
        statusText: build.buildStatus,
        subtitles: [new Date(build.endTime)],
        time: build.endTime,
        url: build.buildUrl,
        number: build.number,
      };
    });
    return dataArray;
  }

  private collectDataArray(content: any[]) {
    const dataArrayToSend = [];
    const groupedResults = groupBy(content, (result) =>
      moment(new Date(result.time), "DD/MM/YYYY").startOf("day")
    );
    for (const key of Object.keys(groupedResults)) {
      dataArrayToSend.push({
        name: new Date(key),
        value: groupedResults[key].length,
        data: groupedResults[key],
      });
    }
    return dataArrayToSend;
  }

  // *********************** LATEST BUILDS *****************************

  private generateLatestBuilds(result: IBuild[]) {
    const sorted = result
      .sort((a: IBuild, b: IBuild): number => {
        return a.endTime - b.endTime;
      })
      .reverse()
      .slice(0, 5);

    const buildStatusTable = {
      success: DashStatus.PASS,
      inprogress: DashStatus.IN_PROGRESS,
    };

    const latestBuildData = sorted.map((build) => {
      const buildStatus = buildStatusTable[build.buildStatus.toLowerCase()]
        ? buildStatusTable[build.buildStatus.toLowerCase()]
        : DashStatus.FAIL;
      const statusTextFitted = DashStatus.FAIL ? "!" : build.buildStatus;
      const baseLogUrl = build.buildUrl.split("/job")[0];
      return {
        status: buildStatus,
        buildStatus: build.buildStatus,
        statusText: statusTextFitted,
        title: `Build: ${build.number}`,
        collectorItemId: build.collectorItemId,
        subtitles: [new Date(build.endTime)],
        startTime: new Date(build.startTime),
        duration: build.endTime - build.startTime,
        url: build.buildUrl,
        baseLogUrl,
        number: build.number,
        stages: build.stages,
        buildId: build.id,
      } as IClickListItemBuild;
    });
    this.charts[1].data = {
      items: latestBuildData,
      clickableContent: BuildDetailComponent,
      clickableHeader: null,
    } as IClickListData;
  }

  // *********************** TOTAL BUILD COUNTS ************************

  private newGenerateTotalBuildCounts(result: IBuild[]) {
    const today = this.toMidnight(new Date());
    const bucketOneStartDate = this.toMidnight(new Date());
    const bucketTwoStartDate = this.toMidnight(new Date());
    bucketOneStartDate.setDate(
      bucketOneStartDate.getDate() - this.TOTAL_BUILD_COUNTS_TIME_RANGES[0] + 1
    );
    bucketTwoStartDate.setDate(
      bucketTwoStartDate.getDate() - this.TOTAL_BUILD_COUNTS_TIME_RANGES[1] + 1
    );

    const todayCount = result.filter((build) =>
      this.checkBuildAfterDate(build, today)
    ).length;
    const bucketOneCount = result.filter((build) =>
      this.checkBuildAfterDate(build, bucketOneStartDate)
    ).length;
    const bucketTwoCount = result.filter((build) =>
      this.checkBuildAfterDate(build, bucketTwoStartDate)
    ).length;

    const myItems: IClickListItem[] = [
      {
        status: null,
        statusText: null,
        title: String(todayCount),
        subtitles: ["Today"],
        url: null,
      },
      {
        status: null,
        statusText: null,
        title: String(bucketOneCount),
        subtitles: ["Last 7 Days"],
        url: null,
      },
      {
        status: null,
        statusText: null,
        title: String(bucketTwoCount),
        subtitles: ["Last 14 Days"],
        url: null,
      },
    ];
    this.charts[3].data = {
      items: myItems,
      clickableContent: null,
      clickableHeader: null,
    } as IClickListData;
  }

  private generateTotalBuildCounts(result: IBuild[]) {
    const today = this.toMidnight(new Date());
    const bucketOneStartDate = this.toMidnight(new Date());
    const bucketTwoStartDate = this.toMidnight(new Date());
    bucketOneStartDate.setDate(
      bucketOneStartDate.getDate() - this.TOTAL_BUILD_COUNTS_TIME_RANGES[0] + 1
    );
    bucketTwoStartDate.setDate(
      bucketTwoStartDate.getDate() - this.TOTAL_BUILD_COUNTS_TIME_RANGES[1] + 1
    );

    const todayCount = result.filter((build) =>
      this.checkBuildAfterDate(build, today)
    ).length;
    const bucketOneCount = result.filter((build) =>
      this.checkBuildAfterDate(build, bucketOneStartDate)
    ).length;
    const bucketTwoCount = result.filter((build) =>
      this.checkBuildAfterDate(build, bucketTwoStartDate)
    ).length;

    this.charts[3].data[0].value = todayCount;
    this.charts[3].data[1].value = bucketOneCount;
    this.charts[3].data[2].value = bucketTwoCount;
  }

  // *********************** AVERAGE BUILD DURATION *********************

  private generateAverageBuildDuration(result: IBuild[]) {
    const startDate = this.toMidnight(new Date());
    // Get threshold from the configuration, or use default
    const threshold = this.buildTimeThreshold
      ? this.buildTimeThreshold
      : this.BUILD_TIME_THRESHOLD;
    startDate.setDate(startDate.getDate() - this.BUILDS_PER_DAY_TIME_RANGE + 1);
    const successBuilds = result.filter(
      (build) =>
        this.checkBuildAfterDate(build, startDate) &&
        this.checkBuildStatus(build, "Success")
    );
    const averagedData = this.getAveragesByThreshold(
      successBuilds,
      startDate,
      threshold
    );
    const thresholdLine = this.getConstantLineSeries(startDate, threshold);
    this.charts[2].data[0] = averagedData.series;
    this.charts[2].colorScheme.domain = averagedData.colors;
    this.charts[2].data[1][0].series = thresholdLine;
  }

  private getAveragesByThreshold(
    builds: IBuild[],
    startDate: Date,
    threshold: number
  ): any {
    const dataBucket = {};
    const date = new Date(startDate.getTime());
    for (let i = 0; i < this.BUILDS_PER_DAY_TIME_RANGE; i++) {
      dataBucket[this.toMidnight(date).getTime()] = [];
      date.setDate(date.getDate() + 1);
    }

    // Group by build time
    builds.forEach((build) => {
      const index = this.toMidnight(new Date(build.endTime)).getTime();
      dataBucket[index].push(build.duration);
    });

    return this.getAveragesSeries(dataBucket, threshold);
  }

  private getAveragesSeries(dataBucket: any, threshold: number): any {
    const series = [];
    const colors = [];
    for (const key of Object.keys(dataBucket)) {
      const data = dataBucket[key];
      let value = 0;
      if (data && data.length) {
        value =
          data.reduce((a: number, b: number) => {
            return a + b;
          }) / data.length;
      }
      series.push({
        name: new Date(+key),
        value,
      });
      if (value > threshold) {
        colors.push("red");
      } else {
        colors.push("green");
      }
    }
    return { series, colors };
  }

  private getConstantLineSeries(startDate: Date, threshold: number): any {
    const date = new Date(startDate.getTime());
    const series = [];
    for (let i = 0; i < this.BUILDS_PER_DAY_TIME_RANGE; i++) {
      series.push({
        name: new Date(date.getTime()),
        value: threshold,
      });
      date.setDate(date.getDate() + 1);
    }
    return series;
  }

  //// *********************** HELPER UTILS *********************

  private toMidnight(date: Date): Date {
    date.setHours(0, 0, 0, 0);
    return date;
  }

  private checkBuildAfterDate(build: IBuild, date: Date): boolean {
    return build.endTime >= date.getTime();
  }

  private checkBuildStatus(build: IBuild, status: string): boolean {
    return build.buildStatus === status;
  }

  setDefaultIfNoData() {
    if (!this.hasData) {
      this.charts[0].data.dataPoints[0].series = [
        { name: new Date(), value: 0, data: "All Builds" },
      ];
      this.charts[0].data.dataPoints[1].series = [
        { name: new Date(), value: 0, data: "Failed Builds" },
      ];
      this.charts[1].data = { items: [{ title: "No Data Found" }] };
      this.charts[2].data[0] = [{ name: new Date(), value: 0 }];
      this.charts[2].colorScheme.domain = ["red"];
      this.charts[2].data[1][0].series = [{ name: "No Data Found", value: 0 }];
      if (this.charts[3].data[0] !== undefined) {
        this.charts[3].data[0].value = 0;
        this.charts[3].data[1].value = 0;
        this.charts[3].data[2].value = 0;
      }
    }
    super.loadComponent(this.childLayoutTag);
  }
}
