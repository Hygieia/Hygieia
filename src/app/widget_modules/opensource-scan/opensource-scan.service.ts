import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { IOpensourceScan, IOpensourceScanResponse } from './interfaces';

@Injectable({
  providedIn: 'root'
})
export class OpensourceScanService {

  detailRoute = '/api/libraryPolicy/';

  constructor(private http: HttpClient) { }

  fetchDetails(componentId: string, maxCnt: number): Observable<IOpensourceScan[]> {
    const params = {
      params: new HttpParams().set('componentId', componentId).set('max', maxCnt.toFixed(0))
    };
    return this.http.get<IOpensourceScanResponse>(this.detailRoute, params).pipe(
      map(response => response.result));
  }
}
