import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IStaticAnalysisResponse} from './interfaces';
import { ICollItem } from 'src/app/viewer_modules/collector-item/interfaces';


@Injectable({
  providedIn: 'root'
})
export class StaticAnalysisService {

  collectorItemsEndpoint = '/api/collector/item/component';
  staticAnalysisRoute = '/api/quality/static-analysis'; // '/api/ui-widget/code-quality';  //

  constructor(private http: HttpClient) { }

  getStaticAnalysisCollectorItems(componentId: string): Observable<ICollItem[]> {
    return this.http.get<ICollItem[]>(`${this.collectorItemsEndpoint}/${componentId}`, this.getCollectorItemParams());
  }

  private getCollectorItemParams() {
    return { params : new HttpParams().set('type', 'CodeQuality')};
  }

  //  Use same endpoint as security scan
  getCodeQuality(componentId, collectorItemId: string): Observable<IStaticAnalysisResponse> {
    return this.http.get<IStaticAnalysisResponse>(this.staticAnalysisRoute, this.getStaticAnalysisParams(componentId, collectorItemId));
  }

  private getStaticAnalysisParams(componentId, collectorItemId) {
    return { params : new HttpParams().set('componentId', componentId).set('collectorItemId', collectorItemId)};
  }

  refreshProject(refreshLink: string) {
    return this.http.get(refreshLink);
  }

}
