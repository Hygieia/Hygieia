import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CommonModule } from '@angular/common';
import { ManageAdminsComponent } from './manage-admins.component';
import { UserDataService } from '../../../services/user-data.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import {GeneralFilterPipe} from '../../../../../shared/pipes/filter.pipe';
import {GeneralOrderByPipe} from '../../../../../shared/pipes/order-by.pipe';
import {NgxPaginationModule} from 'ngx-pagination';
import { of, throwError } from 'rxjs';

describe('ManageAdminsComponent', () => {
  let component: ManageAdminsComponent;
  let fixture: ComponentFixture<ManageAdminsComponent>;
  let userService: UserDataService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ManageAdminsComponent, GeneralFilterPipe, GeneralOrderByPipe],
      providers: [UserDataService],
      imports: [FormsModule, CommonModule, ReactiveFormsModule, HttpClientTestingModule, NgxPaginationModule]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageAdminsComponent);
    component = fixture.componentInstance;
    userService = TestBed.get(UserDataService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should not load users if error on promote user to admin', () => {
    spyOn(userService, 'promoteUserToAdmin').and.returnValue(throwError('error'));
    const func = spyOn(component, 'loadUser').and.callThrough();
    component.promoteUserToAdmin({});
    expect(func).toHaveBeenCalledTimes(0);
  });

  it('should promote user to admin and load users', () => {
    spyOn(userService, 'promoteUserToAdmin').and.returnValue(of({}));
    const func = spyOn(component, 'loadUser');
    component.promoteUserToAdmin({});
    expect(func).toHaveBeenCalled();
  });

  it('should demote user from admin', () => {
    spyOn(userService, 'demoteUserFromAdmin').and.returnValue(of({}));
    const func = spyOn(component, 'loadUser');
    component.demoteUserFromAdmin({});
    expect(func).toHaveBeenCalled();
  });

  it('should not load users if error on demote user from admin', () => {
    spyOn(userService, 'demoteUserFromAdmin').and.returnValue(throwError('error'));
    const func = spyOn(component, 'loadUser');
    component.demoteUserFromAdmin({});
    expect(func).toHaveBeenCalledTimes(0);
  });
});
