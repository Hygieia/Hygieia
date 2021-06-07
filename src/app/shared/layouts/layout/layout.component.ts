import {
  ChangeDetectorRef,
  Component,
  ComponentFactoryResolver,
  QueryList,
  ViewRef,
} from "@angular/core";

import { ChartDirective } from "../../charts/chart.directive";
import { ChartComponent } from "../../charts/chart/chart.component";
import { IChart } from "../../interfaces";

@Component({
  template: "",
  styleUrls: ["./layout.component.scss"],
})
export class LayoutComponent {
  charts: IChart[];

  chartComponents: ChartComponent[] = [];

  constructor(
    private componentFactoryResolver: ComponentFactoryResolver,
    protected cdr: ChangeDetectorRef
  ) {}

  resize(chartContainerArray) {
    chartContainerArray.forEach((currChartContainer, index) => {
      if (this.chartComponents[index] !== undefined) {
        const currChartComponent = this.chartComponents[index];
        const width = currChartContainer.nativeElement.getBoundingClientRect()
          .width;
        if (currChartComponent.scaleFactor) {
          currChartComponent.view = [
            width,
            width * currChartComponent.scaleFactor,
          ];
        } else {
          currChartComponent.view = [width, width * 0.4];
        }
      }
    });
    if (!(this.cdr as ViewRef).destroyed && this.cdr !== undefined) {
      this.cdr.detectChanges();
    }
  }

  loadComponent(chartTags: QueryList<ChartDirective>) {
    if (!chartTags) {
      console.log("loadComponent - no chartTags");
      return;
    }
    const chartTagArray = chartTags.toArray();
    for (let i = 0; i < chartTagArray.length && i < this.charts.length; i++) {
      const componentFactory = this.componentFactoryResolver.resolveComponentFactory(
        this.charts[i].component
      );
      const viewContainerRef = chartTagArray[i].viewContainerRef;
      viewContainerRef.clear();
      const componentRef = viewContainerRef.createComponent(componentFactory);
      const chartComponent = componentRef.instance as ChartComponent;
      this.chartComponents.push(chartComponent);
      chartComponent.title = this.charts[i].title;
      chartComponent.data = this.charts[i].data;
      chartComponent.xAxisLabel = this.charts[i].xAxisLabel;
      chartComponent.yAxisLabel = this.charts[i].yAxisLabel;
      chartComponent.colorScheme = this.charts[i].colorScheme;
      if (this.charts[i].scaleFactor) {
        chartComponent.scaleFactor = this.charts[i].scaleFactor;
      }
    }

    this.cdr.detectChanges();
  }
}
