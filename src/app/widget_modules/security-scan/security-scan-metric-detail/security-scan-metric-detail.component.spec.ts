import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SecurityScanMetricDetailComponent } from './security-scan-metric-detail.component';
import {CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import { MatTableModule } from '@angular/material/table';


describe('SecurityScanMetricDetailComponent', () => {
  let component: SecurityScanMetricDetailComponent;
  let fixture: ComponentFixture<SecurityScanMetricDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [MatTableModule],
      declarations: [ SecurityScanMetricDetailComponent ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]

    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SecurityScanMetricDetailComponent);
    component = fixture.componentInstance;
    const detailData = {
      title: 'scanTitle',
      url: 'scanUrl',
      lastUpdated: 1587131351,
      subtitles: [],
      status: 2,
      statusText: 'test'
    };
    component.data = detailData;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
