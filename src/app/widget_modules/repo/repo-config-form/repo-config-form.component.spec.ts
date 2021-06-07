import { HttpClientTestingModule } from '@angular/common/http/testing';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import {NgbActiveModal, NgbModal, NgbModule} from '@ng-bootstrap/ng-bootstrap';
import { SharedModule } from 'src/app/shared/shared.module';
import {RepoConfigFormComponent} from './repo-config-form.component';
import {Observable, of} from 'rxjs';
import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {RouterModule} from '@angular/router';
import {DashboardService} from '../../../shared/dashboard.service';
import {CollectorService} from '../../../shared/collector.service';
import {RepoModule} from '../repo.module';

class MockCollectorService {
  mockCollectorData = {
    id: '4321',
    description: 'Github : repo1',
    collectorId: '1234',
    collector: {
      id: '1234',
      name: 'Github',
      collectorType: 'SCM'
    }
  };

  mockCollectorType = [{name: 'test', collectorType: 'SCM'}];

  getItemsById(id: string): Observable<any> {
    return of(this.mockCollectorData);
  }

  collectorsByType(collectorType): Observable<any> {
    return of(this.mockCollectorType);
  }
}

class MockDashboardService {
  mockDashboard = {
    title: 'dashboard1',
    application: {
      components: [{
        collectorItems: {
          SCM: [{
            id: '1234',
            description: 'Github : repo1'
          }]
        }
      }]
    }
  };
  dashboardConfig$ = of(this.mockDashboard);
}

@NgModule({
  declarations: [],
  imports: [RepoModule, HttpClientTestingModule, SharedModule, CommonModule, BrowserAnimationsModule,
    RouterModule.forRoot([]), NgbModule],
  entryComponents: []
})
class TestModule { }

describe('RepoConfigFormComponent', () => {
  let component: RepoConfigFormComponent;
  let fixture: ComponentFixture<RepoConfigFormComponent>;
  let dashboardService: DashboardService;
  let collectorService: CollectorService;
  let modalService: NgbModule;

  const widgetConfigData = {
    options: {
      id: 'testId',
      scm: {
        name: 'scmName',
        value: 'value',
      },
      url: 'testUrl',
      branch: 'testBranch',
      userID: 'testUser',
      password: 'testPass',
      personalAccessToken: 'testPersonalAccess',
    }
  };

  const widgetConfigDataNoId = {
    options: {
      id: null,
      scm: {
        name: 'scmName',
        value: 'value',
      },
      url: 'testUrl',
      branch: 'testBranch',
      userID: 'testUser',
      password: 'testPass',
      personalAccessToken: 'testPersonalAccess',
    }
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [TestModule, ReactiveFormsModule, NgbModule, SharedModule, HttpClientTestingModule],
      declarations: [ ],
      providers: [
        { provide: NgbActiveModal, useClass: NgbActiveModal },
        { provide: CollectorService, useClass: MockCollectorService},
        { provide: DashboardService, useClass: MockDashboardService}
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RepoConfigFormComponent);
    component = fixture.componentInstance;
    dashboardService = TestBed.get(DashboardService);
    collectorService = TestBed.get(CollectorService);
    modalService = TestBed.get(NgbModal);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set widgetConfig', () => {
    component.widgetConfig = null;
    component.widgetConfig = widgetConfigData;
  });

  it('should call ngOnInit()', () => {
    component.ngOnInit();
  });

  it('should assign selected job after submit', () => {
    component.createForm();
    expect(component.repoConfigForm.get('url').value).toEqual('');
    component.widgetConfig = widgetConfigData;
    component.submitForm();
    expect(component.repoConfigForm.get('url').value).toEqual('testUrl');

    component.createForm();
    component.widgetConfig = widgetConfigDataNoId;
    component.submitForm();
  });
});
