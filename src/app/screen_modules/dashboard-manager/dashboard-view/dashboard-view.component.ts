import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ComponentFactoryResolver,
  EventEmitter,
  OnInit,
  Output,
  ViewChild,
} from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { DashboardService } from "src/app/shared/dashboard.service";
import { DashboardComponent } from "src/app/shared/dashboard/dashboard.component";
import { TemplatesDirective } from "src/app/shared/templates/templates.directive";
import { CaponeTemplateComponent } from "../../team-dashboard/templates/capone-template/capone-template.component";
import { StechTeamTemplateComponent } from "../../team-dashboard/templates/stech-template/stech-team-template.component";
import { StechProdTemplateComponent } from "../../product-dashboard/stech-template/stech-prod-template.component";
import { widgetsAll } from "./dashboard-view";
import { IWidget } from "../../../shared/interfaces";
import { HttpErrorResponse } from "@angular/common/http";

@Component({
  selector: "app-dashboard-view",
  templateUrl: "./dashboard-view.component.html",
  styleUrls: ["./dashboard-view.component.scss"],
})
export class DashboardViewComponent
  extends DashboardComponent
  implements OnInit, AfterViewInit {
  @Output() title = new EventEmitter(true);
  dashboardTitle = "";
  dashboardId: string;
  widgetsAll: IWidget[] = widgetsAll;
  @ViewChild(TemplatesDirective, { static: false })
  childTemplateTag: TemplatesDirective;

  constructor(
    componentFactoryResolver: ComponentFactoryResolver,
    cdr: ChangeDetectorRef,
    private route: ActivatedRoute,
    private dashboardService: DashboardService,
    private router: Router
  ) {
    super(componentFactoryResolver, cdr);
  }

  ngOnInit() {
    this.dashboardService.clearDashboard();
    this.dashboardId = this.route.snapshot.paramMap.get("id");
    this.loadDashboard(this.dashboardId);
    // ** Should be set once we analyze dashboard
    // this.baseTemplate = CaponeTemplateComponent;  // Was
  }

  private loadDashboard(dashboardId: string) {
    this.dashboardService.getDashboard(dashboardId).subscribe(
      (res) => {
        this.dashboardService.dashboardSubject.next(res);
        this.dashboardService.loadDashboardAudits();
        this.dashboardService.subscribeDashboardRefresh();
      },
      (err) => this.handleError(err)
    );
  }

  ngAfterViewInit() {
    this.loadWidgets();
  }

  private loadWidgets() {
    this.dashboardService.dashboardConfig$.subscribe((dashboard) => {
      this.dashboardTitle = [
        dashboard.title,
        dashboard.configurationItemBusAppName,
        dashboard.configurationItemBusServName,
      ]
        .filter(Boolean)
        .join(" - ");

      if (dashboard.type === "Product") {
        this.baseTemplate = StechProdTemplateComponent;
      } else if (dashboard.type === "Team") {
        this.baseTemplate = CaponeTemplateComponent; // StechTeamTemplateComponent;
      }
      const activeWidgets = new Set<string>();
      dashboard.widgets.forEach((widget) => activeWidgets.add(widget.name));
      if (dashboard.activeWidgets && dashboard.activeWidgets.length) {
        dashboard.activeWidgets.forEach((wName) => activeWidgets.add(wName));
      }
      const widgets: IWidget[] = [];
      activeWidgets.forEach((widgetName) => {
        const fWidget = this.widgetsAll.find((widget) =>
          widget.title
            .join()
            .toLowerCase()
            .replace(/\s/g, "")
            .includes(widgetName)
        );
        if (fWidget) {
          widgets.push(fWidget);
        }
      });
      this.widgets = widgets;
      super.loadComponent(this.childTemplateTag);
    });
  }

  openCollectorViewer() {
    this.router.navigate([
      "/collectorItem/viewer",
      { title: this.dashboardTitle.split("-")[0].trim() },
    ]);
  }

  private handleError(err: HttpErrorResponse) {
    if (err.status === 401) {
      this.router.navigate(["/user/login"]);
    }
  }
}
