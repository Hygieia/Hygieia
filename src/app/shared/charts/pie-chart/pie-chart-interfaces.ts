import { DataItem } from "../../ngx-charts/pie-grid/data-item.interfaces";

export interface IPieData {
  advancedChart?: boolean;
  results: DataItem[];
  designatedTotal?: number;
  label?: string;
  useCustomLabelValue?: boolean;
  customLabelValue?: number;
}
