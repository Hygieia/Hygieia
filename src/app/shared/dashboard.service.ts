import {HttpClient, HttpHeaders} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { cloneDeep, extend } from 'lodash';
import {interval, Observable, ReplaySubject, Subject, Subscription} from 'rxjs';
import {filter, map, startWith, take} from 'rxjs/operators';
import {IAuditResult} from './interfaces';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  private dashboardRoute = '/api/dashboard/';

  private dashboardV2Route = '/api/v2/dashboard/';

  private dashboardAuditRoute = '/apiaudit/auditresult/dashboard/title/';

  private dashboardCountRoute = '/api/dashboard/count/';

  dashboardSubject = new ReplaySubject<any>(1);

  private dashboardAuditSubject = new ReplaySubject<any>(1);

  public dashboardQualitySubject = new ReplaySubject<any>(1);

  private dashboardCountSubject = new ReplaySubject<any>(2);

  private dashboardRefreshSubject = new Subject<any>();

  private dashboardRefreshSubscription: Subscription;

  private REFRESH_INTERVAL_SECONDS = 3000;

  private dashboardId: string;

  public dashboardConfig$ = this.dashboardSubject.asObservable().pipe(filter(result => result));

  public dashboardAuditConfig$ = this.dashboardAuditSubject.asObservable().pipe(filter(result => result));

  public dashboardCountConfig$ = this.dashboardCountSubject.asObservable().pipe(filter(result => result));

  public dashboardQualityConfig$ = this.dashboardQualitySubject.asObservable().pipe(filter(result => result));

  public dashboardRefresh$ = this.dashboardRefreshSubject.asObservable();

  constructor(private http: HttpClient) { }

  // Get dashboard by id
  getDashboard(dashboardId: string): Observable<any> {
    this.dashboardId = dashboardId;
    return this.http.get(this.dashboardRoute + dashboardId);
  }

  loadDashboardAudits() {
    this.dashboardConfig$.pipe(map(dashboard => dashboard)).subscribe(dashboard => {
      this.http.get<IAuditResult[]>(this.dashboardAuditRoute + dashboard.title).subscribe(res => this.dashboardAuditSubject.next(res));
    });
  }

  subscribeDashboardRefresh() {
    this.dashboardRefreshSubscription = interval(1000 * this.REFRESH_INTERVAL_SECONDS).pipe(
      startWith(-1)).subscribe(res => this.dashboardRefreshSubject.next(res));
  }

  clearDashboard() {
    this.dashboardId = null;
    this.dashboardSubject.next(null);
    if (this.dashboardRefreshSubscription) {
      this.dashboardRefreshSubscription.unsubscribe();
    }
  }

  // Clone the passed widget config, and post the updated widget to the API
  upsertWidget(widgetConfig: any): Observable<any> {
    widgetConfig = cloneDeep(widgetConfig);

    const widgetId = widgetConfig.id;
    if (widgetId) {
      delete widgetConfig.id;
    }

    const apiCall = widgetId ?
      this.http.put(this.dashboardV2Route + this.dashboardId + '/widget/' + widgetId, widgetConfig) :
      this.http.post(this.dashboardV2Route + this.dashboardId + '/widget', widgetConfig);

    return apiCall;
  }

  // Take a new component and config returned by the API, and update the data locally.
  // Push this new version to subscribers.
  upsertLocally(newComponent: any, newConfig: any) {
    // Find and update component
    let tempDashboard$ = this.dashboardConfig$.pipe(take(1), map(dashboard => {
      if (newComponent == null) {
        return dashboard;
      }
      let foundComponent = false;
      dashboard.application.components.forEach((component: any, index: number) => {
        if (component.id === newComponent.id) {
          foundComponent = true;
          dashboard.application.components[index] = newComponent;
        }
      });
      if (!foundComponent) {
        dashboard.application.components.push(newComponent);
      }
      return dashboard;
    }));

    // Find and update config
    tempDashboard$ = tempDashboard$.pipe(map(dashboard => {
      let foundMatch = false;
      const filteredWidgets = dashboard.widgets.filter((config: any) => config.options.id === newConfig.options.id);
      filteredWidgets.forEach((config: any, index: number) => {
        foundMatch = true;
        dashboard.widgets[index] = extend(config, newConfig);
      });
      if (!foundMatch) {
        dashboard.widgets.push(newConfig);
      }
      return dashboard;
    }));

    tempDashboard$.subscribe(dashboard => this.dashboardSubject.next(dashboard));
  }

  // Clone the passed widget config, and post the deleted widget to the API
  deleteWidget(widgetConfig: any): Observable<any> {
    widgetConfig = cloneDeep(widgetConfig);

    const widgetId = widgetConfig.id;
    if (widgetId) {
      delete widgetConfig.id;
    }

    const apiCall = widgetId ?
      this.http.put(this.dashboardV2Route + this.dashboardId + '/deleteWidget/' + widgetId, widgetConfig) : null;
    return apiCall;
  }

  // Take updated component sans deleted widget and config returned by the API, and update the data locally.
  deleteLocally(responseComponent: any, configToDelete: any) {
    // Find and update component
    let tempDashboard$ = this.dashboardConfig$.pipe(take(1), map(dashboard => {
      if (responseComponent == null) {
        return dashboard;
      }
      let foundComponent = false;
      dashboard.application.components.forEach((component: any, index: number) => {
        if (component.id === responseComponent.id) {
          foundComponent = true;
          dashboard.application.components[index] = responseComponent;
        }
      });
      if (!foundComponent) {
        dashboard.application.components.push(responseComponent);
      }
      return dashboard;
    }));

    // Find and remove widget config
    tempDashboard$ = tempDashboard$.pipe(map(dashboard => {
      dashboard.widgets = dashboard.widgets.filter((config: any) => config.options.id !== configToDelete.options.id);
      return dashboard;
    }));

    tempDashboard$.subscribe(dashboard => this.dashboardSubject.next(dashboard));
  }

  checkCollectorItemTypeExist(ciType: string) {
    let collectorItems;
    let exists = false;
    this.dashboardConfig$.pipe(take(1), map(dashboard => dashboard)).subscribe(dashboard => {
      dashboard.application.components.forEach((component: any, index: number) => {
        collectorItems = dashboard.application.components[index].collectorItems;
        for (const key in collectorItems) {
          if (key === ciType) {
            exists = true;
          }
        }
      });
    });

    return exists;
  }

  createDashboard(data: any): Observable<any> {
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type':  'application/json'})};
    return this.http.post(this.dashboardRoute, data, httpOptions);
  }

  loadCounts() {
    ['Team', 'Product'].forEach(type => {
      this.http.get(this.dashboardCountRoute + type)
        .subscribe(count => this.dashboardCountSubject.next({ name: type, value: count }));
    });
  }
}
