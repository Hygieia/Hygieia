import { HttpClient } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { async, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { NfrrService } from './nfrr.service';

describe('NfrrService', () => {
    let service: NfrrService;
    let http: HttpClient;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [ HttpClientTestingModule ]
        });
    }));

    beforeEach(() => {
        service = TestBed.get(NfrrService);
        http = TestBed.get(HttpClient);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should get all audit metrics', () => {
        const spy = spyOn(service, 'getTotalElementsCount').and.returnValue(of({}));
        service.getAuditMetricsAll();
        expect(spy).toHaveBeenCalled();
    });

    it('should get audit metrics by lob', () => {
        const spy = spyOn(service, 'getTotalElementsCount').and.returnValue(of({}));
        service.getAuditMetricsByLob('foo');
        expect(spy).toHaveBeenCalled();
    });

    it('should get total elements count', () => {
        const spy = spyOn(http, 'get').and.returnValue(of({}));
        service.getTotalElementsCount('foo');
        expect(spy).toHaveBeenCalled();
    });
});
