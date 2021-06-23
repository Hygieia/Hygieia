import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { StechProdTemplateComponent } from './stech-prod-template.component';
import {NO_ERRORS_SCHEMA} from '@angular/core';

describe('StechProdTemplateComponent', () => {
  let component: StechProdTemplateComponent;
  let fixture: ComponentFixture<StechProdTemplateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        StechProdTemplateComponent
      ],
      schemas: [ NO_ERRORS_SCHEMA ]
    });
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StechProdTemplateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
