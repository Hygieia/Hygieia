import { Component, ViewEncapsulation } from '@angular/core';

import { ChartComponent } from '../chart/chart.component';

@Component({
  selector: 'app-number-card-chart',
  templateUrl: './number-card-chart.component.html',
  styleUrls: ['./number-card-chart.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class NumberCardChartComponent extends ChartComponent {

  constructor() {
    super();
    this.scaleFactor = .85;
  }

  // options
  textColor = 'white';
  valueFormatting: (val: number) => string = this.formatInteger;


  formatInteger(val: number): string {
    return val.toFixed(0);
  }

}
