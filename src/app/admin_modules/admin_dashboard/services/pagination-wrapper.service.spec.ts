import { TestBed, inject } from '@angular/core/testing';
import { PaginationWrapperService } from './pagination-wrapper.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HttpClientModule } from '@angular/common/http';
import { DashboardDataService } from './dashboard-data.service';
import { AdminDashboardService } from './dashboard.service';
import { AuthService } from 'src/app/core/services/auth.service';
import { MockDashboardDataService } from './mock-dashboard-data.service';
import { of } from 'rxjs';

describe('PaginationWrapperService', () => {
  let service: PaginationWrapperService;
  let dashboard: DashboardDataService;

  beforeEach(() => TestBed.configureTestingModule({
    imports: [HttpClientTestingModule, HttpClientModule],
    providers: [PaginationWrapperService,
      { provide: DashboardDataService, useClass: MockDashboardDataService },
      AdminDashboardService, AuthService]
  }));

  describe('getters', () => {
    beforeEach(() => {
      service = TestBed.get(PaginationWrapperService);
      dashboard = TestBed.get(DashboardDataService);
    });

    it('should calculate total items', () => {
      const spy = spyOn(dashboard, 'myDashboardsCount').and.returnValue(of({}));
      service.calculateTotalItemsMyDash('foo');
      expect(spy).toHaveBeenCalled();
    });

    it('should get total items', () => {
      service.totalItemsMyDash = 15;
      expect(service.getTotalItemsMyDash()).toEqual(15);
    });

    it('should get current page', () => {
      service.currentPage = 15;
      expect(service.getCurrentPage()).toEqual(15);
    });

    it('should get page size', () => {
      service.pageSize = 15;
      expect(service.getPageSize()).toEqual(15);
    });

    it('should get dashboards', () => {
      service.dashboards = 15;
      expect(service.getDashboards()).toEqual(15);
    });

    it('should get my dashboards', () => {
      service.mydash = 15;
      expect(service.getMyDashboards()).toEqual(15);
    });

    it('should set dashboards', () => {
      const mock = { id: 'foo'};
      service.setDashboards(mock);
      expect(service.dashboards).toEqual(mock);
    });
  });


  it('should be created', () => {
    const pageService: PaginationWrapperService = TestBed.get(PaginationWrapperService);
    expect(pageService).toBeTruthy();
  });


  it('should be calculate Total Items in dashboard ',
    inject(
      [HttpTestingController, PaginationWrapperService],
      (
        httpMock: HttpTestingController,
        pageService: PaginationWrapperService
      ) => {
        pageService.calculateTotalItems('').subscribe((data: any) => {
          expect(data).toBeTruthy();
        });

      }
    )
  );


  it('should be get Total Items dashboard ',
    inject(
      [PaginationWrapperService],
      (
      ) => {
        const servicePage: PaginationWrapperService = TestBed.get(PaginationWrapperService);
        servicePage.totalItems = 200;
        expect(servicePage.getTotalItems()).toEqual(200);
      }
    )
  );

  it('should be page Change Handler ',
    inject(
      [ PaginationWrapperService],
      (
        pageService: PaginationWrapperService
      ) => {
        pageService.pageChangeHandler(1, '').subscribe((data: any) => {
          expect(data).toBeTruthy();
        });
      }
    )
  );


  it('should be page Change Handler For MyDash ',
    inject(
      [HttpTestingController, PaginationWrapperService],
      (
        httpMock: HttpTestingController,
        pageService: PaginationWrapperService
      ) => {
        pageService.pageChangeHandlerForMyDash(1, '').subscribe((data: any) => {
          expect(data).toBeTruthy();
        });
      }
    )
  );

});
