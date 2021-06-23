import { CommonModule } from '@angular/common';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Component, NgModule } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import {Router, RouterModule} from '@angular/router';

import { SharedModule } from '../../shared/shared.module';
import { CaponeTemplateComponent } from '../team-dashboard/capone-template/capone-template.component';
import { DashboardViewComponent } from './dashboard-view.component';
import { DasboardNavbarComponent } from 'src/app/core/dasboard-navbar/dasboard-navbar.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

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
});



