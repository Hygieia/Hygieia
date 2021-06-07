import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { of } from 'rxjs';
import { map, switchMap, take } from 'rxjs/operators';
import { CollectorService } from 'src/app/shared/collector.service';
import { DashboardService } from 'src/app/shared/dashboard.service';

@Component({
  selector: 'app-product-delete-form',
  templateUrl: './product-delete-form.component.html',
  styleUrls: ['./product-delete-form.component.scss']
})
export class ProductDeleteFormComponent implements OnInit {

  // buttons
  public confirm = 'Confirm';
  public cancel = 'Cancel';
  @Input() public message = 'This product item will be deleted immediately. Would you like to delete?';

  widgetConfigId: string;
  private componentId: string;

  productDeleteForm: FormGroup;

  @Input()
  set widgetConfig(widgetConfig: any) {
    if (!widgetConfig) {
      return;
    }
    this.widgetConfigId = widgetConfig.options.id;
    this.productDeleteForm.get('productDurationThreshold').setValue(widgetConfig.options.productDurationThreshold);
    this.productDeleteForm.get('consecutiveFailureThreshold').setValue(widgetConfig.options.consecutiveFailureThreshold);
  }

  constructor(
    public activeModal: NgbActiveModal,
    public formProducter: FormBuilder,
    public collectorService: CollectorService,
    public dashboardService: DashboardService
  ) {
    this.createDeleteForm();
  }

  ngOnInit() {
    this.getSavedProductJob();
    this.getDashboardComponent();
  }

  public createDeleteForm() {
    this.productDeleteForm = this.formProducter.group({
        productDurationThreshold: '',
        consecutiveFailureThreshold: '',
        productJob: ''
    });
  }

  public getSavedProductJob() {
    this.dashboardService.dashboardConfig$.pipe(take(1),
      map(dashboard => {
        const productCollector = dashboard.application.components[0].collectorItems.Product;
        const savedCollectorProductJob = productCollector ? productCollector[0].description : null;

        if (savedCollectorProductJob) {
          const productId = productCollector[0].id;
          return productId;
        }
        return null;
      }),
      switchMap(productId => {
        if (productId) {
          return this.collectorService.getItemsById(productId);
        }
        return of(null);
      })).subscribe(collectorData => {
      this.productDeleteForm.get('productJob').setValue(collectorData);
    });
  }

  public submitDeleteForm() {
    const deleteConfig = {
      name: 'product',
      options: {
        id: this.widgetConfigId,
        productDurationThreshold: +this.productDeleteForm.value.productDurationThreshold,
        consecutiveFailureThreshold: +this.productDeleteForm.value.consecutiveFailureThreshold
      },
      componentId: this.componentId,
      collectorItemId: this.productDeleteForm.value.productJob.id
    };
    this.activeModal.close(deleteConfig);
  }

  private getDashboardComponent() {
    this.dashboardService.dashboardConfig$.pipe(take(1),
      map(dashboard => {
        return dashboard.application.components[0].id;
      })).subscribe(componentId => this.componentId = componentId);
  }
}
