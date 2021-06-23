import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { of, Observable } from "rxjs";
import { filter, map, tap } from "rxjs/operators";

import { ITeamPipe, IProductResponse } from "./interfaces";

@Injectable({
  providedIn: "root",
})
export class ProductService {
  productDetailRoute = "/api/pipeline/";

  constructor(private http: HttpClient) {}

  commits(
    beginDate: string,
    endDate: string,
    collectorItemId: string
  ): Observable<ITeamPipe[]> {
    const params = {
      params: new HttpParams()
        .set("beginDate", beginDate)
        .set("endDate", endDate)
        .set("collectorItemId", collectorItemId),
    };
    return this.http.get<ITeamPipe[]>(this.productDetailRoute, params);
  }
}
