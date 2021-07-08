import { TestBed, inject } from '@angular/core/testing';
import { DashboardDataService } from './dashboard-data.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { DASHBOARDDATA } from './user-data.service.mockdata';
import { of, throwError } from 'rxjs';

describe('DashboardDataService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    imports: [HttpClientTestingModule, HttpClientModule],
    providers: [DashboardDataService]
  }));

  it('should be created', () => {
    const service: DashboardDataService = TestBed.get(DashboardDataService);
    expect(service).toBeTruthy();
  });


  it('should be search dashboard ',
    inject(
      [HttpTestingController, DashboardDataService],
      (
        httpMock: HttpTestingController,
        service: DashboardDataService
      ) => {
        service.search().subscribe((data: any) => {
          expect(data).toBeTruthy();
          expect(data.length).toBe(1);
        });

        const request = httpMock.expectOne(req => req.method === 'GET');
        request.flush(DASHBOARDDATA);

      }
    )
  );

  it('should be search by page dashboard ',
    inject(
      [HttpTestingController, DashboardDataService],
      (
        httpMock: HttpTestingController,
        service: DashboardDataService
      ) => {
        service.searchByPage('').subscribe((data: any) => {
          expect(data).toBeTruthy();
        });

        const request = httpMock.expectOne(req => req.method === 'GET');
        request.flush(DASHBOARDDATA);

      }
    )
  );

  it('should be filter by Title dashboard ',
    inject(
      [HttpTestingController, DashboardDataService],
      (
        httpMock: HttpTestingController,
        service: DashboardDataService
      ) => {
        service.filterByTitle('').subscribe((data: any) => {
          expect(data).toBeTruthy();
        });

        const request = httpMock.expectOne(req => req.method === 'GET');
        request.flush(DASHBOARDDATA);

      }
    )
  );

  it('should be filter Count dashboard ',
    inject(
      [HttpTestingController, DashboardDataService],
      (
        httpMock: HttpTestingController,
        service: DashboardDataService
      ) => {
        service.filterCount('', 'Team').subscribe((data: any) => {
          expect(data).toBeTruthy();
          expect(data.length).toBe(1);
        });

        const request = httpMock.expectOne(req => req.method === 'GET');
        request.flush(DASHBOARDDATA);

      }
    )
  );

  it('should be my dashboards Count',
    inject(
      [HttpTestingController, DashboardDataService],
      (
        httpMock: HttpTestingController,
        service: DashboardDataService
      ) => {
        service.myDashboardsCount('').subscribe((data: any) => {
          expect(data).toBeTruthy();
          expect(data.length).toBe(1);
        });

        const request = httpMock.expectOne(req => req.method === 'GET');
        request.flush(DASHBOARDDATA);

      }
    )
  );

  it('should be Count dashboard ',
    inject(
      [HttpTestingController, DashboardDataService],
      (
        httpMock: HttpTestingController,
        service: DashboardDataService
      ) => {
        service.count('Test').subscribe((data: any) => {
          expect(data).toBeTruthy();
        });

        const request = httpMock.expectOne(req => req.method === 'GET');
        request.flush('1');

      }
    )
  );


  it('should be Count search my Dashboards by Page ',
    inject(
      [HttpTestingController, DashboardDataService],
      (
        httpMock: HttpTestingController,
        service: DashboardDataService
      ) => {
        service.searchMyDashboardsByPage('').subscribe((data: any) => {
          expect(data).toBeTruthy();
        });

        const request = httpMock.expectOne(req => req.method === 'GET');
        request.flush(DASHBOARDDATA);

      }
    )
  );

  it('should be Count dashboard List',
    inject(
      [HttpTestingController, DashboardDataService],
      (
        httpMock: HttpTestingController,
        service: DashboardDataService
      ) => {
        service.filterMyDashboardsByTitle('').subscribe((data: any) => {
          expect(data).toBeTruthy();
        });

        const request = httpMock.expectOne(req => req.method === 'GET');
        request.flush(DASHBOARDDATA);

      }
    )
  );


  it('should be able to update BusItems',
    inject([HttpTestingController, DashboardDataService],
      (httpMock: HttpTestingController, service: DashboardDataService) => {

        service.updateBusItems('56d9cf6b7fab7c42f5918b84', DASHBOARDDATA[0]).subscribe(result => {
          expect(result).toBeTruthy();
        });

        const request = httpMock.expectOne(req => req.method === 'PUT');
        request.flush(DASHBOARDDATA[0]);
      })
  );


  it('should be able to update Dashboard Widgets',
    inject([HttpTestingController, DashboardDataService],
      (httpMock: HttpTestingController, service: DashboardDataService) => {

        service.updateDashboardWidgets('56d9cf6b7fab7c42f5918b84', DASHBOARDDATA[0]).subscribe(result => {
          expect(result).toBeTruthy();
        });

        const request = httpMock.expectOne(req => req.method === 'PUT');
        request.flush(DASHBOARDDATA[0]);
      })
  );


  it('should be able to update Owners',
    inject([HttpTestingController, DashboardDataService],
      (httpMock: HttpTestingController, service: DashboardDataService) => {

        service.updateOwners('56d9cf6b7fab7c42f5918b84', DASHBOARDDATA[0]).subscribe(result => {
          expect(result).toBeTruthy();
        });

        const request = httpMock.expectOne(req => req.method === 'PUT');
        request.flush(DASHBOARDDATA[0]);
      })
  );



  it('should be able to update Dashboard Widgets',
    inject([HttpTestingController, DashboardDataService],
      (httpMock: HttpTestingController, service: DashboardDataService) => {

        service.updateDashboardWidgets('56d9cf6b7fab7c42f5918b84', DASHBOARDDATA[0]).subscribe(result => {
          expect(result).toBeTruthy();
        });

        const request = httpMock.expectOne(req => req.method === 'PUT');
        request.flush(DASHBOARDDATA[0]);
      })
  );


  it('should be able to update DashboardScoreSettings',
    inject([HttpTestingController, DashboardDataService],
      (httpMock: HttpTestingController, service: DashboardDataService) => {

        service.updateDashboardScoreSettings('56d9cf6b7fab7c42f5918b84', true, 'HEADER').subscribe(result => {
          expect(result).toBeTruthy();
        });

        const request = httpMock.expectOne(req => req.method === 'PUT');
        request.flush(DASHBOARDDATA[0]);
      })
  );


  it('should be able to delete Dashboard',
    inject([HttpTestingController, DashboardDataService],
      (httpMock: HttpTestingController, service: DashboardDataService) => {

        service.deleteDashboard(DASHBOARDDATA[0]).subscribe(result => {
          expect(result).toBeTruthy();
        });

        const request = httpMock.expectOne(req => req.method === 'DELETE');
        request.flush(DASHBOARDDATA);
      })
  );

  it('should be Get mydashboard',
    inject(
      [HttpTestingController, DashboardDataService],
      (
        httpMock: HttpTestingController,
        service: DashboardDataService
      ) => {
        service.mydashboard('').subscribe((data: any) => {
          expect(data).toBeTruthy();
          expect(data.length).toBe(1);
        });

        const request = httpMock.expectOne(req => req.method === 'GET');
        request.flush(DASHBOARDDATA);

      }
    )
  );


  it('should be Get myowner',
    inject(
      [HttpTestingController, DashboardDataService],
      (
        httpMock: HttpTestingController,
        service: DashboardDataService
      ) => {
        service.myowner('').subscribe((data: any) => {
          expect(data).toBeTruthy();
          expect(data.length).toBe(1);
        });

        const request = httpMock.expectOne(req => req.method === 'GET');
        request.flush(DASHBOARDDATA);

      }
    )
  );


  it('should be get Component',
    inject(
      [HttpTestingController, DashboardDataService],
      (
        httpMock: HttpTestingController,
        service: DashboardDataService
      ) => {
        service.getComponent('').subscribe((data: any) => {
          expect(data).toBeTruthy();
          expect(data.length).toBe(1);
        });

        const request = httpMock.expectOne(req => req.method === 'GET');
        request.flush(DASHBOARDDATA);

      }
    )
  );


  it('should be get General Config',
    inject(
      [HttpTestingController, DashboardDataService],
      (
        httpMock: HttpTestingController,
        service: DashboardDataService
      ) => {
        service.getGeneralConfig('56d9cf6b7fab7c42f5918b84').subscribe((data: any) => {
          expect(data).toBeTruthy();
          expect(data.length).toBe(1);
        });

        const request = httpMock.expectOne(req => req.method === 'GET');
        request.flush(DASHBOARDDATA);

      }
    )
  );



  it('should be filter MyDashboard Count',
    inject(
      [HttpTestingController, DashboardDataService],
      (
        httpMock: HttpTestingController,
        service: DashboardDataService
      ) => {
        service.filterMyDashboardCount('', 'Team').subscribe((data: any) => {
          expect(data).toBeTruthy();
          expect(data.length).toBe(1);
        });

        const request = httpMock.expectOne(req => req.method === 'GET');
        request.flush(DASHBOARDDATA);

      }
    )
  );

  describe('Service functions', () => {
    let service: DashboardDataService;
    let http: HttpClient;

    beforeEach(() => {
      service = TestBed.get(DashboardDataService);
      http = TestBed.get(HttpClient);
    });

    it('should create new dashboard', () => {
      const spy = spyOn(http, 'post').and.returnValue(of({}));
      service.create({});
      expect(spy).toHaveBeenCalled();
    });

    it('should do nothing on error', () => {
      const spy = spyOn(http, 'post').and.returnValue(throwError('error'));
      service.create({});
      expect(spy).toHaveBeenCalled();
    });

    it('delete widget', () => {
      const spy = spyOn(http, 'put').and.returnValue(of({}));
      service.deleteWidget(1234, {});
      expect(spy).toHaveBeenCalled();
    });

    it('upsert widget', () => {
      const spy = spyOn(http, 'put').and.returnValue(of({}));
      service.upsertWidget(1234, { id: 1234 });
      expect(spy).toHaveBeenCalled();
    });

    it('save the general config data', () => {
      const spy = spyOn(http, 'put').and.returnValue(of({}));
      service.generalConfigSave({});
      expect(spy).toHaveBeenCalled();
    });

    it('console log error on failure to save general config data', () => {
      const spy = spyOn(http, 'put').and.returnValue(throwError('error'));
      service.generalConfigSave({});
      expect(spy).toHaveBeenCalled();
    });
  });

});
