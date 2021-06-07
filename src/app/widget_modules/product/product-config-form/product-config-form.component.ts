import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable, of } from 'rxjs';
import { catchError, debounceTime, distinctUntilChanged, map, switchMap, take, tap } from 'rxjs/operators';
import { CollectorService } from 'src/app/shared/collector.service';
import { DashboardService } from 'src/app/shared/dashboard.service';

@Component({
  selector: 'app-product-config-form',
  templateUrl: './product-config-form.component.html',
  styleUrls: ['./product-config-form.component.scss']
})
export class ProductConfigFormComponent implements OnInit {

  private widgetConfigId: string;
  private componentId: string;

  productConfigForm: FormGroup;
  searching = false;
  searchFailed = false;
  typeAheadResults: (text$: Observable<string>) => Observable<any>;

  getProductTitle = (collectorItem: any) => {
    if (!collectorItem) {
      return '';
    }
    const description = (collectorItem.description as string);
    return collectorItem.niceName + ' : ' + description;
  }

  @Input()
  set widgetConfig(widgetConfig: any) {
    if (!widgetConfig) {
      return;
    }
    this.widgetConfigId = widgetConfig.options.id;
    this.productConfigForm.get('productDurationThreshold').setValue(widgetConfig.options.productDurationThreshold);
    this.productConfigForm.get('consecutiveFailureThreshold').setValue(widgetConfig.options.consecutiveFailureThreshold);
  }

  constructor(
    public activeModal: NgbActiveModal,
    public formProducter: FormBuilder,
    private collectorService: CollectorService,
    private dashboardService: DashboardService
  ) {
    this.createForm();
  }

  ngOnInit() {
    this.typeAheadResults = (text$: Observable<string>) =>
      text$.pipe(
        debounceTime(300),
        distinctUntilChanged(),
        tap(() => this.searching = true),
        switchMap(term => {
          return term.length < 2 ? of([]) :
            this.collectorService.searchItems('product', term).pipe(
              tap(val => {
                if (!val || val.length === 0) {
                  this.searchFailed = true;
                  return of([]);
                }
                this.searchFailed = false;
              }),
              catchError(() => {
                this.searchFailed = true;
                return of([]);
              }));
        }),
        tap(() => this.searching = false)
      );

    this.loadSavedProductJob();
    this.getDashboardComponent();
  }

  public createForm() {
    this.productConfigForm = this.formProducter.group({
      productDurationThreshold: ['', Validators.required],
      consecutiveFailureThreshold: '',
      productJob: ''
    });
  }

  public submitForm() {
    const newConfig = {
      name: 'product',
      options: {
        id: this.widgetConfigId ? this.widgetConfigId : 'product0',
        productDurationThreshold: +this.productConfigForm.value.productDurationThreshold,
        consecutiveFailureThreshold: +this.productConfigForm.value.consecutiveFailureThreshold
      },
      componentId: this.componentId,
      collectorItemId: this.productConfigForm.value.productJob.id
    };
    this.activeModal.close(newConfig);
  }

  public loadSavedProductJob() {
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
        this.productConfigForm.get('productJob').setValue(collectorData);
      });
  }

  private getDashboardComponent() {
    this.dashboardService.dashboardConfig$.pipe(take(1),
      map(dashboard => {
        return dashboard.application.components[0].id;
      })).subscribe(componentId => this.componentId = componentId);
  }

  // convenience getter for easy access to form fields
  get configForm() { return this.productConfigForm.controls; }
}
