import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { StechTeamTemplateComponent } from "./stech-team-template.component";
import { NO_ERRORS_SCHEMA } from "@angular/core";

describe("StechTeamTemplateComponent", () => {
  let component: StechTeamTemplateComponent;
  let fixture: ComponentFixture<StechTeamTemplateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [StechTeamTemplateComponent],
      schemas: [NO_ERRORS_SCHEMA],
    });
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StechTeamTemplateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
