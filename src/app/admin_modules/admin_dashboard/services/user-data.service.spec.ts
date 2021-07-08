import { TestBed, inject } from '@angular/core/testing';
import { UserDataService } from './user-data.service';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { API_TOKEN_LIST, USER_LIST } from './user-data.service.mockdata';
import {
  HttpClientTestingModule,
  HttpTestingController
} from '@angular/common/http/testing';
import { of } from 'rxjs';

describe('UserDataService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    imports: [HttpClientTestingModule, HttpClientModule],
    providers: [UserDataService]
  }));

  describe('UserDataService functions', () => {
    let service: UserDataService;
    let http: HttpClient;

    beforeEach(() => {
      service = TestBed.get(UserDataService);
      http = TestBed.get(HttpClient);
    });

    it('get service account', () => {
      const spy = spyOn(http, 'get').and.returnValue(of({}));
      service.getServiceAccounts();
      expect(spy).toHaveBeenCalled();
    });

    it('should create account', () => {
      const spy = spyOn(http, 'post').and.returnValue(of({}));
      service.createAccount({});
      expect(spy).toHaveBeenCalled();
    });

    it('should delete service account', () => {
      const spy = spyOn(http, 'delete').and.returnValue(of({}));
      service.deleteServiceAccount({});
      expect(spy).toHaveBeenCalled();
    });

    it('should promote user to admin', () => {
      const spy = spyOn(http, 'post').and.returnValue(of({}));
      service.promoteUserToAdmin({});
      expect(spy).toHaveBeenCalled();
    });

    it('should demote user from admin', () => {
      const spy = spyOn(http, 'post').and.returnValue(of({}));
      service.demoteUserFromAdmin({});
      expect(spy).toHaveBeenCalled();
    });

    it('should delete properties', () => {
      const spy = spyOn(http, 'delete').and.returnValue(of({}));
      service.deleteProperties({});
      expect(spy).toHaveBeenCalled();
    });
  });

  it('should be created',
    inject(
      [HttpTestingController, UserDataService],
      (
        httpMock: HttpTestingController,
        userDataService: UserDataService
      ) => {
        expect(userDataService).toBeTruthy();
      }
    )
  );

  it('should be Get Api Token',
    inject(
      [HttpTestingController, UserDataService],
      (
        httpMock: HttpTestingController,
        userDataService: UserDataService
      ) => {
        userDataService.apitokens().subscribe((data: any) => {
          expect(data).toBeTruthy();
          expect(data.length).toBe(2);
        });

        const request = httpMock.expectOne(req => req.method === 'GET');
        request.flush(API_TOKEN_LIST);

      }
    )
  );

  it('should be Get user List',
    inject(
      [HttpTestingController, UserDataService],
      (
        httpMock: HttpTestingController,
        userDataService: UserDataService
      ) => {
        userDataService.apitokens().subscribe((data: any) => {
          expect(data).toBeTruthy();
          expect(data.length).toBe(2);
        });

        const request = httpMock.expectOne(req => req.method === 'GET');
        request.flush(USER_LIST);

      }
    )
  );


  it('should be able to update token',
    inject([HttpTestingController, UserDataService],
      (httpMock: HttpTestingController, service: UserDataService) => {

        service.updateToken(API_TOKEN_LIST[0], '12345678901234567890').subscribe(result => {
          expect(result).toBeTruthy();
        });

        const request = httpMock.expectOne(req => req.method === 'POST');
        request.flush(API_TOKEN_LIST[0]);
      })
  );

  it('should be able to create token',
    inject([HttpTestingController, UserDataService],
      (httpMock: HttpTestingController, service: UserDataService) => {

        service.createToken(API_TOKEN_LIST[0]).subscribe(result => {
          expect(result).toBeTruthy();
        });

        const request = httpMock.expectOne(req => req.method === 'POST');
        request.flush(API_TOKEN_LIST[0]);
      })
  );

  it('should be able to delete token',
    inject([HttpTestingController, UserDataService],
      (httpMock: HttpTestingController, service: UserDataService) => {

        service.deleteToken(API_TOKEN_LIST[0].id).subscribe(result => {
          expect(result).toBeTruthy();
        });

        const request = httpMock.expectOne(req => req.method === 'DELETE');
        request.flush(API_TOKEN_LIST[0].id);
      })
  );

});
