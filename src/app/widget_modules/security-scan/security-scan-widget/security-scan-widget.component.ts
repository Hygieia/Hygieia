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
import {SecurityScanService} from '../security-scan.service';
import {catchError, distinctUntilChanged, startWith, switchMap} from 'rxjs/operators';
import {LayoutDirective} from '../../../shared/layouts/layout.directive';
import {ISecurityScan} from '../security-scan-interfaces';
import {of, Subscription} from 'rxjs';
import {SECURITY_SCAN_CHARTS} from '../security-scan-widget/security-scan-charts';
import {
  IClickListData,
  IClickListItem,
} from '../../../shared/charts/click-list/click-list-interfaces';
import {OneChartLayoutComponent} from '../../../shared/layouts/one-chart-layout/one-chart-layout.component';
import {DashStatus} from '../../../shared/dash-status/DashStatus';
import {WidgetState} from '../../../shared/widget-header/widget-state';

@Component({
  selector: 'app-security-scan-widget',
  templateUrl: './security-scan-widget.component.html',
  styleUrls: ['./security-scan-widget.component.sass']
})
export class SecurityScanWidgetComponent extends WidgetComponent implements OnInit, AfterViewInit, OnDestroy {

  private intervalRefreshSubscription: Subscription;
  private params;

  @ViewChild(LayoutDirective, {static: true}) childLayoutTag: LayoutDirective;

  constructor(componentFactoryResolver: ComponentFactoryResolver,
              cdr: ChangeDetectorRef,
              dashboardService: DashboardService,
              private securityService: SecurityScanService) {
    super(componentFactoryResolver, cdr, dashboardService);
  }

  ngOnInit() {
    this.widgetId = 'codeanalysis0';
    this.layout = OneChartLayoutComponent;
    this.charts = SECURITY_SCAN_CHARTS;
    this.auditType = 'STATIC_SECURITY_ANALYSIS';
    this.init();
  }
  ngAfterViewInit() {
    this.startRefreshInterval();
  }

  ngOnDestroy() {
    this.stopRefreshInterval();
  }

  startRefreshInterval() {
    this.intervalRefreshSubscription = this.dashboardService.dashboardRefresh$.pipe(
      startWith(-1), // Refresh this widget separate from dashboard (ex. config is updated)
      distinctUntilChanged(), // If dashboard is loaded the first time, ignore widget double refresh
      // tslint:disable-next-line:no-shadowed-variable
      switchMap(_ => this.getCurrentWidgetConfig()),
      switchMap(widgetConfig => {
        if (!widgetConfig) {
          this.widgetConfigExists = false;
          return of([]);
        }
        this.widgetConfigExists = true;
        // check if collector item type is tied to dashboard
        // if true, set state to READY, otherwise keep at default CONFIGURE
        if (this.dashboardService.checkCollectorItemTypeExist('StaticSecurityScan')) {
          this.state = WidgetState.READY;
        }
        this.params = {
          componentId: widgetConfig.componentId,
          max: 1
        };
        return this.securityService.getSecurityScanDetails(this.params.componentId, this.params.max)
          .pipe(catchError(err => of(err)));
        // );
      })).subscribe(result => {
        this.hasData = (result && result.length > 0);
        if (this.hasData) {
          this.loadCharts(result);
        } else {
          this.setDefaultIfNoData();
        }
        super.loadComponent(this.childLayoutTag);
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

  stopRefreshInterval() {
    if (this.intervalRefreshSubscription) {
      this.intervalRefreshSubscription.unsubscribe();
    }
  }

  loadCharts(result: ISecurityScan[]) {
    this.generateSecurityScanData(result);
  }

  generateSecurityScanData(result: ISecurityScan[]) {
    const sData = result[0].metrics.map(metric => {
      const riskStatus = metric.name === 'High' ? DashStatus.CRITICAL : (metric.name === 'Medium' ?
        DashStatus.WARN : DashStatus.PASS);
      return {
        title: metric.name,
        subtitles : [metric.value],
        status: riskStatus,
        statusText: metric.status,
      } as IClickListItem;
    });

    this.charts[0].data = {
      items: sData,
      clickableContent: null,
      clickableHeader: null
    } as IClickListData;
  }

  setDefaultIfNoData() {
    if (!this.hasData) {
      this.charts[0].data = { items: [{ title: 'No Data Found' }]};
    }
    super.loadComponent(this.childLayoutTag);
  }

}
