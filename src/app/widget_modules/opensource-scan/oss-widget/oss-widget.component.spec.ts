import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OSSWidgetComponent } from './oss-widget.component';
import {Observable, of} from 'rxjs';
import {NgModule, NO_ERRORS_SCHEMA} from '@angular/core';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {SharedModule} from '../../../shared/shared.module';
import {CommonModule} from '@angular/common';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {RouterModule} from '@angular/router';
import {NgbModal, NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {OpensourceScanService} from '../opensource-scan.service';
import {DashboardService} from '../../../shared/dashboard.service';
import {DashStatus} from '../../../shared/dash-status/DashStatus';
import {IOpensourceScan} from '../interfaces';
import {OpensourceScanModule} from '../opensource-scan.module';

@NgModule({
  declarations: [],
  imports: [HttpClientTestingModule, SharedModule, CommonModule, BrowserAnimationsModule,
    RouterModule.forRoot([]), NgbModule, OpensourceScanModule],
  entryComponents: []
})

class TestModule { }

class MockOSSService {
  mockOSSData = {
    result: [
      {
        name : 'QA',
        id: 'OSS_ID',
        collectorItemId: 'coll_id',
        timestamp: 1555590574399,
        threats: {
          License: [],
          Security: []
        },
        reportUrl: 'https://www.w3schools.com/',
        scanState: 'scan state'
      }
    ]
  };

  fetchDetails(componentId: string, maxCnt: number): Observable<IOpensourceScan[]> {
    return of(this.mockOSSData.result);
  }
}

describe('OSSWidgetComponent', () => {
  let component: OSSWidgetComponent;
  let fixture: ComponentFixture<OSSWidgetComponent>;
  let ossService: OpensourceScanService;
  let dashboardService: DashboardService;
  let modalService: NgbModal;
  let ossTestData: IOpensourceScan;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: OpensourceScanService, useClass: MockOSSService },
      ],
      imports: [
        TestModule, HttpClientTestingModule, SharedModule, CommonModule, BrowserAnimationsModule, RouterModule.forRoot([])
      ],
      declarations: [],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    ossTestData = {
      id: 'OSS_ID',
      collectorItemId: 'coll_id',
      timestamp: 1555590574399,
      threats: {
        License: [
          {
            level: 'high',
            components : ['high##open'],
            count: 1,
            dispositionCounts: {
              Open: 1,
              Closed: 0,
            },
            maxAge: 88
          },
          {
            level: 'low',
            components : ['low1##cl', 'low2##open', 'low3##open'],
            count: 3,
            dispositionCounts: {
              Open: 2,
              Closed: 1,
            },
            maxAge: 11
          }
        ],
        Security: [
          {
            level: 'critical',
            components : ['critical##closed'],
            count: 1,
            dispositionCounts: {
              Open: 0,
              Closed: 1,
            },
            maxAge: 99
          },
          {
            level: 'medium',
            components : ['mid1##cl', 'mid2##open', 'mid3##cl'],
            count: 3,
            dispositionCounts: {
              Open: 1,
              Closed: 2,
            },
            maxAge: 55
          }
        ]
      },
      reportUrl: 'https://www.w3schools.com/',
      scanState: 'scan state'
    } as IOpensourceScan;
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OSSWidgetComponent);
    component = fixture.componentInstance;
    ossService = TestBed.get(OpensourceScanService);
    dashboardService = TestBed.get(DashboardService);
    modalService = TestBed.get(NgbModal);
    fixture.detectChanges();
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
    expect(ossService).toBeTruthy();
    expect(dashboardService).toBeTruthy();
    expect(modalService).toBeTruthy();
    expect(fixture).toBeTruthy();
  });

  it('should call ngOnInit()', () => {
    component.ngOnInit();
  });

  it('should set initial value of widgetId, layout, and charts', () => {
    component.ngOnInit();
    expect(component.widgetId).toBeDefined();
    expect(component.layout).toBeDefined();
    expect(component.charts).toBeDefined();
  });

  it('should set interval refresh subscription', () => {
    component.ngOnInit();
  });

  it('should call ngOnDestroy', () => {
    component.ngOnDestroy();
  });

  it('should hit stopRefreshInterval', () => {
    component.stopRefreshInterval();
  });

  it('should call ngAfterViewInit', () => {
    component.ngAfterViewInit();
  });

  it('should hit startRefreshInterval', () => {
    const mockConfig = {
      name: 'codeanalysis',
      options: {
        id: 'codeanalysis0',
      },
      componentId: '1234',
      collectorItemId: '5678'
    };

    spyOn(component, 'getCurrentWidgetConfig').and.returnValues(of(mockConfig), of(null));
    spyOn(ossService, 'fetchDetails').and.returnValues(of([ossTestData]), of([]));
    spyOn(dashboardService, 'checkCollectorItemTypeExist').and.returnValues(true, false);
    component.startRefreshInterval();
    component.startRefreshInterval();
  });

  it('should loadCharts', () => {
    component.loadCharts(ossTestData);
    component.loadCharts(null);
  });

  it('should generateLicenseDetails', () => {
    component.generateLicenseDetails(null);
    component.generateLicenseDetails(ossTestData);
    expect(component.charts[0].title).toEqual('License (3/4)');
    expect(component.charts[0].data.items.length).toEqual(2);
    expect(component.charts[0].data.items[0].statusText).toEqual('high');
    expect(component.charts[0].data.items[0].status).toEqual(DashStatus.UNAUTH);
    expect(component.charts[0].data.items[0].title).toEqual('high (1/1)');
    expect(component.charts[0].data.items[0].subtitles.length).toEqual(0);
    expect(component.charts[0].data.items[0].components.length).toEqual(1);
    expect(component.charts[0].data.items[0].components[0]).toEqual('high##open');
    expect(component.charts[0].data.items[0].url).toEqual('https://www.w3schools.com/');
    expect(component.charts[0].data.items[0].lastUpdated).toEqual(1555590574399);

    expect(component.charts[0].data.items[1].statusText).toEqual('low');
    expect(component.charts[0].data.items[1].status).toEqual(DashStatus.IN_PROGRESS);
    expect(component.charts[0].data.items[1].title).toEqual('low (2/3)');
    expect(component.charts[0].data.items[1].subtitles.length).toEqual(0);
    expect(component.charts[0].data.items[1].components.length).toEqual(3);
    expect(component.charts[0].data.items[1].components[0]).toEqual('low1##cl');
    expect(component.charts[0].data.items[1].components[1]).toEqual('low2##open');
    expect(component.charts[0].data.items[1].components[2]).toEqual('low3##open');
    expect(component.charts[0].data.items[1].url).toEqual('https://www.w3schools.com/');
    expect(component.charts[0].data.items[1].lastUpdated).toEqual(1555590574399);

    // data is null
    component.generateLicenseDetails(null);
  });

  it('should generateSecurityDetails', () => {
    component.generateSecurityDetails(null);
    component.generateSecurityDetails(ossTestData);
    expect(component.charts[1].title).toEqual('Security (1/4)');
    expect(component.charts[1].data.items.length).toEqual(2);
    expect(component.charts[1].data.items[0].statusText).toEqual('critical');
    expect(component.charts[1].data.items[0].status).toEqual(DashStatus.CRITICAL);
    expect(component.charts[1].data.items[0].title).toEqual('critical (0/1)');
    expect(component.charts[1].data.items[0].subtitles.length).toEqual(0);
    expect(component.charts[1].data.items[0].components.length).toEqual(1);
    expect(component.charts[1].data.items[0].components[0]).toEqual('critical##closed');
    expect(component.charts[1].data.items[0].url).toEqual('https://www.w3schools.com/');
    expect(component.charts[1].data.items[0].lastUpdated).toEqual(1555590574399);

    expect(component.charts[1].data.items[1].statusText).toEqual('medium');
    expect(component.charts[1].data.items[1].status).toEqual(DashStatus.WARN);
    expect(component.charts[1].data.items[1].title).toEqual('medium (1/3)');
    expect(component.charts[1].data.items[1].subtitles.length).toEqual(0);
    expect(component.charts[1].data.items[1].components.length).toEqual(3);
    expect(component.charts[1].data.items[1].components[0]).toEqual('mid1##cl');
    expect(component.charts[1].data.items[1].components[1]).toEqual('mid2##open');
    expect(component.charts[1].data.items[1].components[2]).toEqual('mid3##cl');
    expect(component.charts[1].data.items[1].url).toEqual('https://www.w3schools.com/');
    expect(component.charts[1].data.items[1].lastUpdated).toEqual(1555590574399);

    // data is null
    component.generateSecurityDetails(null);
  });

  it('should getDashStatus', () => {
    expect(component.getDashStatus('dummy')).toBe(DashStatus.PASS);
  });

  it('should assign default if no data', () => {
    component.hasData = false;
    component.setDefaultIfNoData();
    expect(component.charts[0].data.items[0].title).toEqual('No Data Found');
  });

});

