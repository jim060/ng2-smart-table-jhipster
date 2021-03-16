import {Component, Input, OnDestroy, OnInit} from '@angular/core';

import {FilterDefaultComponent} from './filter-default.component';
import {Observable, Subject, Subscription} from 'rxjs';

@Component({
  selector: 'lib-default-table-filter',
  template: `
    <ng-container [ngSwitch]="column.getFilterType()">
      <lib-select-filter *ngSwitchCase="'list'"
                         [query]="query"
                         [tableID]="tableID"
                         [ngClass]="inputClass"
                         [column]="column"
                         (filter)="onFilter($event)"
                         [events]="eventsSubject.asObservable()">
      </lib-select-filter>
      <lib-checkbox-filter *ngSwitchCase="'checkbox'"
                           [query]="query"
                           [tableID]="tableID"
                           [ngClass]="inputClass"
                           [column]="column"
                           (filter)="onFilter($event)"
                           [events]="eventsSubject.asObservable()">
      </lib-checkbox-filter>
      <lib-completer-filter *ngSwitchCase="'completer'"
                            [query]="query"
                            [tableID]="tableID"
                            [ngClass]="inputClass"
                            [column]="column"
                            (filter)="onFilter($event)"
                            [events]="eventsSubject.asObservable()">
      </lib-completer-filter>
      <lib-date-filter *ngSwitchCase="'date'"
                       [query]="query"
                       [tableID]="tableID"
                       [ngClass]="inputClass"
                       [column]="column"
                       [language]="language"
                       (filter)="onFilterDate($event)"
                       [events]="eventsSubject.asObservable()">
      </lib-date-filter>
      <lib-time-filter *ngSwitchCase="'time'"
                       [query]="query"
                       [tableID]="tableID"
                       [ngClass]="inputClass"
                       [column]="column"
                       [language]="language"
                       (filter)="onFilterTime($event)"
                       [events]="eventsSubject.asObservable()">
      </lib-time-filter>
      <lib-date-time-filter *ngSwitchCase="'date-time'"
                       [query]="query"
                       [tableID]="tableID"
                       [ngClass]="inputClass"
                       [column]="column"
                       [language]="language"
                       (filter)="onFilterDateTime($event)"
                       [events]="eventsSubject.asObservable()">
      </lib-date-time-filter>
      <lib-number-filter *ngSwitchCase="'number'"
                         [query]="query"
                         [tableID]="tableID"
                         [ngClass]="inputClass"
                         [column]="column"
                         [language]="language"
                         (filter)="onFilterNumber($event)"
                         [events]="eventsSubject.asObservable()">
      </lib-number-filter>
      <lib-mselect-filter *ngSwitchCase="'multiple'"
                          [query]="query"
                          [tableID]="tableID"
                          [ngClass]="inputClass"
                          [column]="column"
                          [language]="language"
                          (filter)="onFilterMulti($event)"
                          [events]="eventsSubject.asObservable()">
      </lib-mselect-filter>
      <lib-custom-column-filter *ngSwitchCase="'custom-column'"
                          [query]="query"
                          [tableID]="tableID"
                          [ngClass]="inputClass"
                          [column]="column"
                          [language]="language"
                          (filter)="onFilterMulti($event)"
                          [events]="eventsSubject.asObservable()">
      </lib-custom-column-filter>
      <lib-input-filter *ngSwitchDefault
                        [query]="query"
                        [tableID]="tableID"
                        [ngClass]="inputClass"
                        [column]="column"
                        (filter)="onFilter($event)"
                        [events]="eventsSubject.asObservable()">
      </lib-input-filter>
    </ng-container>
  `,
})
export class DefaultFilterComponent extends FilterDefaultComponent implements OnInit, OnDestroy {
  @Input() query: string;
  @Input() events: Observable<void>;
  eventsSubject: Subject<void> = new Subject<void>();
  eventsSubscription: Subscription;

  ngOnInit() {
     this.eventsSubscription = this.events.subscribe(() => {
      this.eventsSubject.next();
    });
  }

  ngOnDestroy() {
    super.ngOnDestroy();
    this.eventsSubscription.unsubscribe();
  }
}
