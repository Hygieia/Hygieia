import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormModalComponent } from './form-modal.component';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Directive } from '@angular/core';

@Directive({selector: '[appFormModal]'})
class FormModalStubsDirective { }

describe('FormModalComponent', () => {
  let component: FormModalComponent;
  let fixture: ComponentFixture<FormModalComponent>;
  let activeModal: NgbActiveModal;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormModalComponent, FormModalStubsDirective ],
      providers: [ NgbActiveModal ]
    });
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormModalComponent);
    component = fixture.componentInstance;
    activeModal = TestBed.get(NgbActiveModal);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should close modal on submit', () => {
    const spy = spyOn(activeModal, 'close').and.callThrough();
    component.onSubmit();
    expect(spy).toHaveBeenCalled();
  });

  it('should close modal on submit', () => {
    const spy = spyOn(activeModal, 'close').and.callThrough();
    component.closeModal();
    expect(spy).toHaveBeenCalledWith('Modal Closed');
  });
});
