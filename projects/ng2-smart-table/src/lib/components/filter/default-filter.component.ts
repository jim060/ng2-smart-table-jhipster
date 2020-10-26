import {Component, Input, OnInit} from '@angular/core';

import {FilterDefault} from './filter-default';

@Component({
  selector: 'lib-default-table-filter',
  template: `
    <ng-container [ngSwitch]="column.getFilterType()">
      <lib-select-filter *ngSwitchCase="'list'"
                         [query]="query"
                         [ngClass]="inputClass"
                         [column]="column"
                         (filter)="onFilter($event)">
      </lib-select-filter>
      <lib-checkbox-filter *ngSwitchCase="'checkbox'"
                           [query]="query"
                           [ngClass]="inputClass"
                           [column]="column"
                           (filter)="onFilter($event)">
      </lib-checkbox-filter>
      <lib-completer-filter *ngSwitchCase="'completer'"
                            [query]="query"
                            [ngClass]="inputClass"
                            [column]="column"
                            (filter)="onFilter($event)">
      </lib-completer-filter>
      <lib-date-filter *ngSwitchCase="'date'"
                       [query]="query"
                       [ngClass]="inputClass"
                       [column]="column"
                       [language]="language"
                       (filter)="onFilterDate($event)">
      </lib-date-filter>
      <lib-time-filter *ngSwitchCase="'time'"
                       [query]="query"
                       [ngClass]="inputClass"
                       [column]="column"
                       [language]="language"
                       (filter)="onFilterTime($event)">
      </lib-time-filter>
      <lib-number-filter *ngSwitchCase="'number'"
                         [query]="query"
                         [ngClass]="inputClass"
                         [column]="column"
                         [language]="language"
                         (filter)="onFilterNumber($event)">
      </lib-number-filter>
      <lib-mselect-filter *ngSwitchCase="'multiple'"
                          [query]="query"
                          [ngClass]="inputClass"
                          [column]="column"
                          [language]="language"
                          (filter)="onFilterMulti($event)">
      </lib-mselect-filter>
      <lib-input-filter *ngSwitchDefault
                        [query]="query"
                        [ngClass]="inputClass"
                        [column]="column"
                        (filter)="onFilter($event)">
      </lib-input-filter>
    </ng-container>
  `,
})
export class DefaultFilterComponent extends FilterDefault implements OnInit {
  @Input() query: string;

  ngOnInit() {
  }
}
