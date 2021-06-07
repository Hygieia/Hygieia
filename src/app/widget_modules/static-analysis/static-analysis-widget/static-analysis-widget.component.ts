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
  IClickListItem,
  IClickListItemStaticAnalysis,
} from "src/app/shared/charts/click-list/click-list-interfaces";
import { DashboardService } from "src/app/shared/dashboard.service";
import { LayoutDirective } from "src/app/shared/layouts/layout.directive";
import { TwoByTwoLayoutComponent } from "src/app/shared/layouts/two-by-two-layout/two-by-two-layout.component";
import { WidgetComponent } from "src/app/shared/widget/widget.component";
import { StaticAnalysisService } from "../static-analysis.service";
import {
  ViolationsChart,
  CARD_STATICANALYSIS_CHARTS,
  CLICKTAB_STATICANALYSIS_CHARTS,
  PIE_STATICANALYSIS_CHARTS,
} from "./static-analysis-charts";
import { IStaticAnalysis } from "../interfaces";
import { StaticAnalysisDetailComponent } from "../static-analysis-detail/static-analysis-detail.component";
import { isUndefined } from "util";
import { WidgetState } from "../../../shared/widget-header/widget-state";

@Component({
  selector: "app-static-analysis-widget",
  templateUrl: "./static-analysis-widget.component.html",
  styleUrls: ["./static-analysis-widget.component.scss"],
})
export class StaticAnalysisWidgetComponent
  extends WidgetComponent
  implements OnInit, AfterViewInit, OnDestroy {
  private readonly violationsChartUsed: ViolationsChart =
    ViolationsChart.PIE_CHART;

  // Code Quality Metric Field Names
  public readonly staticAnalysisMetrics = {
    // quality gate
    qualityGateDetails: "quality_gate_details",
    alertStatus: "alert_status",
    techDebt: "sqale_index",
    // violations
    totalIssues: "violations",
    blockerViolations: "blocker_violations",
    criticalViolations: "critical_violations",
    majorViolations: "major_violations",
    // coverage
    codeCoverage: "coverage",
    lineCoverage: "line_coverage",
    numCodeLines: "ncloc",
    // vulnerabilities
    newVulnerabilities: "new_vulnerabilities",
    // unit test metrics
    testSuccesses: "test_success_density",
    testFailures: "test_failures",
    testErrors: "test_errors",
    totalTests: "tests",
  };

  // Code Quality Quality Gate Status Names
  public readonly qualityGateStatuses = {
    OK: "OK",
    WARN: "WARN",
    FAILED: "ERROR",
  };

  // Reference to the subscription used to refresh the widget
  private intervalRefreshSubscription: Subscription;

  @ViewChild(LayoutDirective, { static: false })
  childLayoutTag: LayoutDirective;

  constructor(
    componentFactoryResolver: ComponentFactoryResolver,
    cdr: ChangeDetectorRef,
    dashboardService: DashboardService,
    private staticAnalysisService: StaticAnalysisService
  ) {
    super(componentFactoryResolver, cdr, dashboardService);
  }

  // Initialize the widget and set layout and charts.
  ngOnInit() {
    this.widgetId = "codeanalysis0";
    this.layout = TwoByTwoLayoutComponent;
    if (this.violationsChartUsed == ViolationsChart.PIE_CHART) {
      this.charts = PIE_STATICANALYSIS_CHARTS;
    } else if (this.violationsChartUsed == ViolationsChart.CARD_CHART) {
      this.charts = CARD_STATICANALYSIS_CHARTS;
    } else {
      // ViolationsChart.CLICK_TABLE
      this.charts = CLICKTAB_STATICANALYSIS_CHARTS;
    }
    this.auditType = "CODE_QUALITY";
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
        startWith(-1), // Refresh this widget seperate from dashboard (ex. config is updated)
        distinctUntilChanged(), // If dashboard is loaded the first time, ignore widget double refresh
        switchMap((_) => this.getCurrentWidgetConfig()),
        switchMap((widgetConfig) => {
          if (!widgetConfig) {
            this.widgetConfigExists = false;
            return of([]);
          }
          this.widgetConfigExists = true;
          // check if collector item type is tied to dashboard
          // if true, set state to READY, otherwise keep at default CONFIGURE
          if (
            this.dashboardService.checkCollectorItemTypeExist("CodeQuality")
          ) {
            this.state = WidgetState.READY;
          }
          return this.staticAnalysisService.fetchStaticAnalysis(
            widgetConfig.componentId,
            1
          );
        })
      )
      .subscribe((result) => {
        this.hasData = result && result.length > 0;
        if (this.hasData) {
          this.loadCharts(result[0]);
        } else {
          // code quality collector item could not be found
          this.setDefaultIfNoData();
        }
      });

    // for quality widget, subscribe to updates from other quality components
    this.dashboardService.dashboardQualityConfig$.subscribe((result) => {
      if (result) {
        this.widgetConfigSubject.next(result);
      } else {
        this.widgetConfigSubject.next();
      }
    });
  }

  // Unsubscribe from the widget refresh observable, which stops widget updating.
  stopRefreshInterval() {
    if (this.intervalRefreshSubscription) {
      this.intervalRefreshSubscription.unsubscribe();
    }
  }

  loadCharts(result: IStaticAnalysis) {
    this.generateProjectDetails(result);
    this.generateViolations(result);
    this.generateCoverage(result);
    this.generateUnitTestMetrics(result);
    super.loadComponent(this.childLayoutTag);
  }

  // *********************** DETAILS/QUALITY *********************

  generateProjectDetails(result: IStaticAnalysis) {
    const qualityGate = result.metrics.find(
      (metric) => metric.name === this.staticAnalysisMetrics.alertStatus
    );
    const techDebt = result.metrics.find(
      (metric) => metric.name === this.staticAnalysisMetrics.techDebt
    );

    const latestDetails = [
      {
        status: null,
        statusText: "",
        title: "Name",
        subtitles: [result.name],
      },
      {
        status: null,
        statusText: "",
        title: "Version",
        subtitles: [result.version],
      },
      {
        status: null,
        statusText: "",
        title: "Quality Gate",
        subtitles: [isUndefined(qualityGate) ? "" : qualityGate.value],
      },
      {
        status: null,
        statusText: "",
        title: "Technical Debt",
        subtitles: [isUndefined(techDebt) ? "" : techDebt.formattedValue],
      },
    ] as IClickListItem[];

    this.charts[0].data = {
      items: latestDetails,
      clickableContent: null,
      clickableHeader: StaticAnalysisDetailComponent,
      url: result.url,
      version: result.version,
      name: result.name,
      timestamp: new Date(result.timestamp),
    } as IClickListItemStaticAnalysis;
  }

  // *********************** COVERAGE (CODE) ****************************

  generateCoverage(result: IStaticAnalysis) {
    const coverage = result.metrics.find(
      (metric) => metric.name === this.staticAnalysisMetrics.codeCoverage
    );
    const loc = result.metrics.find(
      (metric) => metric.name === this.staticAnalysisMetrics.numCodeLines
    );

    this.charts[1].data.results[0].value = isUndefined(coverage)
      ? 0
      : parseFloat(coverage.value);
    this.charts[1].data.customLabelValue = isUndefined(loc)
      ? 0
      : parseFloat(loc.value);
  }

  // *********************** VIOLATIONS *****************************

  getNewViolations(
    blockerValue,
    criticalValue,
    majorValue,
    totalValue
  ): IClickListItem[] {
    const myItems: IClickListItem[] = [
      {
        status: null,
        statusText: null,
        title: String(blockerValue),
        subtitles: ["Blocker Violations"],
        url: null,
      },
      {
        status: null,
        statusText: null,
        title: String(criticalValue),
        subtitles: ["Critical Violations"],
        url: null,
      },
      {
        status: null,
        statusText: null,
        title: String(majorValue),
        subtitles: ["Major Violations"],
        url: null,
      },
      {
        status: null,
        statusText: null,
        title: String(totalValue),
        subtitles: ["Total Issues"],
        url: null,
      },
    ];

    return myItems;
  }

  generateViolations(result: IStaticAnalysis) {
    const blocker = result.metrics.find(
      (metric) => metric.name === this.staticAnalysisMetrics.blockerViolations
    );
    const critical = result.metrics.find(
      (metric) => metric.name === this.staticAnalysisMetrics.criticalViolations
    );
    const major = result.metrics.find(
      (metric) => metric.name === this.staticAnalysisMetrics.majorViolations
    );
    const total = result.metrics.find(
      (metric) => metric.name === this.staticAnalysisMetrics.totalIssues
    );

    const blockerValue =
      blocker === undefined || blocker === null ? 0 : parseFloat(blocker.value);
    const criticalValue =
      critical === undefined || critical === null
        ? 0
        : parseFloat(critical.value);
    const majorValue =
      major === undefined || major === null ? 0 : parseFloat(major.value);
    const totalValue =
      total === undefined || total === null ? 0 : parseFloat(total.value);

    if (this.violationsChartUsed == ViolationsChart.CLICK_TABLE) {
      const myItems = this.getNewViolations(
        blockerValue,
        criticalValue,
        majorValue,
        totalValue
      );
      this.charts[2].data = {
        items: myItems,
        clickableContent: null,
        clickableHeader: null,
        colorScheme: [
          "#ADFF2F",
          "#FF0000",
          "#FF4500",
          "#FF6347",
          "#4169E1",
          "#DC143C",
        ],
        //  // greenyellow, red, orangered, tomato, royale blue, crimson, maroon can not be used '#800000',
      } as IClickListData;
    } else if (this.violationsChartUsed == ViolationsChart.CARD_CHART) {
      this.charts[2].data[0].value = isUndefined(blocker)
        ? 0
        : parseFloat(blocker.value);
      this.charts[2].data[1].value = isUndefined(critical)
        ? 0
        : parseFloat(critical.value);
      this.charts[2].data[2].value = isUndefined(major)
        ? 0
        : parseFloat(major.value);
      this.charts[2].data[3].value = isUndefined(total)
        ? 0
        : parseFloat(total.value);
    } else {
      // ViolationsChart.PIE_CHART
      this.charts[2].data.results[0].value = blockerValue;
      this.charts[2].data.results[1].value = criticalValue;
      this.charts[2].data.results[2].value = majorValue;
      this.charts[2].data.results[3].value =
        totalValue - blockerValue - criticalValue - majorValue;
      this.charts[2].data.designatedTotal = totalValue;

      this.charts[2].data.customLabelValue = totalValue;
    }
  }

  // *********************** UNIT TEST METRICS ****************************

  generateUnitTestMetrics(result: IStaticAnalysis) {
    const testSuccesses = result.metrics.find(
      (metric) => metric.name === this.staticAnalysisMetrics.testSuccesses
    );
    const testFailures = result.metrics.find(
      (metric) => metric.name === this.staticAnalysisMetrics.testFailures
    );
    const testErrors = result.metrics.find(
      (metric) => metric.name === this.staticAnalysisMetrics.testErrors
    );
    const totalTests = result.metrics.find(
      (metric) => metric.name === this.staticAnalysisMetrics.totalTests
    );

    const latestDetails = [
      {
        status: null,
        statusText: "",
        title: "Success",
        subtitles: [
          isUndefined(testSuccesses)
            ? ""
            : (parseFloat(testSuccesses.value) / 100) *
              parseInt(totalTests.value, 10),
        ],
      },
      {
        status: null,
        statusText: "",
        title: "Failures",
        subtitles: [isUndefined(testFailures) ? "" : testFailures.value],
      },
      {
        status: null,
        statusText: "",
        title: "Errors",
        subtitles: [isUndefined(testErrors) ? "" : testErrors.value],
      },
      {
        status: null,
        statusText: "",
        title: "Total Tests",
        subtitles: [isUndefined(totalTests) ? "" : totalTests.value],
      },
    ] as IClickListItem[];

    this.charts[3].data = {
      items: latestDetails,
      clickableContent: null,
      clickableHeader: null,
    } as IClickListData;
  }

  setDefaultIfNoData() {
    if (!this.hasData) {
      this.charts[0].data = { items: [{ title: "No Data Found" }] };
      this.charts[1].data.results[0].value = 0;
      this.charts[1].data.customLabelValue = 0;
      if (this.violationsChartUsed == ViolationsChart.CLICK_TABLE) {
        this.charts[2].data = {} as IClickListData;
      } else if (this.violationsChartUsed == ViolationsChart.CARD_CHART) {
        this.charts[2].data[0].value = 0;
        this.charts[2].data[1].value = 0;
        this.charts[2].data[2].value = 0;
        this.charts[2].data[3].value = 0;
      } else {
        this.charts[3].data.result[0].value = 0;
        this.charts[3].data.result[1].value = 0;
        this.charts[3].data.result[2].value = 0;
        this.charts[3].data.customLabelValue = 0;
      }
      this.charts[3].data = { items: [{ title: "No Data Found" }] };
    }
    super.loadComponent(this.childLayoutTag);
  }
}
