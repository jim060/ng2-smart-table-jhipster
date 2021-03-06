import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { Ng2SmartTableModule } from 'ng2-smart-table';

import { SharedModule } from '../../shared/shared.module';
import { AngularMultiSelectModule } from 'angular2-multiselect-dropdown';
import { routes } from './examples.routes';
import { ExamplesComponent } from './examples.component';
import { AdvancedExampleFiltersComponent } from './filter/advanced-example-filters.component';
import { AdvancedExampleConfirmComponent } from './various/advanced-example-confirm.component';
import { AdvancedExamplesCustomEditorComponent } from './custom-edit-view/advanced-example-custom-editor.component';
import { AdvancedExamplesTypesComponent } from './custom-edit-view/advanced-example-types.component';
import { AdvancedExampleServerComponent } from './server/advanced-example-server.component';
import { BasicExampleLoadComponent } from './server/basic-example-load.component';
import { BasicExampleMultiSelectComponent } from './various/basic-example-multi-select.component';
import { CustomEditorComponent } from './custom-edit-view/custom-editor.component';
import { BasicExampleSourceComponent } from './filter/basic-example-source.component';
import { CustomRenderComponent } from './custom-edit-view/custom-render.component';
import { CustomFilterComponent } from './custom-edit-view/custom-filter.component';
import { FilterExamplesComponent } from './filter/filter-examples.component';
import { ServerExamplesComponent } from './server/server-examples.component';
import { CustomViewEditExamplesComponent } from './custom-edit-view/custom-edit-view-examples.component';
import { BasicExampleCustomActionsComponent } from './custom-edit-view/basic-example-custom-actions.component';
import { VariousExamplesComponent } from './various/various-examples.component';
import { MultiselectFilterExampleComponent } from './multiselect/multiselect-filter-example.component';
import { MultiSelectExamplesComponent } from './multiselect/multi-select-examples.component';
import { DateselectFilterExampleComponent } from './dateselect/dateselect-filter-example.component';
import { DateSelectExamplesComponent } from './dateselect/date-select-examples.component';
import { TimeselectFilterExampleComponent } from './timeselect/timeselect-filter-example.component';
import { TimeSelectExamplesComponent } from './timeselect/time-select-examples.component';
import { NumberSelectFilterExampleComponent } from './numberselect/number-select-filter-example.component';
import { NumberSelectExamplesComponent } from './numberselect/number-select-examples.component';

import {
  BasicExampleButtonViewComponent,
  ButtonViewComponent,
} from './custom-edit-view/basic-example-button-view.component';
import {BooleanSelectFilterExampleComponent} from "./booleanselect/booleanselect-filter-example.component";
import {BooleanSelectExamplesComponent} from "./booleanselect/boolean-select-examples.component";
import {DateTimeSelectExamplesComponent} from "./datetimeselect/date-time-select-examples.component";
import {DateTimeSelectFilterExampleComponent} from "./datetimeselect/dateTimeSelect-filter-example.component";

const EXAMPLES_COMPONENTS = [
  AdvancedExampleFiltersComponent,
  AdvancedExampleConfirmComponent,
  AdvancedExamplesCustomEditorComponent,
  AdvancedExamplesTypesComponent,
  AdvancedExampleServerComponent,
  BasicExampleLoadComponent,
  BasicExampleMultiSelectComponent,
  BasicExampleSourceComponent,
  CustomEditorComponent,
  CustomRenderComponent,
  CustomFilterComponent,
  FilterExamplesComponent,
  ServerExamplesComponent,
  CustomViewEditExamplesComponent,
  VariousExamplesComponent,
  MultiSelectExamplesComponent,
  MultiselectFilterExampleComponent,
  DateSelectExamplesComponent,
  DateselectFilterExampleComponent,
  TimeSelectExamplesComponent,
  TimeselectFilterExampleComponent,
  NumberSelectExamplesComponent,
  NumberSelectFilterExampleComponent,
  BasicExampleButtonViewComponent,
  BasicExampleCustomActionsComponent,
  ButtonViewComponent,
  BooleanSelectFilterExampleComponent,
  BooleanSelectExamplesComponent,
  DateTimeSelectExamplesComponent,
  DateTimeSelectFilterExampleComponent
];

@NgModule({
  imports: [
    CommonModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes),
    Ng2SmartTableModule,
    AngularMultiSelectModule,
    SharedModule,
  ],
  entryComponents: [
    CustomEditorComponent,
    CustomRenderComponent,
    CustomFilterComponent,
    ButtonViewComponent,
  ],
  declarations: [
    ExamplesComponent,
    ...EXAMPLES_COMPONENTS,
  ],
})
export class ExamplesModule { }
