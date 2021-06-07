import {
  ChangeDetectorRef,
  Component,
  ComponentFactoryResolver,
  Input,
  Type,
} from "@angular/core";
import { Observable, ReplaySubject } from "rxjs";
import { map, take } from "rxjs/operators";

import { DashboardService } from "../dashboard.service";
import { IChart } from "../interfaces";
import { LayoutDirective } from "../layouts/layout.directive";
import { LayoutComponent } from "../layouts/layout/layout.component";
import { WidgetState } from "../widget-header/widget-state";

@Component({
  template: "",
  styleUrls: ["./widget.component.scss"],
})
export class WidgetComponent {
  @Input() widgetId: string;
  @Input() layout: Type<any>;
  @Input() status: string;
  @Input() auditType: any;
  @Input() lastUpdated: any;

  public charts: IChart[];
  public hasData: boolean;
  // flag for determining whether or not to display widget header icon options
  public widgetConfigExists = false;
  // default config state
  public state = WidgetState.CONFIGURE;

  // Subjects can subscribe and emit. This allows us
  // to subscribe to updates from the upstream dashboard
  // config but also trigger updates for only this widget
  // if needed.
  protected widgetConfigSubject = new ReplaySubject<any>(1);

  // Wrap the subject as an observable for outside users.
  public widgetConfig$ = this.widgetConfigSubject.asObservable();

  constructor(
    private componentFactoryResolver: ComponentFactoryResolver,
    private cdr: ChangeDetectorRef,
    protected dashboardService: DashboardService
  ) {}

  // Pull the layout tag from the template and initialize the charts
  // in the widget. Should be called after chart data is set.
  loadComponent(layoutTag: LayoutDirective): void {
    const componentFactory = this.componentFactoryResolver.resolveComponentFactory(
      this.layout
    );
    const viewContainerRef = layoutTag.viewContainerRef;
    viewContainerRef.clear();
    const componentRef = viewContainerRef.createComponent(componentFactory);
    (componentRef.instance as LayoutComponent).charts = this.charts;
    this.detectChanges();
  }

  // Pipe the widget config observable to limit
  // to one. This ends subscriptions after 1 event.
  getCurrentWidgetConfig(): Observable<any> {
    return this.widgetConfig$.pipe(take(1));
  }

  // Implementation specific to widget subclass.
  // Specific refresh logic for each widget should be
  // implemented in each subclass.
  startRefreshInterval() {}

  // Take one dashboard config from the dashboard service.
  // Load dashboard will initiate the http request that
  // this subscription will receive. The dashboard config
  // is filtered for this widget and pushed to the local
  // config subject.
  init(): void {
    this.dashboardService.dashboardConfig$
      .pipe(
        map((result) => {
          const widget = this.findWidget(result.widgets);
          // console.log(widget);
          return widget;
        })
      )
      .subscribe((result) => {
        if (result) {
          // console.log(result);
          this.widgetConfigSubject.next(result);
        }
      });
  }

  // Find the widget config from the list of widgets
  findWidget(widgets: any[]): any {
    return widgets.find(
      (widget) =>
        widget && widget.options && widget.options.id === this.widgetId
    );
  }

  private detectChanges(): void {
    const destroyed = "destroyed";
    if (!this.cdr[destroyed]) {
      this.cdr.detectChanges();
    }
  }
}
