import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
// import * as regression from "regression";

import { SharedModule } from "src/app/shared/shared.module";

import { ProductConfigFormComponent } from "./product-config-form/product-config-form.component";
import { ProductDetailComponent } from "./product-detail/product-detail.component";
import { ProductRoutingModule } from "./product-routing-module";
import { ProductWidgetComponent } from "./product-widget/product-widget.component";
import { ProductDeleteFormComponent } from "./product-delete-form/product-delete-form.component";

@NgModule({
  declarations: [
    ProductWidgetComponent,
    ProductConfigFormComponent,
    ProductDetailComponent,
    ProductDeleteFormComponent,
  ],
  entryComponents: [
    ProductWidgetComponent,
    ProductConfigFormComponent,
    ProductDetailComponent,
    ProductDeleteFormComponent,
  ],
  imports: [ProductRoutingModule, CommonModule, NgbModule, SharedModule],
  exports: [],
})
export class ProductModule {}
