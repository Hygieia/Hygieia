import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { DashEditComponent } from '../../../../../shared/dash-edit/dash-edit.component';
import { DashTrashComponent } from '../../../../../shared/dash-trash/dash-trash.component';
import { UserDataService } from '../../../services/user-data.service';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import {GeneralFilterPipe} from '../../../../../shared/pipes/filter.pipe';
import {GeneralOrderByPipe} from '../../../../../shared/pipes/order-by.pipe';
import {PropertiesBuilderComponent} from './properties-builder.component';
import {GeneralDeleteComponent} from '../../../../../shared/modals/general-delete-modal/general-delete-modal.component';
import {CreateOrUpdateApiPropertiesComponent} from '../modal/create-or-update-api-properties/create-or-update-api-properties.component';
import {NgModule} from '@angular/core';
import {NgbModal, NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {NgxPaginationModule} from 'ngx-pagination';
import { of } from 'rxjs';
import {
  CreateOrUpdateApiAuditPropertiesComponent
} from '../modal/create-or-update-api-audit-properties/create-or-update-api-audit-properties.component';

@NgModule({
  declarations: [PropertiesBuilderComponent, DashEditComponent, DashTrashComponent, GeneralFilterPipe,
    GeneralOrderByPipe, CreateOrUpdateApiPropertiesComponent, CreateOrUpdateApiAuditPropertiesComponent,
    GeneralDeleteComponent],
  providers: [UserDataService, NgbModal],
  imports: [FormsModule, CommonModule, ReactiveFormsModule, NgbModule, HttpClientTestingModule, NgxPaginationModule],
  entryComponents: [
    PropertiesBuilderComponent,
    CreateOrUpdateApiPropertiesComponent,
    GeneralDeleteComponent,
    CreateOrUpdateApiAuditPropertiesComponent
  ]
})
class TestModule { }

describe('PropertiesBuilderComponent', () => {
  let component: PropertiesBuilderComponent;
  let fixture: ComponentFixture<PropertiesBuilderComponent>;
  let userData: UserDataService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [TestModule],
    })
      .compileComponents();

  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PropertiesBuilderComponent);
    component = fixture.componentInstance;
    userData = TestBed.get(UserDataService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should loadServiceAccounts', () => {
    spyOn(userData, 'getPropertiesBuilderData').and.returnValue(of({}));
    component.ngOnInit();
  });

  it('should add new api properties builder', () => {
    component.addNewApiPropertiesBuilder();
  });

  it('should edit api properties builder', () => {
    const collector = {
      name: 'test',
      properties: 'test'
    };
    component.editApiPropertiesBuilder(collector);
  });

  it('should delete properties', () => {
    component.deleteProperties('123');
  });

  it('should stringify', () => {
    component.stringifyObj({123: '123'});
  });

  it('should hit properkeys', () => {
    component.properKeys({123: '123'});
  });

  it('should add new api audit', () => {
    component.addNewApiAuditPropertiesBuilder();
  });

  it('should edit api audit', () => {
    const collector = {
      name: 'test',
      properties: 'test'
    };
    component.editApiAuditPropertiesBuilder(collector);
  });
});
