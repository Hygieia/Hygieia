import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { inject, TestBed } from '@angular/core/testing';

import { DashboardService } from './dashboard.service';
import { GET_DASHBOARD_MOCK, POST_DASHBOARD_MOCK } from './dashboard.service.mockdata';

describe('DashboardService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    imports: [HttpClientTestingModule]
  }));

  it('should be created', () => {
    const service: DashboardService = TestBed.get(DashboardService);
    expect(service).toBeTruthy();
  });

  it('should load dashboard audits', () => {
    const service: DashboardService = TestBed.get(DashboardService);
    service.loadDashboardAudits();
  });

  it('should load dashboard audits', () => {
    const service: DashboardService = TestBed.get(DashboardService);
    service.subscribeDashboardRefresh();
  });

  it('should clear dashboards', () => {
    const service: DashboardService = TestBed.get(DashboardService);
    service.clearDashboard();
  });

  it('should check collector item type exists', () => {
    const service: DashboardService = TestBed.get(DashboardService);
    service.checkCollectorItemTypeExist('collectors');
  });

  it('should create dashboard', () => {
    const service: DashboardService = TestBed.get(DashboardService);
    service.createDashboard({});
  });

  it('should load counts', () => {
    const service: DashboardService = TestBed.get(DashboardService);
    service.loadCounts();
  });

  it('should load a dashboard by id',
    inject([HttpTestingController, DashboardService],
      (httpMock: HttpTestingController, service: DashboardService) => {
        service.getDashboard('123').subscribe(res => service.dashboardSubject.next(res));
        service.dashboardConfig$.subscribe(dashboard => {
          expect(dashboard).toBeTruthy();
        });

        const request = httpMock.expectOne(req => req.method === 'GET');
        request.flush(GET_DASHBOARD_MOCK);
      })
  );

  it('should be able to upsert individual widgets',
    inject([HttpTestingController, DashboardService],
      (httpMock: HttpTestingController, service: DashboardService) => {
        const widgetConfig = {
          id: '5c37a6de40b65d55fde3ddaf',
          name: 'build',
          componentId: '59f88f5e6a3cf205f312c62e',
          options: {
            id: 'build0',
            buildDurationThreshold: 20,
            consecutiveFailureThreshold: 5
          },
          collectorItemIds: ['5b84328d92678d061457d5f1']
        };
        service.upsertWidget(widgetConfig).subscribe(result => {
          expect(result).toBeTruthy();
        });

        const request = httpMock.expectOne(req => req.method === 'PUT');
        request.flush(POST_DASHBOARD_MOCK);
      })
  );

  it('should be able to update the dashboard locally',
    inject([HttpTestingController, DashboardService],
      (httpMock: HttpTestingController, service: DashboardService) => {
        // Load initial dashboard
        service.getDashboard('123').subscribe(res => service.dashboardSubject.next(res));
        service.dashboardConfig$.subscribe(dashboard => {
          expect(dashboard).toBeTruthy();
        });

        const request = httpMock.expectOne(req => req.method === 'GET');
        request.flush(GET_DASHBOARD_MOCK);

        // Upsert locally
        const component = {
          id: '59f88f5e6a3cf205f312c62e',
          name: 'BAP123',
          collectorItems: {
            Build: [
              {
                id: '5b84328d92678d061457d5f1',
                description: '/CICD_Pipeline/',
                niceName: 'myJob',
                enabled: true,
                errors: [],
                pushed: true,
                collectorId: '56ca5b387fab7c05d45a20ce',
                lastUpdated: 1554932326734,
                options: {
                  jobName: '/CICD_Pipeline/',
                  jobUrl: 'https://jenkins.mycompany.com',
                  instanceUrl: 'https://jenkins.mycompany.com/'
                },
                collector: {
                  id: '56ca5b387fab7c05d45a20ce',
                  name: 'Hudson',
                  collectorType: 'Build',
                  enabled: true,
                  online: true,
                  errors: [],
                  uniqueFields: {
                    jobName: '',
                    jobUrl: ''
                  },
                  allFields: {
                    jobName: '',
                    jobUrl: '',
                    instanceUrl: ''
                  },
                  lastExecuted: 1554989530787,
                  searchFields: [
                    'options.jobName',
                    'niceName'
                  ],
                  properties: {}
                },
                errorCount: 0
              }
            ]
          }
        };
        const widgetConfig = {
          id: '5c37a6de40b65d55fde3ddaf',
          name: 'build',
          componentId: '59f88f5e6a3cf205f312c62e',
          options: {
            id: 'build0',
            buildDurationThreshold: 15,
            consecutiveFailureThreshold: 5
          },
          collectorItemIds: ['5b84328d92678d061457d5f1']
        };
        service.upsertLocally(component, widgetConfig);
        service.dashboardConfig$.subscribe(dashboard => {
          expect(dashboard).toBeTruthy();
        });

      })
  );
});
