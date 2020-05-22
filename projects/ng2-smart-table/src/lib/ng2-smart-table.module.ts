import { NgModule, LOCALE_ID } from '@angular/core';
import { DatePipe, registerLocaleData } from '@angular/common';
import localeFr from '@angular/common/locales/fr';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { CellModule } from './components/cell/cell.module';
import { FilterModule } from './components/filter/filter.module';
import { PagerModule } from './components/pager/pager.module';
import { TBodyModule } from './components/tbody/tbody.module';
import { THeadModule } from './components/thead/thead.module';

import { Ng2SmartTableComponent } from './ng2-smart-table.component';
import { AngularMultiSelectModule } from 'angular2-multiselect-dropdown';
import { NgxWebstorageModule } from 'ngx-webstorage';

@NgModule({
  imports: [
    NgxWebstorageModule.forRoot(),
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    CellModule,
    FilterModule,
    PagerModule,
    TBodyModule,
    THeadModule,
    AngularMultiSelectModule,
  ],
  declarations: [
    Ng2SmartTableComponent,
  ],
  exports: [
    Ng2SmartTableComponent,
  ],
  providers: [
    {
      provide: LOCALE_ID,
      useValue: 'fr'
    },
    DatePipe
  ],
})
export class Ng2SmartTableModule {
  constructor() {
    registerLocaleData(localeFr);
  }
}
