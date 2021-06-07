import {inject, TestBed} from '@angular/core/testing';

import { SecurityScanService } from './security-scan.service';
import {HttpClientTestingModule, HttpTestingController} from '@angular/common/http/testing';

describe('SecurityScanService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    imports: [
      HttpClientTestingModule
    ]
  }).compileComponents());

  it('should be created', () => {
    const service: SecurityScanService = TestBed.get(SecurityScanService);
    expect(service).toBeTruthy();
  });

  it('should fetch valid Security Scan data',
    inject([HttpTestingController, SecurityScanService],
      (httpMock: HttpTestingController, service: SecurityScanService) => {
        // We call the service
        service.getSecurityScanDetails('123', 1).subscribe(data => {
          expect(data).toBeTruthy();
        });
        // We set the expectations for the HttpClient mock
        const request = httpMock
          .expectOne(req => req.method === 'GET');
        expect(request.request.method).toEqual('GET');
        // Then we set the fake data to be returned by the mock
        request.flush(
          {
            result: [
              {
                id: 'testId',
                collectorItemId: 'testCollItemId',
                timestamp: 1234,
                type: 'SecurityAnalysis',
                metrics: [
                  {
                    name: 'High',
                    value: '6',
                    formattedValue: '6',
                    status: 'Alert'
                  },
                  {
                    name: 'Score',
                    value: '62',
                    formattedValue: '62'
                  },
                ]
              }
            ]
          }
        );
      })
  );

  afterEach(inject([HttpTestingController], (httpMock: HttpTestingController) => {
    httpMock.verify();
  }));
});
