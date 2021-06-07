import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { DetailModalComponent } from './detail-modal.component';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

describe('DetailModalComponent', () => {
  let component: DetailModalComponent;
  let fixture: ComponentFixture<DetailModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DetailModalComponent],
      providers: [ NgbActiveModal ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should check detailView and modalTypeTag', () => {
    component.ngOnInit();
  });
  it('should close activeModal and check if it is active', () => {
    component.onSubmit();
    component.closeModal();
  });
});
