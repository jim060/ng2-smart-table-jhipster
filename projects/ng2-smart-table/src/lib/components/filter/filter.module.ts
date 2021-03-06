import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Ng2CompleterModule } from '@akveo/ng2-completer';
import { AngularMultiSelectModule } from 'angular2-multiselect-dropdown';
import { HttpClientModule } from '@angular/common/http';

import { FilterComponent } from './filter.component';
import { DefaultFilterComponent } from './default-filter.component';
import { CustomFilterComponent } from './custom-filter.component';
import { CheckboxFilterComponent } from './filter-types/checkbox-filter.component';
import { CompleterFilterComponent } from './filter-types/completer-filter.component';
import { InputFilterComponent } from './filter-types/input-filter.component';
import { SelectFilterComponent } from './filter-types/select-filter.component';
import { DateFilterComponent } from './filter-types/date-filter.component';
import { TimeFilterComponent } from './filter-types/time-filter.component';
import { NumberFilterComponent } from './filter-types/number-filter.component';
import { MselectFilterComponent } from './filter-types/mselect-filter.component';
import { DefaultFilterTypeComponent } from './filter-types/default-filter-type.component';
import { FilterDefaultComponent } from './filter-default.component';
import {CustomColumnFilterComponent} from "./filter-types/custom-column-filter.component";
import {DateTimeFilterComponent} from "./filter-types/date-time-filter.component";

const FILTER_COMPONENTS = [
  FilterDefaultComponent,
  DefaultFilterTypeComponent,
  FilterComponent,
  DefaultFilterComponent,
  CustomFilterComponent,
  CheckboxFilterComponent,
  CompleterFilterComponent,
  InputFilterComponent,
  SelectFilterComponent,
  DateFilterComponent,
  TimeFilterComponent,
  NumberFilterComponent,
  MselectFilterComponent,
  CustomColumnFilterComponent,
  DateTimeFilterComponent
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    Ng2CompleterModule,
    AngularMultiSelectModule,
    HttpClientModule
  ],
  declarations: [
    ...FILTER_COMPONENTS,
  ],
  exports: [
    ...FILTER_COMPONENTS,
  ],
})
export class FilterModule { }
