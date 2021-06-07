import { CommonModule } from '@angular/common';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
import { NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { from, Observable, of, ReplaySubject } from 'rxjs';
import { DashboardService } from 'src/app/shared/dashboard.service';
import { SharedModule } from 'src/app/shared/shared.module';

import { GET_DASHBOARD_MOCK, POST_DASHBOARD_MOCK } from '../../../shared/dashboard.service.mockdata';
import { BuildService } from '../build.service';
import { IBuild } from '../interfaces';
import { BuildWidgetComponent } from './build-widget.component';
import { BuildModule } from '../build.module';

class MockBuildService {

  mockBuildData = {
    result: [
      {
        id: '5c8a88ceaa8ebb3c1bfd1391',
        collectorItemId: '5b84328d92678d061457d5f1',
        timestamp: 1552583719241,
        number: '696',
        buildUrl: 'https://jenkins.com',
        startTime: 1552582765454,
        endTime: 1552583719091,
        duration: 953637,
        buildStatus: 'Success',
        codeRepos: [
          {
            url: 'https://github.com/org/repo',
            branch: 'master',
            type: 'GIT'
          }
        ],
        sourceChangeSet: [],
        stages: []
      },
      {
        id: '5c8aa40daa8ebb3c1bfd39a7',
        collectorItemId: '5b84328d92678d061457d5f1',
        timestamp: 1552590574305,
        number: '697',
        buildUrl: 'https://jenkins.com',
        startTime: 1552589767711,
        endTime: 1552590574157,
        duration: 806446,
        buildStatus: 'Success',
        codeRepos: [
          {
            url: 'https://github.com/org/repo',
            branch: 'master',
            type: 'GIT'
          }
        ],
        sourceChangeSet: [],
        stages: []
      },
      {
        id: '5c8ab33daa8ebb3c1bfd5123',
        collectorItemId: '5b84328d92678d061457d5f1',
        timestamp: 1552594515883,
        number: '698',
        buildUrl: 'https://jenkins.com',
        startTime: 1552593556245,
        endTime: 1552594515734,
        duration: 959489,
        buildStatus: 'Success',
        codeRepos: [
          {
            url: 'https://github.com/org/repo',
            branch: 'master',
            type: 'GIT'
          }
        ],
        sourceChangeSet: [],
        stages: []
      },
      {
        id: '5c8ac201aa8ebb3c1bfd65de',
        collectorItemId: '5b84328d92678d061457d5f1',
        timestamp: 1552598280425,
        number: '699',
        buildUrl: 'https://jenkins.com',
        startTime: 1552597437336,
        endTime: 1552598280263,
        duration: 842927,
        buildStatus: 'Success',
        codeRepos: [
          {
            url: 'https://github.com/org/repo',
            branch: 'master',
            type: 'GIT'
          }
        ],
        sourceChangeSet: [],
        stages: []
      },
      {
        id: '5c8bf20daa8ebb3c1bfde77e',
        collectorItemId: '5b84328d92678d061457d5f1',
        timestamp: 1552676207687,
        number: '700',
        buildUrl: 'https://jenkins.com',
        startTime: 1552675244329,
        endTime: 1552676207535,
        duration: 963206,
        buildStatus: 'Success',
        codeRepos: [
          {
            url: 'https://github.com/org/repo',
            branch: 'master',
            type: 'GIT'
          }
        ],
        sourceChangeSet: [],
        stages: []
      },
      {
        id: '5c8feb62aa8ebb3c1bfee736',
        collectorItemId: '5b84328d92678d061457d5f1',
        timestamp: 1552936510535,
        number: '701',
        buildUrl: 'https://jenkins.com',
        startTime: 1552935707608,
        endTime: 1552936510387,
        duration: 802779,
        buildStatus: 'Success',
        codeRepos: [
          {
            url: 'https://github.com/org/repo',
            branch: 'master',
            type: 'GIT'
          }
        ],
        sourceChangeSet: [],
        stages: []
      },
      {
        id: '5c9133dbaa8ebb3c1bffa612',
        collectorItemId: '5b84328d92678d061457d5f1',
        timestamp: 1553020015543,
        number: '702',
        buildUrl: 'https://jenkins.com',
        startTime: 1553019656211,
        endTime: 1553020015387,
        duration: 359176,
        buildStatus: 'Failure',
        codeRepos: [
          {
            url: 'https://github.com/org/repo',
            branch: 'master',
            type: 'GIT'
          }
        ],
        sourceChangeSet: [],
        stages: []
      },
      {
        id: '5c913a46aa8ebb3c1bffafca',
        collectorItemId: '5b84328d92678d061457d5f1',
        timestamp: 1553022215740,
        number: '703',
        buildUrl: 'https://jenkins.com',
        startTime: 1553021439369,
        endTime: 1553022215583,
        duration: 776214,
        buildStatus: 'Failure',
        codeRepos: [
          {
            url: 'https://github.com/org/repo',
            branch: 'master',
            type: 'GIT'
          }
        ],
        sourceChangeSet: [],
        stages: []
      },
      {
        id: '5c91796eaa8ebb3c1bfff67e',
        collectorItemId: '5b84328d92678d061457d5f1',
        timestamp: 1553038365163,
        number: '704',
        buildUrl: 'https://jenkins.com',
        startTime: 1553037614501,
        endTime: 1553038365005,
        duration: 750504,
        buildStatus: 'Failure',
        codeRepos: [
          {
            url: 'https://github.com/org/repo',
            branch: 'master',
            type: 'GIT'
          }
        ],
        sourceChangeSet: [],
        stages: []
      },
      {
        id: '5c919665aa8ebb3c1bfffe6d',
        collectorItemId: '5b84328d92678d061457d5f1',
        timestamp: 1553045794934,
        number: '705',
        buildUrl: 'https://jenkins.com',
        startTime: 1553045028347,
        endTime: 1553045794785,
        duration: 766438,
        buildStatus: 'Failure',
        codeRepos: [
          {
            url: 'https://github.com/org/repo',
            branch: 'master',
            type: 'GIT'
          }
        ],
        sourceChangeSet: [],
        stages: []
      },
      {
        id: '5c919b5eaa8ebb3c1b00001d',
        collectorItemId: '5b84328d92678d061457d5f1',
        timestamp: 1553047054930,
        number: '706',
        buildUrl: 'https://jenkins.com',
        startTime: 1553046299012,
        endTime: 1553047054774,
        duration: 755762,
        buildStatus: 'Failure',
        codeRepos: [
          {
            url: 'https://github.com/org/repo',
            branch: 'master',
            type: 'GIT'
          }
        ],
        sourceChangeSet: [],
        stages: []
      },
      {
        id: '5c91a859aa8ebb3c1b000542',
        collectorItemId: '5b84328d92678d061457d5f1',
        timestamp: 1553050377090,
        number: '707',
        buildUrl: 'https://jenkins.com',
        startTime: 1553049624390,
        endTime: 1553050376772,
        duration: 752382,
        buildStatus: 'Failure',
        codeRepos: [
          {
            url: 'https://github.com/org/repo',
            branch: 'master',
            type: 'GIT'
          }
        ],
        sourceChangeSet: [],
        stages: []
      },
      {
        id: '5c91b299aa8ebb3c1b000848',
        collectorItemId: '5b84328d92678d061457d5f1',
        timestamp: 1553052944799,
        number: '708',
        buildUrl: 'https://jenkins.com',
        startTime: 1553052249211,
        endTime: 1553052944648,
        duration: 695437,
        buildStatus: 'Success',
        codeRepos: [
          {
            url: 'https://github.com/org/repo',
            branch: 'master',
            type: 'GIT'
          }
        ],
        sourceChangeSet: [],
        stages: []
      }
    ],
    lastUpdated: 1553613455230
  };

  fetchDetails(): Observable<IBuild[]> {
    return of(this.mockBuildData.result);
  }
}

class MockDashboardService {
  private dashboardSubject = new ReplaySubject<any>(1);

  public dashboardConfig$ = this.dashboardSubject.asObservable();

  public dashboardRefresh$ = from([1, 2, 3]);

  loadDashboard(dashboardId: string) {
    of(GET_DASHBOARD_MOCK).subscribe(res => this.dashboardSubject.next(res));
  }

  upsertWidget(dashboardId: string, widgetConfig: any) {
    return of(POST_DASHBOARD_MOCK);
  }

  upsertLocally(newComponent: any, newConfig: any) {
    of(GET_DASHBOARD_MOCK).subscribe(dashboard => this.dashboardSubject.next(dashboard));
  }

  clearDashboard() { }
}

@NgModule({
  declarations: [],
  imports: [BuildModule, HttpClientTestingModule, SharedModule, CommonModule, BrowserAnimationsModule, RouterModule.forRoot([]), NgbModule],
  entryComponents: []
})
class TestModule { }

describe('BuildWidgetComponent', () => {
  let component: BuildWidgetComponent;
  let buildService: BuildService;
  let dashboardService: DashboardService;
  let modalService: NgbModal;
  let fixture: ComponentFixture<BuildWidgetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: BuildService, useClass: MockBuildService },
        { provide: DashboardService, useClass: MockDashboardService }
      ],
      imports: [
        TestModule, HttpClientTestingModule, SharedModule, CommonModule, BrowserAnimationsModule, RouterModule.forRoot([])
      ],
      declarations: [],
      schemas: [NO_ERRORS_SCHEMA]
    })
      .compileComponents();

    fixture = TestBed.createComponent(BuildWidgetComponent);
    component = fixture.componentInstance;
    buildService = TestBed.get(BuildService);
    dashboardService = TestBed.get(DashboardService);
    modalService = TestBed.get(NgbModal);
  }));

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
    expect(buildService).toBeTruthy();
  });

  it('should create all charts', () => {
    // Mock Date April 1st, 2019
    const baseTime = new Date(2019, 3, 1);
    jasmine.clock().mockDate(baseTime);
    fixture.detectChanges();
    component.stopRefreshInterval();

    setTimeout(() => {
      buildService.fetchDetails('123', 14).subscribe(result => {
        component.loadCharts(result);

        expect(component.charts[0].data.dataPoints[0].series.length).toEqual(1);
        expect(component.charts[0].data.dataPoints[1].series.length).toEqual(1);
        expect(component.charts[0].data.dataPoints[0].series[0].value).toEqual(7);
        expect(component.charts[0].data.dataPoints[1].series[0].value).toEqual(6);

        expect(component.charts[1].data.items[0].title).toEqual('Build: 708');
        expect(component.charts[3].data[0].value).toEqual(0);
        expect(component.charts[3].data[1].value).toEqual(0);
        expect(component.charts[3].data[2].value).toEqual(7);
      });
      component.ngOnDestroy();
    }, 500);
  });
});


