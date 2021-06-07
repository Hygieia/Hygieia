import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ViewEncapsulation,
  ViewChild,
} from "@angular/core";
import { ChartComponent } from "../chart/chart.component";

@Component({
  selector: "app-pie-chart",
  templateUrl: "./pie-chart.component.html",
  styleUrls: ["./pie-chart.component.scss"],
})
export class PieChartComponent extends ChartComponent implements AfterViewInit {
  // options
  gradient: boolean = true;
  showLegend: boolean = true;
  showLabels: boolean = false;
  isDoughnut: boolean = true;
  legendPosition: string = "below";

  //   colorScheme = {
  //     domain: ['#5AA454', '#A10A28', '#C7B42C', '#AAAAAA']
  //   };

  constructor() {
    super();
    // Object.assign(this, { single });
  }

  // not required today but added for future enhancement
  myValueFormat(c): string {
    return `<span class="advanced-pie-legend-item-value">` + c + `</span>`;
  }

  myNameFormat(c): string {
    return c;
  }

  myPercentFormat(c): string {
    return c;
  }

  //To be used for non-advanced pie-chart
  //  [labelFormatting]="labelFormatting"
  // Not to be used for advanced
  // [legend]="showLegend"
  // [legendPosition]="legendPosition"
  // [labels]="showLabels"
  // [doughnut]="isDoughnut"

  labelFormatting(name) {
    // this name will contain the name you defined in chartData[]
    let self: any = this; // this "this" will refer to the chart component (pun intented :))

    let data = self.series.filter((x) => x.name == name); // chartData will be present in
    // series along with the label

    if (data.length > 0) {
      return `<span class="custom-label-text">${data[0].name}: ${data[0].value}<span>`;
    } else {
      return name;
    }
  }

  ngAfterViewInit() {
    // Need to get working to always show dots
    // this.customLinearChartService.showDots(this.chart);   // experimental
  }

  onSelect(data): void {
    //console.log('Item clicked', JSON.parse(JSON.stringify(data)));
  }

  onActivate(data): void {
    //console.log('Activate', JSON.parse(JSON.stringify(data)));
  }

  onDeactivate(data): void {
    //console.log('Deactivate', JSON.parse(JSON.stringify(data)));
  }
}
