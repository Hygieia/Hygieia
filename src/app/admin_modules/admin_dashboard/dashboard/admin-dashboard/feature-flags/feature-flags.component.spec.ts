import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import {NgbActiveModal, NgbModal, NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {FormBuilder, FormsModule, ReactiveFormsModule} from '@angular/forms';
import {CommonModule} from '@angular/common';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {FeatureFlagsComponent} from './feature-flags.component';
import {UserDataService} from '../../../services/user-data.service';
import {DashTrashComponent} from '../../../../../shared/dash-trash/dash-trash.component';
import {DashEditComponent} from '../../../../../shared/dash-edit/dash-edit.component';
import {CreateOrUpdateFeatureFlagsComponent} from '../modal/create-or-update-feature-flags/create-or-update-feature-flags.component';
import {GeneralDeleteComponent} from '../../../../../shared/modals/general-delete-modal/general-delete-modal.component';
import {GeneralFilterPipe} from '../../../../../shared/pipes/filter.pipe';
import {GeneralOrderByPipe} from '../../../../../shared/pipes/order-by.pipe';
import {NgxPaginationModule} from 'ngx-pagination';

/*@NgModule({
  declarations: [FeatureFlagsComponent, DashEditComponent, DashTrashComponent, AdminDeleteComponent],
  providers: [UserDataService, NgbModal],
  imports: [FormsModule, CommonModule, ReactiveFormsModule, NgbModule, HttpClientTestingModule],
  entryComponents: [
    FeatureFlagsComponent,
    AdminDeleteComponent,
    CreateOrUpdateFeatureFlagsComponent
  ]
})
class TestModule { }*/

class MockModalRef {
  componentInstance = {
    id: undefined,
    name: undefined,
    description: undefined,
    flags: undefined,
    title: undefined
  };
  result: Promise<boolean> = new Promise((res, rej) => res(true));
}

describe('FeatureFlagsComponent', () => {
  let component: FeatureFlagsComponent;
  let fixture: ComponentFixture<FeatureFlagsComponent>;
  let modal: NgbModal;
  const id = '123';
  const name = 'name';
  const description = 'description';
  const flags = {
    agileTool: false,
    artifact: false,
    build: false,
    codeQuality: false,
    deployment: false,
    libraryPolicy: false,
    scm: false,
    staticSecurityScan: false,
    test: false,
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FeatureFlagsComponent, DashTrashComponent, DashEditComponent, CreateOrUpdateFeatureFlagsComponent,
        GeneralFilterPipe, GeneralOrderByPipe, GeneralDeleteComponent],
      providers: [UserDataService, FormBuilder, NgbActiveModal],
      imports: [ReactiveFormsModule, NgbModule, FormsModule, CommonModule, HttpClientTestingModule, NgxPaginationModule]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FeatureFlagsComponent);
    component = fixture.componentInstance;
    component.name = name;
    component.id = id;
    component.description = description;
    component.flags = flags;
    modal = TestBed.get(NgbModal);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should hit flagKeys', () => {
    component.flagKeys({test: 'test'});
  });

  it('should add new feature flag', () => {
    spyOn(modal, 'open').and.returnValue(new MockModalRef());
    component.addNewFeatureFlag();
    expect(modal.open).toHaveBeenCalled();
  });

  it('should edit feature flag', () => {
    const mockFlagObj = {
      id: 'id',
      name: 'name',
      description: 'desc',
      flags: 'flags'
    };
    spyOn(modal, 'open').and.returnValue(new MockModalRef());
    component.editFeatureFlag(mockFlagObj);
    expect(modal.open).toHaveBeenCalled();
  });

  it('should delete feature flag', () => {
    spyOn(modal, 'open').and.returnValue(new MockModalRef());
    component.deleteFeatureFlag({name: 'name', id: 'id'});
    expect(modal.open).toHaveBeenCalled();
  });
});
