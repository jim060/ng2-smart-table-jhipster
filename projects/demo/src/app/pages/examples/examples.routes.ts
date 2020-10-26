import { ModuleWithProviders } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ExamplesComponent } from './examples.component';
import { FilterExamplesComponent } from './filter/filter-examples.component';
import { ServerExamplesComponent } from './server/server-examples.component';
import { CustomViewEditExamplesComponent } from './custom-edit-view/custom-edit-view-examples.component';
import { VariousExamplesComponent } from './various/various-examples.component';
import { MultiSelectExamplesComponent } from './multiselect/multi-select-examples.component';
import { DateSelectExamplesComponent } from './dateselect/date-select-examples.component';
import { TimeSelectExamplesComponent } from './timeselect/time-select-examples.component';
import { NumberselectExamplesComponent } from './numberselect/numberselect-examples.component';

export const routes: Routes = [
  {
    path: '',
    component: ExamplesComponent,
    children: [
      {
        path: '',
        redirectTo: 'using-filters',
      },
      {
        path: 'using-filters',
        component: FilterExamplesComponent,
      },
      {
        path: 'populate-from-server',
        component: ServerExamplesComponent,
      },
      {
        path: 'custom-editors-viewers',
        component: CustomViewEditExamplesComponent,
      },
      {
        path: 'various',
        component: VariousExamplesComponent,
      },
      {
        path: 'multiselect',
        component: MultiSelectExamplesComponent,
      },
      {
        path: 'dateselect',
        component: DateSelectExamplesComponent,
      },
      {
        path: 'timeselect',
        component: TimeSelectExamplesComponent,
      },
      {
        path: 'numberselect',
        component: NumberselectExamplesComponent,
      },
    ],
  },
];
