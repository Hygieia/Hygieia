import { HttpClientTestingModule } from '@angular/common/http/testing';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import {NgbActiveModal, NgbModal, NgbModule} from '@ng-bootstrap/ng-bootstrap';
import { SharedModule } from 'src/app/shared/shared.module';

import { ProductConfigFormComponent } from './product-config-form.component';
import {Observable, of} from 'rxjs';
import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {RouterModule} from '@angular/router';
import {DashboardService} from '../../../shared/dashboard.service';
import {CollectorService} from '../../../shared/collector.service';
import {ProductModule} from '../product.module';

class MockCollectorService {
  mockCollectorData = {
    id: '4321',
    description: 'Product : job1',
    collectorId: '1234',
    collector: {
      id: '1234',
      name: 'Product',
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
            description: 'job1',
            niceName: 'SomeProduct'
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

describe('ProductConfigFormComponent', () => {
  let component: ProductConfigFormComponent;
  let fixture: ComponentFixture<ProductConfigFormComponent>;
  let dashboardService: DashboardService;
  let collectorService: CollectorService;
  let modalService: NgbModule;

  const productCollectorItem = {
    id: '1234',
    description: 'job1',
    niceName: 'SomeProduct'
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, NgbModule, HttpClientTestingModule, TestModule],
      declarations: [ ],
      providers: [
        { provide: NgbActiveModal, useClass: NgbActiveModal },
        { provide: CollectorService, useClass: MockCollectorService},
        { provide: DashboardService, useClass: MockDashboardService}]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductConfigFormComponent);
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

  it('should get product title()', () => {
    const title = component.getProductTitle(productCollectorItem);
    expect(title).toBeTruthy();

    const noTitle = component.getProductTitle(null);
    expect(noTitle).toBeFalsy();
  });

  it('should assign selected job after submit', () => {
    component.createForm();
    expect(component.productConfigForm.get('productJob').value).toEqual('');
    component.productConfigForm = component.formProducter.group({productJob: 'job1'});
    component.submitForm();
    expect(component.productConfigForm.get('productJob').value).toEqual('job1');
  });

  it('should load saved product job', () => {
    component.loadSavedProductJob();
    collectorService.getItemsById('4321').subscribe(result => {
      expect(component.productConfigForm.get('productJob').value).toEqual(result);
    });
  });

});
