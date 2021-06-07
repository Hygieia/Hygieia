import { CommonModule } from '@angular/common';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
import { NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { Observable, of } from 'rxjs';
import { DashboardService } from 'src/app/shared/dashboard.service';
import { SharedModule } from 'src/app/shared/shared.module';

import { StaticAnalysisService } from '../static-analysis.service';
import { IStaticAnalysis } from '../interfaces';
import { StaticAnalysisWidgetComponent} from './static-analysis-widget.component';
import {StaticAnalysisModule} from '../static-analysis.module';

class MockStaticAnalysisService {

  mockStaticAnalysisData = {
    result: [
      {
        id: '123',
        collectorItemId: '123',
        timestamp: 1552590574305,
        name: 'sonar-project-1',
        url: 'https://sonar.com',
        version: '0.0.1',
        metrics: [],
      }
    ],
    lastUpdated: 1553613455230
  };

  fetchStaticAnalysis(): Observable<IStaticAnalysis[]> {
    return of(this.mockStaticAnalysisData.result);
  }
}

@NgModule({
  declarations: [],
  imports: [HttpClientTestingModule, SharedModule, CommonModule, BrowserAnimationsModule,
    RouterModule.forRoot([]), NgbModule, StaticAnalysisModule],
  entryComponents: []
})
class TestModule { }

describe('StaticAnalysisWidgetComponent', () => {
  let component: StaticAnalysisWidgetComponent;
  let staticAnalysisService: StaticAnalysisService;
  let dashboardService: DashboardService;
  let modalService: NgbModal;
  let fixture: ComponentFixture<StaticAnalysisWidgetComponent>;

  const staticAnalysisTestData = {
    id: '123',
    collectorItemId: '123',
    timestamp: 1552590574305,
    name: 'sonar-project-1',
    url: 'https://sonar.com',
    version: '0.0.1',
    metrics: [
      {
        name: 'blocker_violations',
        value: '1',
        formattedValue: '1',
      },
      {
        name: 'critical_violations',
        value: '1',
        formattedValue: '1',
      },
      {
        name: 'major_violations',
        value: '1',
        formattedValue: '1',
      },
      {
        name: 'violations',
        value: '3',
        formattedValue: '3',
      },
      {
        name: 'coverage',
        value: '55.5',
        formattedValue: '55.5%',
      },
      {
        name : 'ncloc',
        value : '123',
        formattedValue : '123',
      },
      {
        name : 'alert_status',
        value : 'OK',
        formattedValue : 'OK',
      },
      {
        name : 'sqale_index',
        value : '60',
        formattedValue : '60min'
      },
      {
        name : 'tests',
        value : '10',
        formattedValue : '10'
      },
      {
        name : 'test_success_density',
        value : '10',
        formattedValue : '10'
      },
      {
        name : 'test_failures',
        value : '0',
        formattedValue : '0'
      },
      {
        name : 'test_errors',
        value : '0',
        formattedValue : '0'
      },
    ],
  } as IStaticAnalysis;

  const staticAnalysisTestDataMissingMetrics = {
    id: '123',
    collectorItemId: '123',
    timestamp: 1552590574305,
    name: 'sonar-project-1',
    url: 'https://sonar.com',
    version: '0.0.1',
    metrics: [],
  } as IStaticAnalysis;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: StaticAnalysisService, useClass: MockStaticAnalysisService },
      ],
      imports: [
        TestModule, HttpClientTestingModule, SharedModule, CommonModule, BrowserAnimationsModule, RouterModule.forRoot([])
      ],
      declarations: [],
      schemas: [NO_ERRORS_SCHEMA]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StaticAnalysisWidgetComponent);
    component = fixture.componentInstance;
    staticAnalysisService = TestBed.get(StaticAnalysisService);
    dashboardService = TestBed.get(DashboardService);
    modalService = TestBed.get(NgbModal);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
    expect(staticAnalysisService).toBeTruthy();
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
    expect(component.staticAnalysisMetrics).toBeDefined();
    expect(component.qualityGateStatuses).toBeDefined();
  });

  it('should call ngOnDestroy', () => {
    component.ngOnDestroy();
  });

  it('should hit stopRefreshInterval', () => {
    // should go into if statement
    component.stopRefreshInterval();
    // if statement resolves to false
    dashboardService.dashboardConfig$ = null;
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
    spyOn(staticAnalysisService, 'fetchStaticAnalysis').and.returnValues(of([staticAnalysisTestData]), of([]));
    spyOn(dashboardService, 'checkCollectorItemTypeExist').and.returnValues(true, false);
    component.startRefreshInterval();
    component.startRefreshInterval();
    component.startRefreshInterval();
  });

  it('should generateProjectDetails', () => {
    component.generateProjectDetails(staticAnalysisTestData);
    expect(component.charts[0].data.items.length).toEqual(4);
    expect(component.charts[0].data.url).toEqual('https://sonar.com');
    expect(component.charts[0].data.version).toEqual('0.0.1');
    expect(component.charts[0].data.name).toEqual('sonar-project-1');
    expect(component.charts[0].data.timestamp).toEqual(new Date(1552590574305));

    // missing project detail metrics
    component.generateProjectDetails(staticAnalysisTestDataMissingMetrics);
  });

  it('should generateCoverage', () => {
    component.generateCoverage(staticAnalysisTestData);
    expect(component.charts[1].data.results[0].value).toEqual(55.5);
    expect(component.charts[1].data.customLabelValue).toEqual(123);

    // missing coverage metrics
    component.generateCoverage(staticAnalysisTestDataMissingMetrics);
  });

  it('should generateViolations', () => {
    component.generateViolations(staticAnalysisTestData);
    expect(component.charts[2].data[0].value).toEqual(1);
    expect(component.charts[2].data[1].value).toEqual(1);
    expect(component.charts[2].data[2].value).toEqual(1);
    expect(component.charts[2].data[3].value).toEqual(3);

    // missing violation metrics
    component.generateViolations(staticAnalysisTestDataMissingMetrics);
  });

  it('should generateUnitTestMetrics', () => {
    component.generateUnitTestMetrics(staticAnalysisTestData);
    expect(component.charts[3].data.items.length).toEqual(4);

    // missing unit test metrics
    component.generateUnitTestMetrics(staticAnalysisTestDataMissingMetrics);
  });

  it('should assign default if no data', () => {
    component.hasData = false;
    component.setDefaultIfNoData();
    expect(component.charts[0].data.items[0].title).toEqual('No Data Found');
    expect(component.charts[1].data.results[0].value).toEqual(0);
    expect(component.charts[1].data.customLabelValue).toEqual(0);
    expect(component.charts[2].data[0].value).toEqual(0);
    expect(component.charts[2].data[1].value).toEqual(0);
    expect(component.charts[2].data[2].value).toEqual(0);
    expect(component.charts[2].data[3].value).toEqual(0);
    expect(component.charts[3].data.items[0].title).toEqual('No Data Found');
  });

});


