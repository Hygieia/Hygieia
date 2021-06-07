import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {map} from 'rxjs/operators';
import {Observable} from 'rxjs';
import {ISecurityScan, ISecurityScanResponse} from './security-scan-interfaces';

@Injectable({
  providedIn: 'root'
})
export class SecurityScanService {

  securityScanDetailEndPoint = '/api/quality/security-analysis';
  constructor(private http: HttpClient) {}

  getSecurityScanDetails(componentId: string, max: number): Observable<ISecurityScan[]> {
    return this.http.get<ISecurityScanResponse>(this.securityScanDetailEndPoint, this.getHttpParams(componentId, max))
      .pipe(map(response => response.result));
  }

  private getHttpParams(componentId: string, max: number) {
    return { params : new HttpParams().set('componentId', componentId).set('max', max.toString())};
  }
}
