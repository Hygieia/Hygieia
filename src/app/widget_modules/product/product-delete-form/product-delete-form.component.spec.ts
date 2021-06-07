import { HttpClientTestingModule } from '@angular/common/http/testing';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ProductDeleteFormComponent } from './product-delete-form.component';
import {ReactiveFormsModule} from '@angular/forms';
import {NgbActiveModal, NgbModal, NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {Observable, of} from 'rxjs';
import {CollectorService} from '../../../shared/collector.service';
import {NgModule, NO_ERRORS_SCHEMA} from '@angular/core';
import {SharedModule} from '../../../shared/shared.module';
import {CommonModule} from '@angular/common';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {RouterModule} from '@angular/router';
import {DashboardService} from '../../../shared/dashboard.service';
import {ProductModule} from '../product.module';

class MockCollectorService {
  mockCollectorData = {
    id: '4321',
    description: 'ProductJob : job1',
    collectorId: '1234',
    collector: {
      id: '1234',
      name: 'ProductJob',
      collectorType: 'Product'
    }
  };

  getItemsById(id: string): Observable<any> {
    return of(this.mockCollectorData);
  }
}

class MockDashboardService {
  mockDashboard = {
    title: 'dashboard1',
    application: {
      components: [{
        collectorItems: {
          Product: [{
            id: '1234',
            description: 'ProductJob : job1'
          }]
        }
      }]
    }
  };
  dashboardConfig$ = of(this.mockDashboard);
}

@NgModule({
  declarations: [],
  imports: [ProductModule, HttpClientTestingModule, SharedModule, CommonModule, BrowserAnimationsModule, RouterModule.forRoot([]), NgbModule],
  entryComponents: []
})
class TestModule { }

describe('ProductDeleteFormComponent', () => {
  let component: ProductDeleteFormComponent;
  let fixture: ComponentFixture<ProductDeleteFormComponent>;
  let dashboardService: DashboardService;
  let collectorService: CollectorService;
  let modalService: NgbModule;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [TestModule, HttpClientTestingModule, ReactiveFormsModule, NgbModule],
      declarations: [],
      providers: [
        { provide: NgbActiveModal, useClass: NgbActiveModal },
        { provide: CollectorService, useClass: MockCollectorService},
        { provide: DashboardService, useClass: MockDashboardService}],
      schemas: [NO_ERRORS_SCHEMA]
    })
      .compileComponents();

  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductDeleteFormComponent);
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
    let widgetConfigData = {
      options: {
        id: 1232,
        productDurationThreshold: '',
        consecutiveFailureThreshold: '',
      }
    };
    component.widgetConfig = widgetConfigData;

    widgetConfigData = null;
    component.widgetConfig = widgetConfigData;
});

  it('should call ngOnInit()', () => {
    component.ngOnInit();
  });

  it('should assign selected job after submit', () => {
    component.createDeleteForm();
    expect(component.productDeleteForm.get('productJob').value).toEqual('');
    component.productDeleteForm = component.formProducter.group({productJob: 'job1'});
    component.submitDeleteForm();
    expect(component.productDeleteForm.get('productJob').value).toEqual('job1');
  });

  it('should load saved oss job', () => {
    component.getSavedProductJob();
    collectorService.getItemsById('4321').subscribe(result => {
      expect(component.productDeleteForm.get('productJob').value).toEqual(result);
    });
  });
});
