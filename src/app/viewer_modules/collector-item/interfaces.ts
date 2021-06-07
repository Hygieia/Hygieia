
export interface IDashboardCIResponse {
  result: IDashboardCI[];
  lastUpdated: number;
}

export interface IWidegt {
  id: string;
  name: string;
  componentId: string;
  options: {
    id: string;
  };
}

interface IOwner {
  username: string;
  authType: string;
}

export interface ICollectionError {
  errorCode: string;
  errorMessage: string;
  timestamp: number;
}

export interface ICollItem {
  id: string;
  description: string;
  niceName: string;
  environment: string;
  enabled: boolean;
  pushed: boolean;
  collectorId: string;
  lastUpdated: number;
  options: {
    dashboardId: string;
    jobName: string;
    jobUrl: string;
    instanceUrl: string;
    branch: string;
    url: string;
    repoName: string;
    path: string;
    artifactName: string;
    password: string;
    personalAccessToken: string;
  };
  errorCount: number;
  errors: ICollectionError[];
}

export interface IComponent {
  id: string;
  name: string;
  collectorItems: {
    SCM: ICollItem[];
    CMDB: ICollItem[];
    Incident: ICollItem[];
    Build: ICollItem[];
    Artifact: ICollItem[];
    Deployment: ICollItem[];
    AgileTool: ICollItem[];
    Feature: ICollItem[]; // Deprecated
    TestResult: ICollItem[];
    ScopeOwner: ICollItem[]; // Deprecated
    Scope: ICollItem[]; // Deprecated
    CodeQuality: ICollItem[];
    Test: ICollItem[];
    StaticSecurityScan: ICollItem[];
    LibraryPolicy: ICollItem[];
    ChatOps: ICollItem[];
    Cloud: ICollItem[];
    Product: ICollItem[];
    AppPerformance: ICollItem[];
    InfraPerformance: ICollItem[];
    Score: ICollItem[];
    TEAM: ICollItem[];
    Audit: ICollItem[];
    Log: ICollItem[];
    AutoDiscover: ICollItem[];
  };
}

export interface IDashboardCI {
  id: string;
  template: string;
  title: string;
  widgets: IWidegt[];
  owner: string;
  owners: IOwner[ ];
  type: string;
  application: {
    name: string;
    owner: string;
    lineOfBusiness: string;
    components: IComponent[];
  };
  configurationItemBusServName: string;
  configurationItemBusAppName: string;
  validServiceName: boolean;
  validAppName: boolean;
  remoteCreated: boolean;
  scoreEnabled: boolean;
  scoreDisplay: string;
  activeWidgets: [];
  createdAt: number;
  updatedAt: number;
  errorCode: number;
}

export enum AuditType {
  ARTIFACT = 1,
  CODE_QUALITY = 2,
  CODE_REVIEW = 3,
  DEPLOY = 4,
  LIBRARY_POLICY = 5,
  PERF_TEST = 6,
  STATIC_SECURITY_ANALYSIS = 7,
  TEST_RESULT = 8,
  ALL = 99
}

export interface IAuditResult {
  id: string;
  dashboardId: string;
  dashboardTitle: string;
  lineOfBusiness: string;
  configItemBusServName: string;
  configItemBusAppName: string;
  configItemBusServOwner: string;
  configItemBusAppOwner: string;
  collectorItemId: string;
  auditType: string;
  auditTypeStatus: string;
  auditStatus: string;
  url: string;
  auditDetails: string;
  timestamp: number;
  options: {
    traceability: {
      Automated: number;
      Manual: number
    };
    featureTestResult: {
      Automated: {
        successCount: number;
        skippedCount: number;
        totalCount: number;
        failureCount: number
      };
      Manual: {
        successCount: number;
        skippedCount: number;
        totalCount: number;
        failureCount: number
      };
    };
  };
}
