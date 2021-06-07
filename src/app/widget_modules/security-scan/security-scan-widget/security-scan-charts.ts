import { IChart } from 'src/app/shared/interfaces';
import {ClickListComponent} from '../../../shared/charts/click-list/click-list.component';

export let SECURITY_SCAN_CHARTS: IChart[] = [
  {
    title: 'Security Scan',
    component: ClickListComponent,
    data: [],
    xAxisLabel: '',
    yAxisLabel: '',
    colorScheme: {}
  },
];
