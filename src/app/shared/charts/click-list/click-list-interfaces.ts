import { Type } from "@angular/core";

export enum DashStatus {
  IGNORE,
  IN_PROGRESS,
  PASS,
  WARN,
  FAIL,
  UNAUTH,
  CRITICAL,
}

export interface IClickListData {
  items: IClickListItem[];
  clickableContent: Type<any>;
  clickableHeader: Type<any>;
  colorScheme?: {};
}

export interface IClickListItem {
  status: DashStatus;
  statusText: string;
  title: string;
  subtitles: any[];
  url: string;
  textColor?: string;
}

export interface IClickListItemBuild extends IClickListItem {
  buildStatus: string;
  baseLogUrl: string;
  buildId: string;
}

export interface IClickListItemDeploy extends IClickListItem {
  version: string;
  name: string;
  url: string;
  lastUpdated: number;
  regex: string;
}

export interface IClickListItemStaticAnalysis extends IClickListData {
  url: string;
  version?: string;
  name?: string;
  timestamp?: any;
}

export interface IClickListItemTest extends IClickListItem {
  timestamp: string;
  description: string;
  url: string;
  data: any;
}

export interface IClickListItemOSS extends IClickListItem {
  url: string;
  components: string[];
  lastUpdated: number;
}
