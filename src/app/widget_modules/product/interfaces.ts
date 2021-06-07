export interface IProductResponse {
  result: ITeamPipe[];
  lastUpdated: number;
}

export interface IOrderMap {
  orderVal: number;
  stage: string;
}

export interface IStageEntry {
  collectorItemId?: string; // available for Prod commits
  id?: number; // available for Prod commits
  numberOfChanges: number;
  processedTimestamps: Record<string, number>; // { [key: string]: number }; // [];
  scmAuthor: string;
  scmAuthorLogin?: string;
  scmBranch?: string;
  scmCommitLog: string;
  scmCommitTimestamp: number;
  scmParentRevisionNumbers?: string[]; // {[key: number]: string}[];
  scmRevisionNumber: string;
  scmUrl?: string;
  timestamp?: number; // available for Prod commits
  type?: string;
}

export interface ITeamPipe {
  collectorItemId: string;
  orderMap: IOrderMap[];
  prodStage: string;
  stages: Record<string, IStageEntry[]>; // {[key: string]: IStageEntry[]}[];
  unmappedStages: any;
}

export interface IProductTeam {
  collectorItemId: string; // "5fba52761d68914d1c826bec"
  customName: string; // "LocalTeam2"
  dashBoardId: string; // "5fba52751d68914d1c826beb"
  name: string; // "Local 2"
}

export interface IProdConfigOptions {
  id: string; // "product0"
  teams: IProductTeam[];
}
export interface IProdWidget {
  componentId: string; // "5fba538a1d68914d1c826bfa"
  id: string; // "5fba94721d68914d1c826c65"
  name: string; // "product"
  options: IProdConfigOptions;
}

// For View

export interface StageEachCommit {
  author: string;
  message: string;
  id: string;
  timestamp: number;
  in: Record<string, number>; //  { [key: string]: number };
  errorState?: boolean;
}

export interface StageCommit {
  commits?: StageEachCommit[];
  stageAverageTime?: number;
  stageStdDeviation?: number;
  summary?: StageDataSummary;
  needsConfiguration?: boolean;
  totalCommits?: number;
}

export interface StageDataSummary {
  hasCommits: boolean;
  commitsInsideTimeFrame: number;
  commitsOutsideTimeframe: number;
  lastUpdated: DisplayInfo;
  deviation: DeviationInfo;
  average: AverageInfo;
}

export interface DisplayInfo {
  longDisplay: string;
  shortDisplay: string;
}

export interface DeviationInfo {
  count: number;
  descriptor: string;
}

export interface AverageInfo {
  days: number;
  hours: number;
  minutes: number;
}

export interface ProdCommitTime {
  duration: number;
  commitTimestamp: number;
}

export interface TeamProdData {
  averageDays: any; // number or string;
  totalCommits: number;
  trendUp: boolean;
}

export interface ViewData {
  stages: Record<string, StageCommit>;
  prod: TeamProdData;
  prodStage: string;
}
