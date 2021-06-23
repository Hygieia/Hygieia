import Dexie from "dexie";
import { Injectable } from "@angular/core";
import { of, from, Observable } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class ProductPipelineService extends Dexie {
  // // Declare implicit table properties.
  // // (just to inform Typescript. Instanciated by Dexie in stores() method)
  // contacts: Dexie.Table<IContact, number>; // number = type of the primkey
  // // ...other tables goes here...
  lastRequest: Dexie.Table<ILastRequest, string>; // string = type of the primkey
  testSuite: Dexie.Table<ITeamCDDdata, number>; // number = type of the primkey
  codeAnalysis: Dexie.Table<ITeamCDDdata, number>; // number = type of the primkey
  securityAnalysis: Dexie.Table<ITeamCDDdata, number>; // number = type of the primkey
  buildData: Dexie.Table<ITeamCDDdata, number>; // number = type of the primkey
  prodCommit: Dexie.Table<IProdCommitData, number>; // number = type of the primkey

  constructor() {
    super("ProductPipelineDb");
    this.version(1).stores({
      lastRequest: "[type+id]",
      testSuite: "++id,timestamp,[componentId+timestamp]",
      codeAnalysis: "++id,timestamp,[componentId+timestamp]",
      securityAnalysis: "++id,timestamp,[componentId+timestamp]",
      buildData: "++id,timestamp,[componentId+timestamp]",
      prodCommit: "++id,timestamp,[collectorItemId+timestamp]",
    });
    // this.version(1).stores({
    //     contacts: '++id, first, last',
    //     //...other tables goes here...
    // });
    // // The following line is needed if your typescript
    // // is compiled using babel instead of tsc:
    // this.contacts = this.table("contacts");
    // db.table("contacts").put({first: "First name", last: "Last name"});
    this.lastRequest = this.table("lastRequest");
    this.prodCommit = this.table("prodCommit");
  }

  // you can convert Promise to Observable using from(), but no need
  getLastRequest(
    collectorItemId: string
  ): Dexie.Collection<ILastRequest, string> {
    return this.lastRequest
      .where("[type+id]")
      .equals(["pipeline-commit", collectorItemId]);
    // .toArray();
  }

  addLastRequest(newRequest: ILastRequest): void {
    this.getLastRequest(newRequest.id).count((count) => {
      this.lastRequest.add(newRequest);
    });
  }

  getProdCommitData(
    collectorItemId: string,
    ninetyDaysAgo: number,
    dateEnds: number
  ): Dexie.Collection<IProdCommitData, number> {
    return this.prodCommit
      .where("[collectorItemId+timestamp]")
      .between([collectorItemId, ninetyDaysAgo], [collectorItemId, dateEnds]);
    // .toArray();
  }

  addProdCommitData(
    newRequest: IProdCommitData,
    ninetyDaysAgo: number,
    dateEnds: number
  ): void {
    this.getProdCommitData(
      newRequest.collectorItemId,
      ninetyDaysAgo,
      dateEnds
    ).count((count) => {
      if (count === 0) {
        this.prodCommit.add(newRequest);
      }
    });
    // this.prodCommit.add(newRequest);
  }

  deleteCommitData(table: Dexie.Table, beforeTimestamp: number): void {
    table
      .where("timestamp")
      .below(beforeTimestamp)
      .toArray(function (rows) {
        rows.forEach(function (row) {
          table.delete(row.id);
        });
      });
  }
}

// interface IContact {
//     id?: number,
//     first: string,
//     last: string
// }

export interface ILastRequest {
  id: string;
  type: string;
  timestamp?: number;
}

export interface ITeamCDDdata {
  id?: number;
  timestamp: number;
  componentId: string;
  idNum: number; // is number in old Hygieia UI
  success: boolean;
  inProgress: boolean;
}

export interface IProdCommitData {
  collectorItemId: string;
  id?: number;
  numberOfChanges: number;
  processedTimestamps: Record<string, number>; // { [key: string]: number }; // [];
  scmAuthor: string;
  scmCommitTimeStamp: number;
  scmRevisionNumber: string;
  timestamp: number;
}
