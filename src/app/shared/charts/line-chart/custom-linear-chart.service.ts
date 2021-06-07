import { Injectable } from "@angular/core";
@Injectable()
export class CustomLinerChartService {
  /**
   * custom: override SVG to have the dots display all the time over the liner chart
   * since it's not supported anymore from ngx chart
   */

  showDots(chart) {
    let index = 0;
    const paths = chart.chartElement.nativeElement.getElementsByClassName(
      "line-series"
    );
    const color = chart.chartElement.nativeElement.getElementsByClassName(
      "line-highlight"
    );

    for (let path of paths) {
      const chrtColor = color[index].getAttribute("ng-reflect-fill");
      const pathElement = path.getElementsByTagName("path")[0];
      const pathAttributes = {
        "marker-start": `url(#dot${index})`,
        "marker-mid": `url(#dot${index})`,
        "marker-end": `url(#dot${index})`,
      };
      this.createMarker(chart, chrtColor, index);
      this.setAttributes(pathElement, pathAttributes);
      index += 1;
    }
  }

  /**
   * create marker
   *
   */

  createMarker(chart, color, index) {
    const svg = chart.chartElement.nativeElement.getElementsByTagName("svg");
    var marker = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "marker"
    );
    var circle = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "circle"
    );
    svg[0].getElementsByTagName("defs")[0].append(marker);
    marker.append(circle);
    const m = svg[0].getElementsByTagName("marker")[0];
    const c = svg[0].getElementsByTagName("circle")[0];

    const markerAttributes = {
      id: `dot${index}`,
      viewBox: "0 0 10 10",
      refX: 5,
      refY: 5,
      markerWidth: 5,
      markerHeight: 5,
    };

    const circleAttributes = {
      cx: 5,
      cy: 5,
      r: 5,
      fill: color,
    };
    m.append(circle);

    this.setAttributes(m, markerAttributes);
    this.setAttributes(c, circleAttributes);
  }

  /**
   * set multiple attributes
   */
  setAttributes(element, attributes) {
    for (const key in attributes) {
      element.setAttribute(key, attributes[key]);
    }
  }
}
