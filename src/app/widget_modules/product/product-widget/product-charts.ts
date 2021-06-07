import { ClickListComponent } from "src/app/shared/charts/click-list/click-list.component";
import { ComboChartComponent } from "src/app/shared/charts/combo-chart/combo-chart.component";
import { ILineChartData } from "src/app/shared/charts/line-chart/line-chart-interfaces";
import { LineChartComponent } from "src/app/shared/charts/line-chart/line-chart.component";
import { NumberCardChartComponent } from "src/app/shared/charts/number-card-chart/number-card-chart.component";
import { PlainTextChartComponent } from "../../../shared/charts/plain-text-chart/plain-text-chart.component";
import { IChart } from "src/app/shared/interfaces";

import { ProductDetailComponent } from "../product-detail/product-detail.component";

export let PRODUCT_CHARTS: IChart[] = [
  // {
  //   title: 'Products Per Day',
  //   component: LineChartComponent,
  //   // tslint:disable-next-line: no-object-literal-type-assertion
  //   data: {
  //     areaChart: true,
  //     detailComponent: ProductDetailComponent,
  //     dataPoints: [
  //     {
  //       name: 'All Stages',
  //       series: []
  //     },
  //     {
  //       name: 'Failed Stages',
  //       series: []
  //     }
  //   ]} as ILineChartData,
  //   xAxisLabel: 'Days',
  //   yAxisLabel: 'Commits',
  //   colorScheme: {
  //     domain: ['green', 'red']
  //   }
  // },
  {
    title: "",
    component: PlainTextChartComponent,
    data: [],
    xAxisLabel: "",
    yAxisLabel: "",
    colorScheme: {},
  },
  {
    title: "",
    component: PlainTextChartComponent,
    data: [],
    xAxisLabel: "",
    yAxisLabel: "",
    colorScheme: {},
  },
  {
    title: "",
    component: PlainTextChartComponent,
    data: [],
    xAxisLabel: "",
    yAxisLabel: "",
    colorScheme: {},
  },
  {
    title: "",
    component: PlainTextChartComponent,
    data: [],
    xAxisLabel: "",
    yAxisLabel: "",
    colorScheme: {},
  },
  {
    title: "",
    component: PlainTextChartComponent,
    data: [],
    xAxisLabel: "",
    yAxisLabel: "",
    colorScheme: {},
  },
];
