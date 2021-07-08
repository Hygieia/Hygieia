import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NgbModule, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { SharedModule } from 'src/app/shared/shared.module';

import { TestDeleteFormComponent } from './test-delete-form.component';
import { ReactiveFormsModule } from '@angular/forms';
import {TestModule} from '../test.module';

describe('TestDeleteFormComponent', () => {
  let component: TestDeleteFormComponent;
  let fixture: ComponentFixture<TestDeleteFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [TestModule, ReactiveFormsModule, NgbModule, SharedModule, HttpClientTestingModule],
      providers: [NgbActiveModal]
    })

      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TestDeleteFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call ngOnInit()', () => {
    component.ngOnInit();
  });

  it('should set widget config', () => {
    const widgetConfigData = {
      options: {
        id: 'test0'
      }
    };
    component.widgetConfig = widgetConfigData;
    component.widgetConfig = null;
  });

  it('should get/add functional tests', () => {
    expect(component.functionalTests.controls.length).toBe(0);
    component.addFunctionalTest();
    expect(component.functionalTests.controls.length).toBe(1);
    component.addFunctionalTest();
    expect(component.functionalTests.controls.length).toBe(2);
  });

  it('should get/add performance tests', () => {
    expect(component.performanceTests.controls.length).toBe(0);
    component.addPerformanceTest();
    expect(component.performanceTests.controls.length).toBe(1);
    component.addPerformanceTest();
    expect(component.performanceTests.controls.length).toBe(2);
  });

  it('should load saved security scan job', () => {
    component.getSavedTestResults();
  });

  it('should submit delete form', () => {
    component.functionalTests.controls = [];
    component.submitDeleteForm();
  });
});
