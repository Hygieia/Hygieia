import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import {IStaticAnalysis, IStaticAnalysisResponse} from './interfaces';

@Injectable({
  providedIn: 'root'
})
export class StaticAnalysisService {

  staticAnalysisRoute = '/api/quality/static-analysis';

  constructor(private http: HttpClient) { }

  private getParams(componentId: string, max: number) {
    return {
      params: new HttpParams().set('componentId', componentId).set('max', max.toString())
    };
  }

  fetchStaticAnalysis(componentId: string, max: number): Observable<IStaticAnalysis[]> {
    return this.http.get<IStaticAnalysisResponse>(this.staticAnalysisRoute, this.getParams(componentId, max)).pipe(
      map(response => response.result));
  }

}
