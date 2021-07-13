import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs';
import { ISecurityScanResponse} from './security-scan-interfaces';
import { ICollItem } from 'src/app/viewer_modules/collector-item/interfaces';

@Injectable({
  providedIn: 'root'
})
export class SecurityScanService {

  collectorItemsEndpoint = '/api/collector/item/component';
  codeQualityEndpoint = '/api/ui-widget/code-quality';

  constructor(private http: HttpClient) {}

  getSecurityScanCollectorItems(componentId: string): Observable<ICollItem[]> {
    return this.http.get<ICollItem[]>(`${this.collectorItemsEndpoint}/${componentId}`, this.getCollectorItemParams());
  }

  private getCollectorItemParams() {
    return { params : new HttpParams().set('type', 'StaticSecurityScan')};
  }

  getCodeQuality(componentId, collectorItemId: string): Observable<ISecurityScanResponse> {
    return this.http.get<ISecurityScanResponse>(this.codeQualityEndpoint, this.getCodeQualityParams(componentId, collectorItemId));
  }

  private getCodeQualityParams(componentId, collectorItemId) {
    return { params : new HttpParams().set('componentId', componentId).set('collectorItemId', collectorItemId)};
  }

  refreshProject(refreshLink: string) {
    const prunedRefreshLink = refreshLink.split('.com')[1];
    const hostname = window.location.hostname;
    if (hostname.includes('localhost')) {
      return this.http.get(`http://${hostname}:8081${prunedRefreshLink}`);
    } else {
      return this.http.get(`https://${hostname}${prunedRefreshLink}`);
    }
  }

}
