import { ModuleWithProviders } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ExamplesComponent } from './examples.component';
import { FilterExamplesComponent } from './filter/filter-examples.component';
import { ServerExamplesComponent } from './server/server-examples.component';
import { CustomViewEditExamplesComponent } from './custom-edit-view/custom-edit-view-examples.component';
import { VariousExamplesComponent } from './various/various-examples.component';
import { MultiselectExamplesComponent } from './multiselect/multiselect-examples.component';
import { DateselectExamplesComponent } from './dateselect/dateselect-examples.component';
import { TimeselectExamplesComponent } from './timeselect/timeselect-examples.component';
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
        component: MultiselectExamplesComponent,
      },
      {
        path: 'dateselect',
        component: DateselectExamplesComponent,
      },
      {
        path: 'timeselect',
        component: TimeselectExamplesComponent,
      },
      {
        path: 'numberselect',
        component: NumberselectExamplesComponent,
      },
    ],
  },
];
