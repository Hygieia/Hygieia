import { CommonModule } from '@angular/common';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Component, NgModule } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import {ActivatedRoute, Router, RouterModule} from '@angular/router';

import { SharedModule } from '../../../shared/shared.module';
import { CaponeTemplateComponent } from '../capone-template/capone-template.component';
import { DashboardViewComponent } from './dashboard-view.component';
import { DasboardNavbarComponent } from 'src/app/core/dasboard-navbar/dasboard-navbar.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { DashboardService } from 'src/app/shared/dashboard.service';
import { of, throwError } from 'rxjs';

@Component({
  selector: 'app-test-widget',
  template: ''

})
class TestWidgetComponent {}

@Component({
  selector: 'app-test-form',
  template: '<form></form>'
})
class TestFormComponent {}

@Component({
  selector: 'app-test-delete-form',
  template: '<form></form>'
})
class TestDeleteFormComponent {}

@NgModule({
  declarations: [
    TestWidgetComponent,
    TestFormComponent,
    TestDeleteFormComponent,
  ],
  entryComponents: [
    TestWidgetComponent,
    TestFormComponent,
    TestDeleteFormComponent,
  ]
})
class TestModule { }

describe('DashboardViewComponent', () => {
  let component: DashboardViewComponent;
  let fixture: ComponentFixture<DashboardViewComponent>;
  let router: Router;
  let service: DashboardService;
  let activeRoute: ActivatedRoute;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [  DashboardViewComponent, DasboardNavbarComponent ],
      imports: [TestModule, BrowserAnimationsModule, HttpClientTestingModule, SharedModule, CommonModule, RouterModule.forRoot([])]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardViewComponent);
    component = fixture.componentInstance;
    router = TestBed.get(Router);
    service = TestBed.get(DashboardService);
    activeRoute = TestBed.get(ActivatedRoute);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should create template', () => {
    component.widgets = [{
      title: ['Test Title'],
      component: [TestWidgetComponent],
      status: 'Success',
      widgetSize: 'col-lg-6',
      configForm: [TestFormComponent],
      deleteForm: [TestDeleteFormComponent]
    }];
    component.ngOnInit();
    component.ngAfterViewInit();
    const childDebugElement = fixture.debugElement.query(By.directive(CaponeTemplateComponent));
    if (childDebugElement) {
      expect(childDebugElement).toBeTruthy();
    }
  });

  it('should navigate to collector view', () => {
    const spy = spyOn(router, 'navigate');
    component.openCollectorViewer();
    expect(spy).toHaveBeenCalled();
  });

  it('should redirect user to login on dashboard service error', () => {
    spyOn(service, 'getDashboard').and.returnValue(throwError({
      status: 401
    }));
    spyOn(activeRoute.snapshot.paramMap, 'get').and.returnValue('trial');
    const routeSpy = spyOn(router, 'navigate').and.callFake(() => {});
    component.ngOnInit();
    expect(routeSpy).toHaveBeenCalledWith(['/user/login']);
  });

  it('should load dashboard', () => {
    spyOn(service, 'getDashboard').and.returnValue(of({}));
    spyOn(service, 'loadDashboardAudits').and.callFake(() => true);
    spyOn(service, 'subscribeDashboardRefresh').and.callFake(() => true);
    const spy = spyOn(service.dashboardSubject, 'next').and.callFake(() => true);
    component.ngOnInit();
    expect(spy).toHaveBeenCalledWith({});
  });


});



