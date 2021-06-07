import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { inject, TestBed } from '@angular/core/testing';

import { StaticAnalysisService } from './static-analysis.service';

describe('StaticAnalysisService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    imports: [
      HttpClientTestingModule
    ]
  }).compileComponents());

  it('should be created', () => {
    const service: StaticAnalysisService = TestBed.get(StaticAnalysisService);
    expect(service).toBeTruthy();
  });

  it('should fetch valid code quality data',
    inject([HttpTestingController, StaticAnalysisService],
      (httpMock: HttpTestingController, service: StaticAnalysisService) => {
        // We call the service
        service.fetchStaticAnalysis('123', 10).subscribe(data => {
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
                id: '123',
                collectorItemId: '123',
                timestamp: 1550764955300,
                name: 'sonar-project-1',
                url: 'https://sonar.com',
                version: '0.0.1',
                metrics: [],
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
