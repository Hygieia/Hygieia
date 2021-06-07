import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SecurityScanWidgetComponent } from './security-scan-widget.component';
import {SecurityScanService} from '../security-scan.service';
import {DashboardService} from '../../../shared/dashboard.service';
import {NgbModal, NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {Observable, of} from 'rxjs';
import {ISecurityScan} from '../security-scan-interfaces';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {SharedModule} from '../../../shared/shared.module';
import {CommonModule} from '@angular/common';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {RouterModule} from '@angular/router';
import {NgModule, NO_ERRORS_SCHEMA} from '@angular/core';
import {SecurityScanModule} from '../security-scan.module';

class MockSecurityScanService {
  mockSecurityScanData = {
    result: [
      {
        id: 'testId',
        collectorItemId: 'testCollItemId',
        timestamp: 1234,
        type: 'SecurityAnalysis',
        metrics: [
          {
            name: 'High',
            value: '6',
            formattedValue: '6',
            status: 'Alert'
          },
          {
            name: 'Score',
            value: '62',
            formattedValue: '62'
          },
        ]
      }
    ],
    lastUpdated: 1234,
    reportUrl: 'https://testscan.com/testComponent/report.html'
  };

  getSecurityScanDetails(componentId: string, max: number): Observable<ISecurityScan[]> {
    return of(this.mockSecurityScanData.result as ISecurityScan[]);
  }
}

@NgModule({
  declarations: [],
  imports: [SecurityScanModule, HttpClientTestingModule, SharedModule, CommonModule, BrowserAnimationsModule,
    RouterModule.forRoot([]), NgbModule],
  entryComponents: []
})
class TestModule { }

describe('SecurityScanWidgetComponent', () => {
  let component: SecurityScanWidgetComponent;
  let securityScanService: SecurityScanService;
  let dashboardService: DashboardService;
  let modalService: NgbModule;
  let fixture: ComponentFixture<SecurityScanWidgetComponent>;

  const mockSecurityScan: ISecurityScan = {
    id: 'testId',
    collectorItemId: 'testCollItemId',
    timestamp: 1234,
    type: 'SecurityAnalysis',
    metrics: [{
        name: 'High',
        value: '6',
        formattedValue: '6',
        status: 'Alert'
      }]} as ISecurityScan;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      providers: [
        {provide: SecurityScanService, useClass: MockSecurityScanService}
        ],
      imports: [TestModule, HttpClientTestingModule, SharedModule, CommonModule, BrowserAnimationsModule, RouterModule.forRoot([])],
      declarations: [],
      schemas: [NO_ERRORS_SCHEMA]
    })
      .compileComponents();

  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SecurityScanWidgetComponent);
    component = fixture.componentInstance;
    securityScanService = TestBed.get(SecurityScanService);
    dashboardService = TestBed.get(DashboardService);
    modalService = TestBed.get(NgbModal);
    fixture.detectChanges();
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
    expect(securityScanService).toBeTruthy();
    expect(dashboardService).toBeTruthy();
    expect(modalService).toBeTruthy();
  });

  it('should create chart', () => {
    fixture.detectChanges();
    component.stopRefreshInterval();
    securityScanService.getSecurityScanDetails('123', 1).subscribe(result => {
      component.loadCharts(result);

      expect(component.charts[0].data.items[0].title).toEqual('High');
      expect(component.charts[0].data.items[0].subtitles[0]).toEqual('6');
      expect(component.charts[0].data.items[0].statusText).toEqual('Alert');
      expect(component.charts[0].data.items[1].title).toEqual('Score');
      expect(component.charts[0].data.items[1].subtitles[0]).toEqual('62');
    });
    component.ngOnDestroy();
  });

  it('should assign default if no data', () => {
    component.hasData = false;
    component.setDefaultIfNoData();
    expect(component.charts[0].data.items[0].title).toEqual('No Data Found');
  });

  it('should call ngOnInit()', () => {
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

    spyOn(component, 'getCurrentWidgetConfig').and.returnValues(of(mockConfig), of(mockConfig), of(null));
    spyOn(securityScanService, 'getSecurityScanDetails').and.returnValues(of([mockSecurityScan]), of([]));
    spyOn(dashboardService, 'checkCollectorItemTypeExist').and.returnValues(true, false);
    component.startRefreshInterval();
    component.startRefreshInterval();
    component.startRefreshInterval();
  });

  it('should loadCharts', () => {
    component.loadCharts([mockSecurityScan]);
  });
});
