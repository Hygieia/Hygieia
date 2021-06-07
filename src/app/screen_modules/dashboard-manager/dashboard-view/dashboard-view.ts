import { FeatureWidgetComponent } from "../../../widget_modules/feature/feature-widget/feature-widget.component";
import { FeatureConfigFormComponent } from "../../../widget_modules/feature/feature-config-form/feature-config-form.component";
import { FeatureDeleteFormComponent } from "../../../widget_modules/feature/feature-delete-form/feature-delete-form.component";
import { BuildWidgetComponent } from "../../../widget_modules/build/build-widget/build-widget.component";
import { BuildConfigFormComponent } from "../../../widget_modules/build/build-config-form/build-config-form.component";
import { BuildDeleteFormComponent } from "../../../widget_modules/build/build-delete-form/build-delete-form.component";
import { DeployWidgetComponent } from "../../../widget_modules/deploy/deploy-widget/deploy-widget.component";
import { DeployConfigFormComponent } from "../../../widget_modules/deploy/deploy-config-form/deploy-config-form.component";
import { DeployDeleteFormComponent } from "../../../widget_modules/deploy/deploy-delete-form/deploy-delete-form.component";
import { RepoWidgetComponent } from "../../../widget_modules/repo/repo-widget/repo-widget.component";
import { RepoConfigFormComponent } from "../../../widget_modules/repo/repo-config-form/repo-config-form.component";
import { RepoDeleteFormComponent } from "../../../widget_modules/repo/repo-delete-form/repo-delete-form.component";
// tslint:disable-next-line:max-line-length
import { StaticAnalysisWidgetComponent } from "../../../widget_modules/static-analysis/static-analysis-widget/static-analysis-widget.component";
import { SecurityScanWidgetComponent } from "../../../widget_modules/security-scan/security-scan-widget/security-scan-widget.component";
import { OSSWidgetComponent } from "../../../widget_modules/opensource-scan/oss-widget/oss-widget.component";
import { TestWidgetComponent } from "../../../widget_modules/test/test-widget/test-widget.component";
// tslint:disable-next-line:max-line-length
import { StaticAnalysisConfigFormComponent } from "../../../widget_modules/static-analysis/static-anaylsis-config-form/static-analysis-config-form.component";
import { SecurityScanConfigComponent } from "../../../widget_modules/security-scan/security-scan-config/security-scan-config.component";
import { OSSConfigFormComponent } from "../../../widget_modules/opensource-scan/oss-config-form/oss-config-form.component";
import { TestConfigFormComponent } from "../../../widget_modules/test/test-config-form/test-config-form.component";
// tslint:disable-next-line:max-line-length
import { StaticAnalysisDeleteFormComponent } from "../../../widget_modules/static-analysis/static-analysis-delete-form/static-analysis-delete-form.component";
// tslint:disable-next-line:max-line-length
import { SecurityScanDeleteFormComponent } from "../../../widget_modules/security-scan/security-scan-delete-form/security-scan-delete-form.component";
import { OSSDeleteFormComponent } from "../../../widget_modules/opensource-scan/oss-delete-form/oss-delete-form.component";
import { TestDeleteFormComponent } from "../../../widget_modules/test/test-delete-form/test-delete-form.component";

import { ProductWidgetComponent } from "../../../widget_modules/product/product-widget/product-widget.component";
import { ProductConfigFormComponent } from "../../../widget_modules/product/product-config-form/product-config-form.component";
import { ProductDeleteFormComponent } from "../../../widget_modules/product/product-delete-form/product-delete-form.component";

export interface IDashboardResponse {
  data: any;
}

export interface ITemplate {
  template: string;
}

export const widgetsAll = [
  {
    title: ["Feature"],
    component: [FeatureWidgetComponent],
    status: "Success",
    widgetSize: "col-xl-4",
    configForm: [FeatureConfigFormComponent],
    deleteForm: [FeatureDeleteFormComponent],
  },
  {
    title: ["Build"],
    component: [BuildWidgetComponent],
    status: "Success",
    widgetSize: "col-xl-6",
    configForm: [BuildConfigFormComponent],
    deleteForm: [BuildDeleteFormComponent],
  },
  {
    title: ["Deploy"],
    component: [DeployWidgetComponent],
    status: "Success",
    widgetSize: "col-xl-2",
    configForm: [DeployConfigFormComponent],
    deleteForm: [DeployDeleteFormComponent],
  },
  {
    title: ["Code Repo"],
    component: [RepoWidgetComponent],
    status: "Success",
    widgetSize: "col-xl-4",
    configForm: [RepoConfigFormComponent],
    deleteForm: [RepoDeleteFormComponent],
  },
  // Quality Widget
  {
    title: ["Static Code Analysis", "Security Analysis", "Open Source", "Test"],
    component: [
      StaticAnalysisWidgetComponent,
      SecurityScanWidgetComponent,
      OSSWidgetComponent,
      TestWidgetComponent,
    ],
    status: "Success",
    widgetSize: "col-xl-6",
    configForm: [
      StaticAnalysisConfigFormComponent,
      SecurityScanConfigComponent,
      OSSConfigFormComponent,
      TestConfigFormComponent,
    ],
    deleteForm: [
      StaticAnalysisDeleteFormComponent,
      SecurityScanDeleteFormComponent,
      OSSDeleteFormComponent,
      TestDeleteFormComponent,
    ],
  },
  // Product Widget
  {
    title: ["Product"],
    component: [ProductWidgetComponent],
    status: "Success",
    widgetSize: "col-xl-6",
    configForm: [ProductConfigFormComponent],
    deleteForm: [ProductDeleteFormComponent],
  },
  /*{
    title: ['Placeholder'],
    component: [PlaceholderWidgetComponent],
    status: 'Success',
    widgetSize: 'col-xl-2',
    configForm: [BuildConfigFormComponent],
    deleteForm: [BuildDeleteFormComponent]
  },*/
];
