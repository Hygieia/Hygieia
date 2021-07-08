import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { By } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { SignupComponent } from './signup.component';
import {AuthService} from '../../core/services/auth.service';
import { of, throwError } from 'rxjs';


describe('SignupComponent', () => {
  let component: SignupComponent;
  let fixture: ComponentFixture<SignupComponent>;
  let router: Router;
  let authService;


  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        RouterTestingModule.withRoutes([]),
        HttpClientTestingModule
      ],
      declarations: [ SignupComponent ],
      providers: [ AuthService ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SignupComponent);
    component = fixture.componentInstance;
    router = TestBed.get(Router);
    authService = TestBed.get(AuthService);
    fixture.detectChanges();
  });
  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('username input should exist', () => {
    const field = fixture.debugElement.query(By.css('#username'));
    expect(field).toBeTruthy();
  });
  it('password input should exist', () => {
    const field = fixture.debugElement.query(By.css('#password'));
    expect(field).toBeTruthy();
  });
  it('confirmPassword input should exist', () => {
    const field = fixture.debugElement.query(By.css('#confirmPassword'));
    expect(field).toBeTruthy();
  });
  it('should tell ROUTER to navigate when login clicked', () => {
    const navigateSpy = spyOn(router, 'navigate');
    component.login();
    expect(navigateSpy).toHaveBeenCalledWith(['/user/login']);
  });
  it('should register new user', () => {
    const spy = spyOn(authService, 'register').and.returnValue(of({}));
    const obj = { value : {
      username : 'test',
      passwordGroup: { password: 'test' }
    }};
    component.submit(obj);
    expect(spy).toHaveBeenCalledWith({username: 'test', password: 'test'});
  });

  it('should throw error on auth fail', () => {
    spyOn(authService, 'register').and.returnValue(throwError('foo'));
    const obj = { value : {
      username : 'test',
      passwordGroup: { password: 'test' }
    }};
    component.submit(obj);
    expect(component.errorMessage).toEqual('User already exists');
  });
});
