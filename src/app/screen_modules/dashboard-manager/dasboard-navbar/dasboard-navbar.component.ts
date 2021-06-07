import { Component, OnInit, Input } from "@angular/core";

@Component({
  selector: "app-dasboard-navbar",
  templateUrl: "./dasboard-navbar.component.html",
  styleUrls: ["./dasboard-navbar.component.scss"],
})
export class DasboardNavbarComponent implements OnInit {
  @Input() title = "";
  constructor() {}

  ngOnInit() {}
}
