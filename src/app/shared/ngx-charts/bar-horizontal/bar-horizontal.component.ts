import {
  Component,
  Input,
  Output,
  EventEmitter,
  ViewEncapsulation,
  ChangeDetectionStrategy,
  ContentChild,
  TemplateRef,
} from "@angular/core";
import { scaleBand, scaleLinear } from "d3-scale";
import {
  BaseChartComponent,
  calculateViewDimensions,
  ColorHelper,
  LegendPosition,
  ScaleType,
  ViewDimensions,
} from "@swimlane/ngx-charts";

// This component is based on the pie grid chart example from ngx-charts.
// https://github.com/swimlane/ngx-charts/blob/master/projects/swimlane/ngx-charts/src/lib/bar-chart/bar-horizontal.component.ts
@Component({
  selector: "app-bar-horizontal-chart",
  template: `
    <ngx-charts-chart
      [view]="[width, height]"
      [showLegend]="legend"
      [legendOptions]="legendOptions"
      [activeEntries]="activeEntries"
      [animations]="animations"
      (legendLabelClick)="onClick($event)"
      (legendLabelActivate)="onActivate($event, true)"
      (legendLabelDeactivate)="onDeactivate($event, true)"
    >
      <svg:g [attr.transform]="transform" class="bar-chart chart">
        <svg:g
          ngx-charts-x-axis
          *ngIf="xAxis"
          [xScale]="xScale"
          [dims]="dims"
          [showGridLines]="showGridLines"
          [showLabel]="showXAxisLabel"
          [labelText]="xAxisLabel"
          [trimTicks]="trimXAxisTicks"
          [rotateTicks]="rotateXAxisTicks"
          [maxTickLength]="maxXAxisTickLength"
          [tickFormatting]="xAxisTickFormatting"
          [ticks]="xAxisTicks"
          (dimensionsChanged)="updateXAxisHeight($event)"
        ></svg:g>
        <svg:g
          ngx-charts-y-axis
          *ngIf="yAxis"
          [yScale]="yScale"
          [dims]="dims"
          [showLabel]="showYAxisLabel"
          [labelText]="yAxisLabel"
          [trimTicks]="trimYAxisTicks"
          [maxTickLength]="maxYAxisTickLength"
          [tickFormatting]="yAxisTickFormatting"
          [ticks]="yAxisTicks"
          [yAxisOffset]="dataLabelMaxWidth.negative"
          (dimensionsChanged)="updateYAxisWidth($event)"
        ></svg:g>
        <svg:g
          ngx-charts-series-horizontal
          [xScale]="xScale"
          [yScale]="yScale"
          [colors]="colors"
          [series]="results"
          [dims]="dims"
          [gradient]="gradient"
          [tooltipDisabled]="tooltipDisabled"
          [tooltipTemplate]="tooltipTemplate"
          [activeEntries]="activeEntries"
          [roundEdges]="roundEdges"
          [animations]="animations"
          [showDataLabel]="showDataLabel"
          [dataLabelFormatting]="dataLabelFormatting"
          [noBarWhenZero]="noBarWhenZero"
          (select)="onClick($event)"
          (activate)="onActivate($event)"
          (deactivate)="onDeactivate($event)"
          (dataLabelWidthChanged)="onDataLabelMaxWidthChanged($event)"
        ></svg:g>
      </svg:g>
    </ngx-charts-chart>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ["./bar-horizontal.component.scss"],
  encapsulation: ViewEncapsulation.None,
})
export class BarHorizontalComponent extends BaseChartComponent {
  @Input() legend = false;
  @Input() legendTitle = "Legend";
  @Input() legendPosition: LegendPosition = LegendPosition.Right;
  @Input() xAxis = false;
  @Input() yAxis = false;
  @Input() showXAxisLabel = false;
  @Input() showYAxisLabel = false;
  @Input() xAxisLabel;
  @Input() yAxisLabel;
  @Input() tooltipDisabled = false;
  @Input() gradient: boolean;
  @Input() showGridLines = true;
  @Input() activeEntries: any[] = [];
  @Input() schemeType: ScaleType;
  @Input() trimXAxisTicks = true;
  @Input() trimYAxisTicks = true;
  @Input() rotateXAxisTicks = true;
  @Input() maxXAxisTickLength = 16;
  @Input() maxYAxisTickLength = 16;
  @Input() xAxisTickFormatting: any;
  @Input() yAxisTickFormatting: any;
  @Input() xAxisTicks: any[];
  @Input() yAxisTicks: any[];
  @Input() barPadding = 8;
  @Input() roundDomains = false;
  @Input() roundEdges = true;
  @Input() xScaleMax: number;
  @Input() xScaleMin: number;
  @Input() showDataLabel = false;
  @Input() dataLabelFormatting: any;
  @Input() noBarWhenZero = true;

  @Output() activate: EventEmitter<any> = new EventEmitter();
  @Output() deactivate: EventEmitter<any> = new EventEmitter();

  @ContentChild("tooltipTemplate", { static: true })
  tooltipTemplate: TemplateRef<any>;

  dims: ViewDimensions;
  yScale: any;
  xScale: any;
  xDomain: any;
  yDomain: any;
  transform: string;
  colors: ColorHelper;
  margin = [10, 20, 10, 20];
  xAxisHeight = 0;
  yAxisWidth = 0;
  legendOptions: any;
  dataLabelMaxWidth: any = { negative: 0, positive: 0 };

  update(): void {
    super.update();

    if (!this.showDataLabel) {
      this.dataLabelMaxWidth = { negative: 0, positive: 0 };
    }

    this.margin = [
      10,
      20 + this.dataLabelMaxWidth.positive,
      10,
      20 + this.dataLabelMaxWidth.negative,
    ];

    this.dims = calculateViewDimensions({
      width: this.width,
      height: this.height,
      margins: this.margin,
      showXAxis: this.xAxis,
      showYAxis: this.yAxis,
      xAxisHeight: this.xAxisHeight,
      yAxisWidth: this.yAxisWidth,
      showXLabel: this.showXAxisLabel,
      showYLabel: this.showYAxisLabel,
      showLegend: this.legend,
      legendType: this.schemeType,
      legendPosition: this.legendPosition,
    });

    this.formatDates();

    this.xScale = this.getXScale();
    this.yScale = this.getYScale();

    this.setColors();
    this.legendOptions = this.getLegendOptions();

    this.transform = `translate(${this.dims.xOffset} , ${this.margin[0]})`;
  }

  getXScale(): any {
    this.xDomain = this.getXDomain();

    const scale = scaleLinear()
      .range([0, this.dims.width])
      .domain(this.xDomain);

    return this.roundDomains ? scale.nice() : scale;
  }

  getYScale(): any {
    this.yDomain = this.getYDomain();
    const spacing =
      this.yDomain.length / (this.dims.height / this.barPadding + 1);

    return scaleBand()
      .rangeRound([0, this.dims.height])
      .paddingInner(spacing)
      .domain(this.yDomain);
  }

  getXDomain(): any[] {
    const values = this.results.map((d) => d.value);
    const min = this.xScaleMin
      ? Math.min(this.xScaleMin, ...values)
      : Math.min(0, ...values);

    const max = this.xScaleMax
      ? Math.max(this.xScaleMax, ...values)
      : Math.max(0, ...values);
    return [min, max];
  }

  getYDomain(): any[] {
    return this.results.map((d) => d.name);
  }

  onClick(data): void {
    this.select.emit(data);
  }

  setColors(): void {
    let domain;
    if (this.schemeType === ScaleType.Ordinal) {
      domain = this.yDomain;
    } else {
      domain = this.xDomain;
    }

    this.colors = new ColorHelper(
      this.scheme,
      this.schemeType,
      domain,
      this.customColors
    );
  }

  getLegendOptions() {
    const opts = {
      scaleType: this.schemeType,
      colors: undefined,
      domain: [],
      title: undefined,
      position: this.legendPosition,
    };
    if (opts.scaleType === ScaleType.Ordinal) {
      opts.domain = this.yDomain;
      opts.colors = this.colors;
      opts.title = this.legendTitle;
    } else {
      opts.domain = this.xDomain;
      opts.colors = this.colors.scale;
    }

    return opts;
  }

  updateYAxisWidth({ width }): void {
    this.yAxisWidth = width;
    this.update();
  }

  updateXAxisHeight({ height }): void {
    this.xAxisHeight = height;
    this.update();
  }

  onDataLabelMaxWidthChanged(event) {
    if (event.size.negative) {
      this.dataLabelMaxWidth.negative = Math.max(
        this.dataLabelMaxWidth.negative,
        event.size.width
      );
    } else {
      this.dataLabelMaxWidth.positive = Math.max(
        this.dataLabelMaxWidth.positive,
        event.size.width
      );
    }
    if (event.index === this.results.length - 1) {
      setTimeout(() => this.update());
    }
  }

  onActivate(item, fromLegend = false) {
    item = this.results.find((d) => {
      if (fromLegend) {
        return d.label === item.name;
      } else {
        return d.name === item.name;
      }
    });

    const idx = this.activeEntries.findIndex((d) => {
      return (
        d.name === item.name &&
        d.value === item.value &&
        d.series === item.series
      );
    });
    if (idx > -1) {
      return;
    }

    this.activeEntries = [item, ...this.activeEntries];
    this.activate.emit({ value: item, entries: this.activeEntries });
  }

  onDeactivate(item, fromLegend = false) {
    item = this.results.find((d) => {
      if (fromLegend) {
        return d.label === item.name;
      } else {
        return d.name === item.name;
      }
    });

    const idx = this.activeEntries.findIndex((d) => {
      return (
        d.name === item.name &&
        d.value === item.value &&
        d.series === item.series
      );
    });

    this.activeEntries.splice(idx, 1);
    this.activeEntries = [...this.activeEntries];

    this.deactivate.emit({ value: item, entries: this.activeEntries });
  }
}
