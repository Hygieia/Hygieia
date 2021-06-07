import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { DasboardNavbarComponent } from "./dasboard-navbar.component";

describe("DasboardNavbarComponent", () => {
  let component: DasboardNavbarComponent;
  let fixture: ComponentFixture<DasboardNavbarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [DasboardNavbarComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DasboardNavbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
