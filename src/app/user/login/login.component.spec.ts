import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ReactiveFormsModule } from '@angular/forms';

import { LoginComponent } from './login.component';
import { AuthService } from '../../core/services/auth.service';


describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let router: Router;
  let authService: AuthService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        RouterTestingModule.withRoutes([]),
        HttpClientTestingModule
      ],
      declarations: [ LoginComponent ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    authService = TestBed.get(AuthService);
    router = TestBed.get(Router);
    fixture.detectChanges();
  });
  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should tell ROUTER to navigate when sign up clicked', () => {
    const navigateSpy = spyOn(router, 'navigate');
    component.signUp();
    expect(navigateSpy).toHaveBeenCalledWith(['/user/signup']);
  });
  it('should be standard login', () => {
    component.activeTab = 'STANDARD';
    expect(component.isStandLogin).toBeTruthy();
  });
  it('should be ldap login', () => {
    component.activeTab = 'LDAP';
    expect(component.isLdapLogin).toBeTruthy();
  });
  it('should get authentication providers', () => {
    const data = ['STANDARD', 'LDAP'];

    const spy = spyOn(authService, 'getAuthenticationProviders').and.returnValue( of( data ) );

    component.getAuthProviders();
    expect(spy).toHaveBeenCalled();

    expect(component.authenticationProviders).toContain('STANDARD');
    expect(component.authenticationProviders.length).toBe(2);
  });
  it('should login with STANDARD user', () => {
    component.activeTab = 'STANDARD';
    const spy = spyOn(authService, 'login').and.returnValue({ subscribe: () => true });
    const obj = { value : {
        username : 'test',
        password: 'test'
      }};
    component.submit(obj);
    expect(spy).toHaveBeenCalledWith({username: 'test', password: 'test'});
  });
  it('should login with LDAP user', () => {
    component.activeTab = 'LDAP';
    const spy = spyOn(authService, 'loginLdap').and.returnValue({ subscribe: () => true });
    const obj = { value : {
        username : 'test',
        password: 'test'
      }};
    component.submit(obj);
    expect(spy).toHaveBeenCalledWith({username: 'test', password: 'test'});
  });

  it('should login with SSO user', () => {
    component.activeTab = 'SSO';
    const spy = spyOn(router, 'navigate').and.returnValue({ subscribe: () => true });
    const obj = { value : {
      username : 'test',
      password: 'test'
    }};
    component.submit(obj);
    expect(spy).toHaveBeenCalledWith(['/user/sso']);
  });

  it('should check sso variables', () =>  {
    component.setActiveTab('SSO');
    expect(component.isSsoLogin()).toBe(true);
    expect(component.loginBtnName()).toBe('Single Sign On');
  });
});

