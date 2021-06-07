import {ChangeDetectorRef, Component, ComponentFactoryResolver, Input, OnInit, Type, ViewChild} from '@angular/core';
import {map, switchMap, take} from 'rxjs/operators';
import {Observable, zip} from 'rxjs';
import { extend } from 'lodash';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {IAuditResult, IWidgetConfigResponse} from '../interfaces';
import {FormModalComponent} from '../modals/form-modal/form-modal.component';
import {WidgetComponent} from '../widget/widget.component';
import {WidgetDirective} from '../widget/widget.directive';
import {DashboardService} from '../dashboard.service';
import {AuditModalComponent} from '../modals/audit-modal/audit-modal.component';
import {DeleteConfirmModalComponent} from '../modals/delete-confirm-modal/delete-confirm-modal.component';
import {WidgetState} from './widget-state';
import {AuthService} from '../../core/services/auth.service';
// @ts-ignore
import moment from 'moment';

@Component({
  selector: 'app-widget-header',
  templateUrl: './widget-header.component.html',
  styleUrls: ['./widget-header.component.scss']
})

export class WidgetHeaderComponent implements OnInit {

  @Input() widgetType: Type<any>;
  @Input() title;
  @Input() status;
  @Input() configForm: Type<any>;
  @Input() deleteForm: Type<any>;
  @ViewChild(WidgetDirective, {static: true}) appWidget: WidgetDirective;
  public widgetComponent;
  auditStatus: string;
  lastUpdated: any;
  private auditResult: IAuditResult;

  // This only applies for test widget since it has both func & perf tests at once
  private auditResultOptional: IAuditResult;

  constructor(private componentFactoryResolver: ComponentFactoryResolver,
              private cdr: ChangeDetectorRef,
              private modalService: NgbModal,
              private dashboardService: DashboardService,
              private auth: AuthService) {
  }

  ngOnInit() {
    this.loadComponent();
  }

  loadComponent() {
    const componentFactory = this.componentFactoryResolver.resolveComponentFactory(this.widgetType);
    if (this.appWidget !== undefined) {
      const viewContainerRef = this.appWidget.viewContainerRef;
      viewContainerRef.clear();
      const componentRef = viewContainerRef.createComponent(componentFactory);
      this.widgetComponent = (componentRef.instance as WidgetComponent);
      this.widgetComponent.status = status;
    }
    this.detectChanges();
    if (this.widgetComponent) {
      this.findWidgetAuditStatus(this.widgetComponent.auditType);
      this.findLastUpdatedTime(this.getCollectorType(this.title));
    }
  }

  // Open the config modal and pass it necessary data. When it is closed pass the results to update them.
  openConfig() {
    const modalRef = this.modalService.open(FormModalComponent);
    if (!modalRef) {
      return;
    }
    modalRef.componentInstance.title = 'Configure Widget';
    modalRef.componentInstance.form = this.configForm;
    modalRef.componentInstance.id = 1;

    if (this.widgetComponent !== undefined) {
      this.widgetComponent.getCurrentWidgetConfig().subscribe(result => {
        modalRef.componentInstance.widgetConfig = result;
      });
      // Take form data, combine with widget config, and pass to update function
      modalRef.result.then((newConfig) => {
        if (!newConfig) {
          return;
        }
        // if widget config doesn't exist, set with new config
        if (!this.widgetComponent.widgetConfigExists) {
          this.widgetComponent.widgetConfigSubject.next(newConfig);
        }

        this.widgetComponent.stopRefreshInterval();
        this.updateWidgetConfig(newConfig);
      }).catch((error) => {
        console.log(error);
      });
    }
  }

  updateWidgetConfig(newWidgetConfig: any): void {
    if (!newWidgetConfig) {
      return;
    }

    // Take the current config and prepare it for saving
    const newWidgetConfig$ = this.widgetComponent.getCurrentWidgetConfig().pipe(
      map( widgetConfig => {
        extend(widgetConfig, newWidgetConfig);
        return widgetConfig;
      }),
      map((widgetConfig: any) => {
        if (widgetConfig.collectorItemId) {
          widgetConfig.collectorItemIds = [widgetConfig.collectorItemId];
          delete widgetConfig.collectorItemId;
        }
        return widgetConfig;
      })
    );
    // Take the modified widgetConfig and upsert it.
    const upsertDashboardResult$ = newWidgetConfig$.pipe(
      switchMap(widgetConfig => {
        return this.dashboardService.upsertWidget(widgetConfig);
      }));

    // Take the new widget and the results from the API call
    // and have the dashboard service take this data to
    // publish the new config.
    zip(newWidgetConfig$, upsertDashboardResult$).pipe(
      map(([widgetConfig, upsertWidgetResponse]) => ({ widgetConfig, upsertWidgetResponse }))
    ).subscribe((result: IWidgetConfigResponse) => {
      if (result.widgetConfig !== null && typeof result.widgetConfig === 'object') {
        extend(result.widgetConfig, result.upsertWidgetResponse.widget);
      }

      this.dashboardService.upsertLocally(result.upsertWidgetResponse.component, result.widgetConfig);
      this.widgetComponent.state = WidgetState.READY;
      // Push the new config to the widget, which
      // will trigger whatever is subscribed to
      // widgetConfig$
      this.widgetComponent.widgetConfigSubject.next(result.widgetConfig);
      // if quality widget, send widget config to other quality components to update widgetConfigExists
      if (this.widgetComponent.widgetId === 'codeanalysis0') {
        this.dashboardService.dashboardQualitySubject.next(result.widgetConfig);
      }
      // if quality widget, startRefreshInterval for other quality components to update widgetConfigExists
      this.widgetComponent.startRefreshInterval();
    });
  }

  openDeleteConfirm() {
    const modalRef = this.modalService.open(DeleteConfirmModalComponent);
    if (!modalRef) {
      return;
    }
    modalRef.componentInstance.title = 'Delete Widget';
    modalRef.componentInstance.modalType = DeleteConfirmModalComponent;

    // copy from openConfig()
    modalRef.componentInstance.form = this.deleteForm;
    modalRef.componentInstance.id = 2;

    if (this.widgetComponent !== undefined) {
      this.widgetComponent.getCurrentWidgetConfig().subscribe(result => {
        modalRef.componentInstance.widgetConfig = result;
      });
      // Take form data, combine with widget config, and pass to update function
      modalRef.result.then((deleteConfig) => {
        if (!deleteConfig) {
          return;
        }
        this.widgetComponent.stopRefreshInterval();
        this.deleteWidgetConfig(deleteConfig);
      }).catch((error) => {
      });
    }
  }

  deleteWidgetConfig(widgetConfigToDelete: any): void {
    // Take the current config and prepare it for deleting
    const currWidgetConfig$ = this.widgetComponent.getCurrentWidgetConfig().pipe(
      map( widgetConfig => {
        extend(widgetConfig, widgetConfigToDelete);
        return widgetConfig;
      }),
      map((widgetConfig: any) => {
        if (widgetConfig.collectorItemId) {
          widgetConfig.collectorItemIds = [widgetConfig.collectorItemId];
          delete widgetConfig.collectorItemId;
        }
        return widgetConfig;
      })
    );

    // Take the widgetConfig and delete it.
    const deleteDashboardResult$ = currWidgetConfig$.pipe(
      switchMap(widgetConfig => {
        // response returned is component with collectorItems (including ones associated with widget that is being deleted)
        return this.dashboardService.deleteWidget(widgetConfig);
      }));

    // Take the new widget and the results from the API call
    // and have the dashboard service take this data to
    // publish the new config.
    zip(currWidgetConfig$, deleteDashboardResult$).pipe(
      map(([widgetConfig, deleteWidgetResponse]) => ({ widgetConfig, deleteWidgetResponse }))
    ).subscribe((result: IWidgetConfigResponse) => {
      if (result.widgetConfig !== null && typeof result.widgetConfig === 'object') {
        extend(result.widgetConfig, result.deleteWidgetResponse.widget);
      }

      this.dashboardService.deleteLocally(result.deleteWidgetResponse.component, result.widgetConfig);
      this.widgetComponent.state = WidgetState.CONFIGURE;
      // set widgetConfigExists to false for quality only if no other quality collector item exists
      if (this.widgetComponent.widgetId !== 'codeanalysis0' ||
        (!this.dashboardService.checkCollectorItemTypeExist('CodeQuality') &&
        !this.dashboardService.checkCollectorItemTypeExist('StaticSecurityScan') &&
        !this.dashboardService.checkCollectorItemTypeExist('LibraryPolicy') &&
        !this.dashboardService.checkCollectorItemTypeExist('Test'))
      ) {
        this.widgetComponent.widgetConfigExists = false;
      }
      // Push the new config to the widget, which
      // will trigger whatever is subscribed to
      // widgetConfig$
      this.widgetComponent.widgetConfigSubject.next();
      // if quality widget, send empty widget config to other quality components to update widgetConfigExists
      if (this.widgetComponent.widgetId === 'codeanalysis0') {
        this.dashboardService.dashboardQualitySubject.next();
      }
      this.widgetComponent.startRefreshInterval();
    });
  }

  openAudit() {
    const modalRef = this.modalService.open(AuditModalComponent);
    const auditResults: IAuditResult[] = [];
    auditResults.push(this.auditResult);
    if (this.auditResultOptional) {
      auditResults.push(this.auditResultOptional);
    }
    modalRef.componentInstance.auditResults = auditResults;
  }

  private detectChanges(): void {
    const destroyed = 'destroyed';
    if (!this.cdr[destroyed]) {
      this.cdr.detectChanges();
    }
  }

  findWidgetAuditStatus(auditType: any) {
    if (!auditType) {
      return;
    }
    let auditTypePrimary = auditType;
    let auditTypeOptional;
    if (auditType instanceof Array && Array.from(auditType).length > 1) {
      auditTypePrimary = auditType[0];
      auditTypeOptional = auditType[1];
    }
    this.dashboardService.dashboardAuditConfig$.pipe(map(result => result))
      .subscribe((auditResults: IAuditResult[]) => {
        this.auditResult = auditResults.find(auditResult => auditResult.auditType === auditTypePrimary);
        if (auditTypeOptional) {
          this.auditResultOptional = auditResults.find(auditResult => auditResult.auditType === auditTypeOptional);
        }
        const auditResultOpt: IAuditResult = this.auditResultOptional;
        if (this.auditResult) {
          if (this.auditResult.auditStatus === 'OK' && (!auditResultOpt || auditResultOpt.auditStatus === 'OK')) {
            this.auditStatus = 'OK';
          } else if (this.auditResult.auditStatus === 'FAIL' || (auditResultOpt && auditResultOpt.auditStatus === 'FAIL')) {
            this.auditStatus = 'FAIL';
          } else {
            this.auditStatus = this.auditResult.auditStatus;
          }
        }
    });
  }
  setAuditData(data: Observable<any>) {
    this.dashboardService.dashboardAuditConfig$ = data;
  }

  widgetState() {
    return WidgetState;
  }

  getCollectorType(title: string): string {
    let collectorType;
    switch (title) {
      case 'Feature': { collectorType = 'CodeQuality'; break; }
      case 'Build': { collectorType = 'Build'; break; }
      case 'Deploy': { collectorType = 'Deployment'; break; }
      case 'Repo': { collectorType = 'SCM'; break; }
      case 'Static Code Analysis': { collectorType = 'CodeQuality'; break; }
      case 'Security Analysis': { collectorType = 'StaticSecurityScan'; break; }
      case 'Open Source': { collectorType = 'LibraryPolicy'; break; }
      case 'Test': { collectorType = 'Test'; break; }
      default: { collectorType = ''; break; }
    }
    return collectorType;
  }

  findLastUpdatedTime(collectorType: string) {
    this.dashboardService.dashboardConfig$.pipe(take(1),
      map(dashboard => {
        const collectorItems = dashboard.application.components[0].collectorItems[collectorType];
        if (collectorItems && collectorItems[0] && ((collectorItems[0].lastUpdated % 1000) > 0)) {
          return moment(collectorItems[0].lastUpdated).fromNow(true);
        }
      })).subscribe(data => this.lastUpdated = data ? data + ' ago' : data);
  }

  get isOwnerOrAdmin(): boolean {
    const currentUser = this.auth.getUserName();
    let isOwner = false;
    this.dashboardService.dashboardConfig$.pipe(take(1),
      map(dashboard => {
        const owners = dashboard.owners;
        for (const owner of owners) {
          isOwner = (owner.username === currentUser || this.auth.isAdmin());
          if (isOwner) {
            break;
          }
        }
        return isOwner;
      })).subscribe(bool => isOwner = bool);
    return isOwner;
  }

}

