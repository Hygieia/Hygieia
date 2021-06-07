import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { CaponeTemplateComponent } from "./capone-template.component";
import { NO_ERRORS_SCHEMA } from "@angular/core";

describe("CaponeTemplateComponent", () => {
  let component: CaponeTemplateComponent;
  let fixture: ComponentFixture<CaponeTemplateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CaponeTemplateComponent],
      schemas: [NO_ERRORS_SCHEMA],
    });
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CaponeTemplateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
