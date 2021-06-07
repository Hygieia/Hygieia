import {inject, TestBed} from '@angular/core/testing';

import { OpensourceScanService } from './opensource-scan.service';
import {HttpClientTestingModule, HttpTestingController} from '@angular/common/http/testing';

describe('OpensourceScanService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    imports: [
      HttpClientTestingModule
    ]
  }).compileComponents());

  it('should be created', () => {
    const service: OpensourceScanService = TestBed.get(OpensourceScanService);
    expect(service).toBeTruthy();
  });

  it('should fetch valid OSS data',
    inject([HttpTestingController, OpensourceScanService],
      (httpMock: HttpTestingController, service: OpensourceScanService) => {
        // We call the service
        service.fetchDetails('123', 1).subscribe(data => {
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
                name : 'QA',
                id: 'OSS_ID',
                collectorItemId: 'coll_id',
                timestamp: 1555590574399,
                threats: {
                  License: [],
                  Security: []
                },
                reportUrl: 'https://www.w3schools.com/',
                scanState: 'scan state'
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
