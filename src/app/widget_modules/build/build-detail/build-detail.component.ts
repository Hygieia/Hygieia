import { Component, Input, Type, ViewChild, OnInit } from "@angular/core";
import { MatVerticalStepper } from "@angular/material/stepper";
import { Router } from "@angular/router";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";

@Component({
  selector: "app-build-detail",
  templateUrl: "./build-detail.component.html",
  styleUrls: ["./build-detail.component.scss"],
})
export class BuildDetailComponent implements OnInit {
  @Input() detailView: Type<any>;
  @ViewChild(MatVerticalStepper, { static: false }) stepper: MatVerticalStepper;

  public data;
  public readableDuration;
  public buildStatusArray = [`Success`, `Failed`, `Failure`, `Aborted`];
  public stageStatusArray = [
    `SUCCESS`,
    `FAILED`,
    `FAILURE`,
    `ABORTED`,
    `NOT_EXECUTED`,
  ];

  constructor(public activeModal: NgbActiveModal, public router: Router) {}

  ngOnInit() {}

  @Input()
  set detailData(data: any) {
    if (data.data) {
      this.data = data.data;
    } else {
      this.data = [data];
    }

    // Truncate error messages
    this.data[0].stages.map((stage) => {
      if (stage.error && stage.error.message) {
        stage.error.message = `${stage.error.message.substring(0, 150)} ...`;
      }
    });

    if (this.data[0].duration) {
      this.readableDuration = this.convertToReadable(this.data[0].duration);
    } else {
      this.readableDuration = "-- : -- : --";
    }
  }

  // Converts build duration to HH:mm:ss format
  convertToReadable(timeInMiliseconds): string {
    const hours = Math.floor(timeInMiliseconds / 1000 / 60 / 60);
    let hoursString = hours.toString();
    if (hours < 10) {
      hoursString = `0${hours.toString()}`;
    }

    const minutes = Math.floor(
      (timeInMiliseconds / 1000 / 60 / 60 - hours) * 60
    );
    let minutesString = minutes.toString();
    if (minutes < 10) {
      minutesString = `0${minutes.toString()}`;
    }

    const seconds = Math.floor(
      ((timeInMiliseconds / 1000 / 60 / 60 - hours) * 60 - minutes) * 60
    );
    let secondsString = seconds.toString();
    if (seconds < 10) {
      secondsString = `0${seconds.toString()}`;
    }

    return `${hoursString}:${minutesString}:${secondsString}`;
  }

  getTooltipInfo(stage) {
    const tooltipObj = {
      Status: stage.status,
      "Duration (ms)": stage.durationMillis,
    };
    return JSON.stringify(tooltipObj);
  }

  openStandaloneView() {
    this.activeModal.close();
    this.router.navigate([`/build/${this.data[0].buildId}`]);
  }

  buildStatusCheck(status: string): boolean {
    return this.buildStatusArray.includes(status);
  }

  stageStatusCheck(status: string): string {
    if (this.stageStatusArray.includes(status)) {
      return status;
    }
    return `default`;
  }
}
