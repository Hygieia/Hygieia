import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ProductWidgetComponent } from './product-widget/product-widget.component';

const routes: Routes = [
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProductRoutingModule {
  static components = [ProductWidgetComponent];
}
