import { BrowserModule } from '@angular/platform-browser';
import { NgModule, LOCALE_ID } from '@angular/core';
import { DatePipe, registerLocaleData } from '@angular/common';
import localeFr from '@angular/common/locales/fr';

import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';

import { Ng2SmartTableModule } from '../ng2-smart-table';
import { AngularMultiSelectModule } from 'angular2-multiselect-dropdown';

import { PagesModule } from './pages/pages.module';

import { AppComponent } from './app.component';

import { routes } from './app.routes';

import { ScrollPositionDirective } from './theme/directives/scrollPosition.directive';

@NgModule({
  declarations: [
    AppComponent,
    ScrollPositionDirective,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    RouterModule.forRoot(routes, { useHash: true }),
    Ng2SmartTableModule,
    AngularMultiSelectModule,
    PagesModule,
  ],
  providers: [
    {
      provide: LOCALE_ID,
      useValue: 'fr'
    },
    DatePipe
  ],
  bootstrap: [AppComponent],
})
export class AppModule {
  constructor() {
    registerLocaleData(localeFr);
  }
}
