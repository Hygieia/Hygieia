import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ComponentFactoryResolver,
  ElementRef,
  QueryList,
  ViewChildren,
} from "@angular/core";
import { fromEvent, Observable, Subscription } from "rxjs";
import { debounceTime } from "rxjs/operators";
import { ChartDirective } from "../../charts/chart.directive";
import { LayoutComponent } from "../layout/layout.component";

// To be expanded to use horizontal card layout with head representing Engine and tail Guard compartment,
// while middle part being stages as Wagons
@Component({
  selector: "app-engine-wagon-layout-chart",
  templateUrl: "./engine-wagon-layout-chart.component.html",
  styleUrls: ["./engine-wagon-layout-chart.component.scss"],
})
export class EngineWagonLayoutChartComponent
  extends LayoutComponent
  implements AfterViewInit {
  myChartDisplay: number[][]; // Temporary

  @ViewChildren(ChartDirective) childChartTags: QueryList<ChartDirective>;

  @ViewChildren("chartParent") chartContainers: QueryList<ElementRef>;

  constructor(
    componentFactoryResolver: ComponentFactoryResolver,
    cdr: ChangeDetectorRef
  ) {
    super(componentFactoryResolver, cdr);
    this.myChartDisplay = [];
  }

  resizeObservable$: Observable<Event>;
  resizeSubscription$: Subscription;

  // Initialize charts and resize hook
  ngAfterViewInit() {
    this.loadComponent();
    super.loadComponent(this.childChartTags);
    if (this.chartContainers) {
      this.resizeObservable$ = fromEvent(window, "resize");
      this.resizeSubscription$ = this.resizeObservable$
        .pipe(debounceTime(50))
        .subscribe((_) => {
          super.resize(this.chartContainers.toArray());
        });
      super.resize(this.chartContainers.toArray());
    }
  }

  loadComponent() {
    // Temporary
    for (var i = 0; i < this.charts.length / 4; i++) {
      this.myChartDisplay[i] = [];
      this.myChartDisplay[i] = [
        this.charts[i * 4].data,
        this.charts[i * 4 + 1].data,
        this.charts[i * 4 + 2].data,
        this.charts[i * 4 + 3].data,
      ];
    }

    this.cdr.detectChanges();
  }
}
