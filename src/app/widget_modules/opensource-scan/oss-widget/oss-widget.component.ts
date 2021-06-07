import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ComponentFactoryResolver,
  OnDestroy,
  OnInit,
  ViewChild
} from '@angular/core';
import {WidgetComponent} from '../../../shared/widget/widget.component';
import {DashboardService} from '../../../shared/dashboard.service';
import {OpensourceScanService} from '../opensource-scan.service';
import {distinctUntilChanged, startWith, switchMap} from 'rxjs/operators';
import {of, Subscription} from 'rxjs';
import {LayoutDirective} from '../../../shared/layouts/layout.directive';
import {OSS_CHARTS} from './oss-charts';
import {DashStatus} from '../../../shared/dash-status/DashStatus';
import {
  IClickListData,
  IClickListItemOSS
} from '../../../shared/charts/click-list/click-list-interfaces';
import {OSSDetailComponent} from '../oss-detail/oss-detail.component';
import {TwoByOneLayoutComponent} from '../../../shared/layouts/two-by-one-layout/two-by-one-layout.component';
import {IOpensourceScan, IThreat} from '../interfaces';
import {OSSDetailAllComponent} from '../oss-detail-all/oss-detail-all.component';
import {WidgetState} from '../../../shared/widget-header/widget-state';

@Component({
  selector: 'app-oss-widget',
  templateUrl: './oss-widget.component.html',
  styleUrls: ['./oss-widget.component.scss']
})
export class OSSWidgetComponent extends WidgetComponent implements OnInit, AfterViewInit, OnDestroy {

  private readonly OSS_MAX_CNT = 1;

  // Reference to the subscription used to refresh the widget
  private intervalRefreshSubscription: Subscription;

  @ViewChild(LayoutDirective, {static: false}) childLayoutTag: LayoutDirective;

  constructor(componentFactoryResolver: ComponentFactoryResolver,
              cdr: ChangeDetectorRef,
              dashboardService: DashboardService,
              private ossService: OpensourceScanService) {
    super(componentFactoryResolver, cdr, dashboardService);
  }

  ngOnInit() {
    this.widgetId = 'codeanalysis0';
    this.layout = TwoByOneLayoutComponent;
    this.charts = OSS_CHARTS;
    this.auditType = 'LIBRARY_POLICY';
    this.init();
  }

  // After the view is ready start the refresh interval.
  ngAfterViewInit() {
    this.startRefreshInterval();
  }

  ngOnDestroy() {
    this.stopRefreshInterval();
  }

  // Start a subscription to the widget configuration for this widget
  // and refresh the charts
  startRefreshInterval() {
    this.intervalRefreshSubscription = this.dashboardService.dashboardRefresh$.pipe(
      startWith(-1), // Refresh this widget seperate from dashboard (ex. config is updated)
      distinctUntilChanged(), // If dashboard is loaded the first time, ignore widget double refresh
      switchMap(_ => this.getCurrentWidgetConfig()),
      switchMap(widgetConfig => {
        if (!widgetConfig) {
          this.widgetConfigExists = false;
          return of([]);
        }
        this.widgetConfigExists = true;
        // check if collector item type is tied to dashboard
        // if true, set state to READY, otherwise keep at default CONFIGURE
        if (this.dashboardService.checkCollectorItemTypeExist('LibraryPolicy')) {
          this.state = WidgetState.READY;
        }
        return this.ossService.fetchDetails(widgetConfig.componentId, this.OSS_MAX_CNT);
      })).subscribe(result => {
        this.hasData = result && result.length > 0;
        if (this.hasData) {
          this.loadCharts(result[0]);
        } else {
          this.setDefaultIfNoData();
        }
      });

    // for quality widget, subscribe to updates from other quality components
    this.dashboardService.dashboardQualityConfig$.subscribe(result => {
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

  loadCharts(result: IOpensourceScan) {
    this.generateLicenseDetails(result);
    this.generateSecurityDetails(result);
    super.loadComponent(this.childLayoutTag);
  }

  generateLicenseDetails(result: IOpensourceScan) {
    if (!result || !result.threats || !result.threats.License) {
      this.charts[0].data = [];
      return;
    }

    let count = 0;
    let openCount = 0;

    const sorted = result.threats.License.sort((a: IThreat, b: IThreat): number => {
      return this.getDashStatus(a.level) - this.getDashStatus(b.level);
    }).reverse();

    const latestDetails = sorted.map(oss => {
        const ossStatus = this.getDashStatus(oss.level);
        const open = (oss.dispositionCounts.Open) ? oss.dispositionCounts.Open : 0;
        const ossStatusTitle = oss.level + ' (' + open + '/' + oss.count + ')';
        count += oss.count;
        openCount += open;

        return {
          status: ossStatus,
          statusText: oss.level,
          title: ossStatusTitle,
          subtitles: [],
          url: result.reportUrl,
          components: oss.components,
          lastUpdated: result.timestamp
        } as IClickListItemOSS;
      }
    );

    this.charts[0].title = 'License (' + openCount + '/' + count + ')';
    this.charts[0].data = {
      items: latestDetails,
      clickableContent: OSSDetailComponent,
      clickableHeader: OSSDetailAllComponent
    } as IClickListData;
  }


  generateSecurityDetails(result: IOpensourceScan) {
    if (!result || !result.threats || !result.threats.Security) {
      this.charts[1].data = [];
      return;
    }

    let count = 0;
    let openCount = 0;

    const sorted = result.threats.Security.sort((a: IThreat, b: IThreat): number => {
      return this.getDashStatus(a.level) - this.getDashStatus(b.level);
    }).reverse();

    const latestDetails = sorted.map(oss => {
        const ossStatus = this.getDashStatus(oss.level);
        const open = (oss.dispositionCounts.Open) ? oss.dispositionCounts.Open : 0;
        const ossStatusTitle = oss.level + ' (' + open + '/' + oss.count + ')';
        count += oss.count;
        openCount += open;

        return {
          status: ossStatus,
          statusText: oss.level,
          title: ossStatusTitle,
          subtitles: [],
          url: result.reportUrl,
          components: oss.components,
          lastUpdated: result.timestamp
        } as IClickListItemOSS;
      }
    );

    this.charts[1].title = 'Security (' + openCount + '/' + count + ')';
    this.charts[1].data = {
      items: latestDetails,
      clickableContent: OSSDetailComponent,
      clickableHeader: OSSDetailAllComponent
    } as IClickListData;
  }

  getDashStatus(level: string) {
    switch (level.toLowerCase()) {
      case 'critical':
        return DashStatus.CRITICAL;
      case 'high':
        return DashStatus.UNAUTH;
      case 'medium':
        return DashStatus.WARN;
      case 'low' :
        return DashStatus.IN_PROGRESS;
      default:
        return DashStatus.PASS;
    }
  }

  setDefaultIfNoData() {
    if (!this.hasData) {
      this.charts[0].data = { items: [{ title: 'No Data Found' }]};
      this.charts[1].data = { items: [{ title: 'No Data Found' }]};
    }
    super.loadComponent(this.childLayoutTag);
  }
}
